from django.urls import path
from .views import (
    VehiculeListCreateAPIView, 
    VehiculeDetailAPIView, 
    TotalListCreateAPIView,
    JawazListCreateAPIView
)

urlpatterns = [
    path('vehicules/', VehiculeListCreateAPIView.as_view(), name='vehicule-list-create'),
    path('vehicules/<int:pk>/', VehiculeDetailAPIView.as_view(), name='vehicule-detail'),
    path('total/', TotalListCreateAPIView.as_view(), name='total-list-create'), 
    path('jawaz/', JawazListCreateAPIView.as_view(), name='jawaz-list-create'),
]