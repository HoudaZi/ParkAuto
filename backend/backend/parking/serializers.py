from rest_framework import serializers
from .models import Vehicule
from .models import Total
from .models import Jawaz

class VehiculeListSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        result = [self.child.create(attrs) for attrs in validated_data]
        return result

class VehiculeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicule
        fields = '__all__'
        list_serializer_class = VehiculeListSerializer
        extra_kwargs = {
            'immatriculation': {'validators': []}
        }
        
        
class TotalSerializer(serializers.ModelSerializer):
    type_vehicule = serializers.CharField(read_only=True)
    class Meta:
        model = Total
        fields = '__all__'



class JawazSerializer(serializers.ModelSerializer):
    type_vehicule = serializers.ReadOnlyField()
    ville = serializers.ReadOnlyField()

    class Meta:
        model = Jawaz
        fields = ['id', 'immatriculation', 'type_vehicule', 'ville', 'vehicule']
        
