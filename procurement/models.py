from django.db import models

class PurchaseOrder(models.Model):
    no = models.CharField(max_length=64)
    date = models.DateField()
    dept = models.CharField(max_length=128, blank=True)
    supplier = models.CharField(max_length=256, blank=True)
    tin = models.CharField(max_length=64, blank=True)
    address = models.TextField(blank=True)
    contact_person = models.CharField(max_length=128, blank=True)
    contact_number = models.CharField(max_length=64, blank=True)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    prepared_by = models.CharField(max_length=128, blank=True)
    checked_by = models.CharField(max_length=128, blank=True)
    approved_by = models.CharField(max_length=128, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PO {self.no}"

class POItem(models.Model):
    po = models.ForeignKey(PurchaseOrder, related_name='items', on_delete=models.CASCADE)
    qty = models.FloatField(default=0)
    unit = models.CharField(max_length=64, blank=True)
    description = models.TextField(blank=True)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.description} ({self.qty})"

class RequestPayment(models.Model):
    no = models.CharField(max_length=64)
    date = models.DateField()
    payee = models.CharField(max_length=256, blank=True)
    tin = models.CharField(max_length=64, blank=True)
    action_required = models.CharField(max_length=64, blank=True, null=True)
    mode_of_payment = models.CharField(max_length=256, blank=True, null=True)
    payment_for = models.CharField(max_length=256, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    remarks = models.TextField(blank=True)
    invoice = models.FileField(upload_to='invoices/', blank=True, null=True)
    requested_by = models.CharField(max_length=128, blank=True)
    checked_by = models.CharField(max_length=128, blank=True)
    recommend_approval = models.CharField(max_length=128, blank=True)
    approved_by = models.CharField(max_length=128, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"RP {self.no}"

class PurchaseRequisition(models.Model):
    no = models.CharField(max_length=64)
    date = models.DateField()
    requester = models.CharField(max_length=128, blank=True)
    dept = models.CharField(max_length=128, blank=True)
    date_needed = models.DateField(blank=True, null=True)
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"PR {self.no}"

class PRItem(models.Model):
    pr = models.ForeignKey(PurchaseRequisition, related_name='items', on_delete=models.CASCADE)
    stk = models.CharField(max_length=64, blank=True)
    qty = models.FloatField(default=0)
    unit = models.CharField(max_length=64, blank=True)
    desc = models.TextField(blank=True)
    remark = models.TextField(blank=True)

    def __str__(self):
        return f"{self.desc} ({self.qty})"
