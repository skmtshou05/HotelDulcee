from django.contrib import admin
from . import models

@admin.register(models.PurchaseOrder)
class PurchaseOrderAdmin(admin.ModelAdmin):
    list_display = ('no', 'date', 'dept', 'supplier', 'total')

@admin.register(models.POItem)
class POItemAdmin(admin.ModelAdmin):
    list_display = ('description','qty','unit_cost','total','po')

@admin.register(models.RequestPayment)
class RequestPaymentAdmin(admin.ModelAdmin):
    list_display = ('no','date','payee','amount')

@admin.register(models.PurchaseRequisition)
class PurchaseRequisitionAdmin(admin.ModelAdmin):
    list_display = ('no','date','requester','dept')

@admin.register(models.PRItem)
class PRItemAdmin(admin.ModelAdmin):
    list_display = ('desc','qty','pr')
