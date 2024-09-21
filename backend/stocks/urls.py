# stocks/urls.py
from django.urls import path
from .views import get_stock_data

urlpatterns = [
    path('api/stock/<str:symbol>/', get_stock_data, name='get_stock_data'),
]
