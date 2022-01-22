from django.urls import path
from . import views

app_name    = "shop"
urlpatterns = [
    path('', views.index, name="index"),
    path('contact/', views.contact, name="contact"),
    path('pattern/', views.pattern, name="pattern"),
    path('pattern_mod/', views.pattern_mod, name="pattern_mod"),
    path('pattern_mod/<int:pk>/', views.pattern_mod, name="pattern_mod_single"),
]
