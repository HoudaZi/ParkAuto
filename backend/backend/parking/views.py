import re
import unicodedata
from datetime import datetime, date, time, timedelta
from decimal import Decimal, InvalidOperation
from django.db import transaction as db_transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView
from .models import Vehicule, Total, Jawaz
from .serializers import VehiculeSerializer, TotalSerializer, JawazSerializer

class VehiculeListCreateAPIView(APIView):
    def get(self, request):
        vehicules = Vehicule.objects.all().order_by("-id")
        serializer = VehiculeSerializer(vehicules, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        data = request.data
        items = data if isinstance(data, list) else [data]
        if not items:
            return Response(
                {"error": "Aucune donnée valide à importer."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        def validate_date(date_str):
            if not date_str:
                return None
            try:
                parts = str(date_str).split('-')
                if len(parts) == 3:
                    year, month, day = int(parts[0]), int(parts[1]), int(parts[2])
                    datetime(year, month, day)
                return date_str
            except (ValueError, TypeError):
                return None
        success_count = 0
        try:
            with db_transaction.atomic():
                for item in items:
                    immat = str(item.get('immatriculation', '')).strip().upper()
                    if not immat or immat == 'N/A':
                        continue
                    Vehicule.objects.update_or_create(
                        immatriculation__iexact=immat,
                        defaults={
                            'immatriculation': immat,
                            'type_vehicule': item.get('type_vehicule', 'Sans affectation') or 'Sans affectation',
                            'ville': item.get('ville') or None,
                            'chauffeur': item.get('chauffeur') or None,
                            'contact': item.get('contact') or None,
                            'assurance_fin': validate_date(item.get('assurance_fin')),
                            'visite_technique': validate_date(item.get('visite_technique')),
                            'vignettes': validate_date(item.get('vignettes')),
                            'mise_en_circulation': validate_date(item.get('mise_en_circulation')),
                            'permis_circulation': validate_date(item.get('permis_circulation')),
                        }
                    )
                    success_count += 1
            return Response(
                {"message": "Importation réussie", "count": success_count},
                status=status.HTTP_201_CREATED
            )
        except Exception as exc:
            return Response(
                {"error": f"Erreur lors de l'importation des véhicules : {str(exc)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


class VehiculeDetailAPIView(APIView):
    def get_object(self, pk):
        try:
            return Vehicule.objects.get(pk=pk)
        except Vehicule.DoesNotExist:
            return None
    def get(self, request, pk):
        vehicule = self.get_object(pk)
        if not vehicule:
            return Response({"error": "Véhicule introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer = VehiculeSerializer(vehicule)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def put(self, request, pk):
        vehicule = self.get_object(pk)
        if not vehicule:
            return Response({"error": "Véhicule introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer = VehiculeSerializer(vehicule, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, pk):
        vehicule = self.get_object(pk)
        if not vehicule:
            return Response({"error": "Véhicule introuvable"}, status=status.HTTP_404_NOT_FOUND)
        serializer = VehiculeSerializer(vehicule, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def delete(self, request, pk):
        vehicule = self.get_object(pk)
        if not vehicule:
            return Response({"error": "Véhicule introuvable"}, status=status.HTTP_404_NOT_FOUND)
        
        vehicule.delete()
        return Response({"message": "Véhicule supprimé avec succès"}, status=status.HTTP_204_NO_CONTENT)

def normalize_key(value):
    value = str(value or "").strip().lower()
    value = unicodedata.normalize("NFD", value)
    value = "".join(
        char for char in value
        if unicodedata.category(char) != "Mn"
    )
    return re.sub(r"[^a-z0-9]+", " ", value).strip()
def get_row_value(row, *aliases):
    normalized_row = {
        normalize_key(key): value
        for key, value in row.items()
        if key is not None
    }
    normalized_aliases = [normalize_key(alias) for alias in aliases]
    for alias in normalized_aliases:
        if alias in normalized_row and normalized_row[alias] not in (None, ""):
            return normalized_row[alias]
    matches = []
    for key, value in normalized_row.items():
        for alias in normalized_aliases:
            if alias and (key.startswith(alias) or alias.startswith(key)):
                if value not in (None, ""):
                    matches.append(value)
                break
    if len(matches) >= 1:
        return matches[0]
    return None
def clean_text(value):
    if value is None:
        return ""
    return str(value).strip()

def parse_decimal(value):
    if value is None or str(value).strip() == "":
        return None
    if isinstance(value, bool):
        return None
    if isinstance(value, (int, float, Decimal)):
        try:
            return Decimal(str(value))
        except InvalidOperation:
            return None
    text = str(value).strip()
    text = text.replace("\u00a0", "").replace(" ", "")
    text = text.replace("MAD", "").replace("DH", "")
    if "," in text and "." in text:
        if text.rfind(",") > text.rfind("."):
            text = text.replace(".", "").replace(",", ".")
        else:
            text = text.replace(",", "")
    elif "," in text:
        text = text.replace(",", ".")
    try:
        result = Decimal(text)
        return result if result.is_finite() else None
    except InvalidOperation:
        return None

def parse_integer(value):
    number = parse_decimal(value)
    if number is None:
        return None
    try:
        return int(number)
    except (ValueError, TypeError, OverflowError):
        return None
def parse_date(value):
    if value is None or str(value).strip() == "":
        return None
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, date):
        return value
    if isinstance(value, (int, float)):
        try:
            return (datetime(1899, 12, 30) + timedelta(days=float(value))).date()
        except Exception:
            return None
    text = str(value).strip()
    formats = (
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%Y/%m/%d",
        "%d/%m/%y",
    )
    for fmt in formats:
        try:
            return datetime.strptime(text[:10], fmt).date()
        except ValueError:
            continue
    return None

def parse_time(value):
    if value is None or str(value).strip() == "":
        return None
    if isinstance(value, time):
        return value.replace(tzinfo=None)
    if isinstance(value, datetime):
        return value.time().replace(tzinfo=None)
    if isinstance(value, (int, float)):
        try:
            seconds = round(float(value) * 86400) % 86400
            return (datetime.min + timedelta(seconds=seconds)).time()
        except Exception:
            return None
    text = str(value).strip()
    for fmt in ("%H:%M:%S", "%H:%M"):
        try:
            return datetime.strptime(text, fmt).time()
        except ValueError:
            continue
    return None

class TotalListCreateAPIView(APIView):
    def get(self, request):
        transactions = Total.objects.all().order_by("-date_tran", "-id")
        serializer = TotalSerializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        items = request.data
        if isinstance(items, dict):
            if isinstance(items.get("transactions"), list):
                items = items["transactions"]
            else:
                items = [items]
        if not isinstance(items, list) or not items:
            return Response(
                {"error": "Aucune transaction valide à importer."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        prepared = []
        for item in items:
            registration = clean_text(
                get_row_value(
                    item,
                    "immatriculation",
                    "Immatriculation",
                    "Matricule",
                    "Plaque",
                )
            ).upper()
            previous_km = parse_integer(
                get_row_value(
                    item,
                    "kil_precedent",
                    "Kilométrage précédent",
                    "Km précédent",
                    "Kil précédent",
                )
            )
            current_km = parse_integer(
                get_row_value(
                    item,
                    "kil_actuelle",
                    "Kilométrage actuel",
                    "Kilométrage actuelle",
                    "Km actuel",
                    "Kil actuelle",
                )
            )
            amount = parse_decimal(
                get_row_value(
                    item,
                    "montant",
                    "Montant total",
                    "Montant",
                )
            )
            volume = parse_decimal(
                get_row_value(
                    item,
                    "volume",
                    "Volume",
                )
            )
            transaction_date = parse_date(
                get_row_value(
                    item,
                    "date_tran",
                    "Date de transaction",
                    "Date transaction",
                    "Date",
                )
            )
            vehicule_obj = None
            if registration and registration != "N/A":
                vehicule_obj = Vehicule.objects.filter(immatriculation__iexact=registration.strip()).first()
            prepared.append({
                "num_filaile": parse_integer(get_row_value(item, "num_filaile", "Numéro de la filiale", "Numéro filiale")),
                "nom_filaile": clean_text(get_row_value(item, "nom_filaile", "Nom de la filiale")),
                "nom_client": clean_text(get_row_value(item, "nom_client", "Nom client")),
                "no_client": clean_text(get_row_value(item, "no_client", "No. du client", "Numéro client")),
                "num_paiement": clean_text(get_row_value(item, "num_paiement", "Numéro paiement", "Moyen de paiement")),
                "immatriculation": registration or "N/A",
                "vehicule": vehicule_obj,
                "kil_precedent": previous_km,
                "kil_actuelle": current_km,
                "date_tran": transaction_date,
                "heure_tran": parse_time(get_row_value(item, "heure_tran", "Heure de transaction", "Heure")),
                "num_ticket": clean_text(get_row_value(item, "num_ticket", "Numéro de ticket")),
                "num_station": clean_text(get_row_value(item, "num_station", "Numéro de la station", "Numéro station")),
                "nom_station": clean_text(get_row_value(item, "nom_station", "Nom de la station", "Nom station")),
                "num_terminal": clean_text(get_row_value(item, "num_terminal", "Numéro de terminal")),
                "nom_pompiste": clean_text(get_row_value(item, "nom_pompiste", "Nom de pompiste")),
                "type_tran": clean_text(get_row_value(item, "type_tran", "Type de transaction")),
                "nom_tran": clean_text(get_row_value(item, "nom_tran", "Nom de transaction")),
                "montant_auto": parse_decimal(get_row_value(item, "montant_auto", "Montant Pré-autorisé", "Montant autorisé")),
                "solde_avant": parse_decimal(get_row_value(item, "solde_avant", "Solde avant")),
                "nom_produit": clean_text(get_row_value(item, "nom_produit", "Nom de produit")),
                "prix_unitaire": parse_decimal(get_row_value(item, "prix_unitaire", "Prix unitaire")),
                "volume": volume,
                "montant": amount,
                "chrone_SAM": clean_text(get_row_value(item, "chrone_SAM", "Chrono SAM")),
                "atc": clean_text(get_row_value(item, "atc", "ATC")),
                "code_autorisation": clean_text(get_row_value(item, "code_autorisation", "Code d'autorisation")),
            })
        try:
            with db_transaction.atomic():
                Total.objects.bulk_create([
                    Total(**row) for row in prepared
                ])
        except Exception as exc:
            return Response(
                {
                    "error": "Erreur pendant l'enregistrement.",
                    "details": str(exc),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {
                "message": "Importation réussie.",
                "count": len(prepared),
            },
            status=status.HTTP_201_CREATED,
        )
        
        
        
        
        
        
        
class JawazListCreateAPIView(ListCreateAPIView):
    queryset = Jawaz.objects.all().order_by("-id")
    serializer_class = JawazSerializer

    def get(self, request, *args, **kwargs):
        transactions = self.get_queryset()
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data
        if isinstance(data, dict):
            immat = data.get('immatriculation') or data.get('Matricule')
            if immat:
                clean_immat = str(immat).strip().upper()
                if not Jawaz.objects.filter(immatriculation__iexact=clean_immat).exists():
                    vehicule_obj = Vehicule.objects.filter(immatriculation__iexact=clean_immat).first()
                    Jawaz.objects.create(immatriculation=clean_immat, vehicule=vehicule_obj)
                    return Response({"message": "Ajouté avec succès !"}, status=status.HTTP_201_CREATED)
                return Response({"error": "Cette immatriculation existe déjà."}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Immatriculation invalide."}, status=status.HTTP_400_BAD_REQUEST)

        # Cas d'un import en masse (tableau/liste depuis un fichier Excel)
        elif isinstance(data, list):
            imported_count = 0
            duplicate_count = 0

            with db_transaction.atomic():
                for item in data:
                    immat = item.get('Matricule') or item.get('immatriculation') or item.get('IMMATRICULATION')
                    if immat:
                        clean_immat = str(immat).strip().upper()
                        if not Jawaz.objects.filter(immatriculation__iexact=clean_immat).exists():
                            vehicule_obj = Vehicule.objects.filter(immatriculation__iexact=clean_immat).first()
                            Jawaz.objects.create(immatriculation=clean_immat, vehicule=vehicule_obj)
                            imported_count += 1
                        else:
                            duplicate_count += 1

            return Response({
                "message": f"Importation réussie : {imported_count} ajoutés, {duplicate_count} doublons ignorés."
            }, status=status.HTTP_201_CREATED)

        return Response({"error": "Format de données invalide."}, status=status.HTTP_400_BAD_REQUEST)