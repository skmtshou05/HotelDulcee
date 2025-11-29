from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    # Purchase Orders
    path('api/purchase_orders/', views.po_list, name='po_list'),
    path('api/purchase_orders/<int:pk>/', views.po_detail, name='po_detail'),
    # Request Payments
    path('api/request_payments/', views.rp_list, name='rp_list'),
    path('api/request_payments/<int:pk>/', views.rp_detail, name='rp_detail'),
    # Purchase Requisitions
    path('api/purchase_requisitions/', views.pr_list, name='pr_list'),
    path('api/purchase_requisitions/<int:pk>/', views.pr_detail, name='pr_detail'),
]
