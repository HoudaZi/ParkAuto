from django.db import models


class Vehicule(models.Model):
    type_vehicule = models.CharField(max_length=100, verbose_name="Type de véhicule")
    immatriculation = models.CharField(max_length=50, unique=True, verbose_name="Immatriculation")
    ville = models.CharField(max_length=100, blank=True, null=True, verbose_name="Ville")
    chauffeur = models.CharField(max_length=100, blank=True, null=True, verbose_name="Chauffeur")
    contact = models.CharField(max_length=50, blank=True, null=True, verbose_name="Contact")
    assurance_fin = models.DateField(null=True, blank=True)
    visite_technique = models.DateField(null=True, blank=True)
    vignettes = models.DateField(null=True, blank=True)
    mise_en_circulation = models.DateField(null=True, blank=True)
    permis_circulation = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.immatriculation} - {self.type_vehicule}"


class Total(models.Model):
    num_filaile = models.IntegerField(blank=True, null=True, verbose_name="Numéro de filiale")
    nom_filaile = models.CharField(max_length=150, blank=True, null=True, verbose_name="Nom de filiale")
    nom_client = models.CharField(max_length=150, blank=True, null=True, verbose_name="Nom client")
    no_client = models.CharField(max_length=50, blank=True, null=True, verbose_name="Numéro client")
    num_paiement = models.CharField(max_length=50, blank=True, null=True, verbose_name="Numéro paiement")

    immatriculation = models.CharField(max_length=50, blank=True, null=True, verbose_name="Immatriculation")
    
    vehicule = models.ForeignKey(
        Vehicule,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions",
        verbose_name="Véhicule"
    )

    kil_precedent = models.IntegerField(blank=True, null=True, verbose_name="Kilométrage précédent")
    kil_actuelle = models.IntegerField(blank=True, null=True, verbose_name="Kilométrage actuel")
    date_tran = models.DateField(blank=True, null=True, verbose_name="Date de transaction")
    heure_tran = models.TimeField(blank=True, null=True, verbose_name="Heure de transaction")
    num_ticket = models.CharField(max_length=50, blank=True, null=True, verbose_name="Numéro de ticket")
    num_station = models.CharField(max_length=50, blank=True, null=True, verbose_name="Numéro de station")
    nom_station = models.CharField(max_length=150, blank=True, null=True, verbose_name="Nom de station")
    num_terminal = models.CharField(max_length=50, blank=True, null=True, verbose_name="Numéro de terminal")
    nom_pompiste = models.CharField(max_length=100, blank=True, null=True, verbose_name="Nom du pompiste")
    type_tran = models.CharField(max_length=50, blank=True, null=True, verbose_name="Type de transaction")
    nom_tran = models.CharField(max_length=100, blank=True, null=True, verbose_name="Nom de transaction")
    montant_auto = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Montant autorisé")
    solde_avant = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Solde avant")
    nom_produit = models.CharField(max_length=100, blank=True, null=True, verbose_name="Nom du produit")
    prix_unitaire = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Prix unitaire")
    volume = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Volume")
    montant = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, verbose_name="Montant total")
    chrone_SAM = models.CharField(max_length=100, blank=True, null=True, verbose_name="Chrono SAM")
    atc = models.CharField(max_length=100, blank=True, null=True, verbose_name="ATC")
    code_autorisation = models.CharField(max_length=100, blank=True, null=True, verbose_name="Code d'autorisation")
    
    @property
    def type_vehicule(self):
        if self.vehicule and self.vehicule.type_vehicule:
            return self.vehicule.type_vehicule
        
        if self.immatriculation:
            clean_immat = self.immatriculation.strip()
            v = Vehicule.objects.filter(immatriculation__iexact=clean_immat).first()
            if v:
                return v.type_vehicule
                
        return "Non défini"

    def __str__(self):
        return f"Ticket {self.num_ticket or 'N/A'} - {self.immatriculation or 'Inconnu'} ({self.montant or 0} MAD)"
    
    
    
class Jawaz(models.Model):
    immatriculation = models.CharField(max_length=50, blank=True, null=True, verbose_name="Immatriculation")
    vehicule = models.ForeignKey(
        Vehicule,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="jawaz_transactions", 
        verbose_name="Véhicule"
    )
    
    @property
    def type_vehicule(self):
        if self.vehicule and self.vehicule.type_vehicule:
            return self.vehicule.type_vehicule
        
        if self.immatriculation:
            clean_immat = self.immatriculation.strip()
            v = Vehicule.objects.filter(immatriculation__iexact=clean_immat).first()
            if v:
                return v.type_vehicule
                
        return "Non défini"

    @property
    def ville(self):
        if self.vehicule and self.vehicule.ville:
            return self.vehicule.ville
        
        if self.immatriculation:
            clean_immat = self.immatriculation.strip()
            v = Vehicule.objects.filter(immatriculation__iexact=clean_immat).first()
            if v and v.ville:
                return v.ville
                
        return "N/A"

    def __str__(self):
        return f"Jawaz - {self.immatriculation or 'Inconnu'}"