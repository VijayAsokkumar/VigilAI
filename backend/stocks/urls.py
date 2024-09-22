# stocks/urls.py
from django.urls import path
from .views import get_stock_data, company_news, industry_news, stock_performance

urlpatterns = [
    path('api/stock/<str:symbol>/', get_stock_data, name='get_stock_data'),
    path('api/news/<str:symbol>/', company_news, name='company_news'),
    path('api/industry-news/<str:symbol>/', industry_news, name='industry_news'),
    path('api/performance/<str:symbol>/', stock_performance, name='stock_performance'),
]
