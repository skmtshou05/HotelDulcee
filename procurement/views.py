import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from .models import PurchaseOrder, POItem, RequestPayment, PurchaseRequisition, PRItem
from django.forms.models import model_to_dict

def index(request):
    return render(request, 'index.html')

def serialize_po(po):
    data = model_to_dict(po, exclude=['created_at'])
    data['items'] = [model_to_dict(it, exclude=[]) for it in po.items.all()]
    return data

def serialize_rp(rp):
    data = model_to_dict(rp, exclude=['created_at'])
    if rp.invoice:
        data['invoice_url'] = rp.invoice.url
    return data

def serialize_pr(pr):
    data = model_to_dict(pr, exclude=['created_at'])
    data['items'] = [model_to_dict(it, exclude=[]) for it in pr.items.all()]
    return data

@csrf_exempt
def po_list(request):
    try:
        if request.method == 'GET':
            q = PurchaseOrder.objects.all().order_by('-id')
            return JsonResponse([serialize_po(p) for p in q], safe=False)

        if request.method == 'POST':
            try:
                payload = json.loads(request.body.decode('utf-8'))
            except Exception as e:
                return JsonResponse({'error': f'Invalid JSON: {str(e)}'}, status=400)

            po = PurchaseOrder.objects.create(
                no=payload.get('no',''),
                date=payload.get('date'),
                dept=payload.get('dept',''),
                supplier=payload.get('supplier',''),
                tin=payload.get('tin',''),
                address=payload.get('address',''),
                contact_person=payload.get('contact_person',''),
                contact_number=payload.get('contact_number',''),
                total=payload.get('total') or 0,
                prepared_by=payload.get('prepared_by',''),
                checked_by=payload.get('checked_by',''),
                approved_by=payload.get('approved_by',''),
            )
            for it in payload.get('items',[]):
                POItem.objects.create(
                    po=po,
                    qty=it.get('qty') or 0,
                    unit=it.get('unit',''),
                    description=it.get('description',''),
                    unit_cost=it.get('unit_cost') or 0,
                    total=it.get('total') or 0,
                )
            return JsonResponse(serialize_po(po), status=201)

        return JsonResponse({'error': 'Method not allowed'}, status=405)
    except Exception as e:
        import traceback
        print(f'Error in po_list: {str(e)}')
        traceback.print_exc()
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)

@csrf_exempt
def po_detail(request, pk):
    try:
        po = get_object_or_404(PurchaseOrder, pk=pk)
        if request.method == 'GET':
            return JsonResponse(serialize_po(po))
        if request.method == 'DELETE':
            po.delete()
            return JsonResponse({'deleted': True})
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)

@csrf_exempt
def rp_list(request):
    try:
        if request.method == 'GET':
            q = RequestPayment.objects.all().order_by('-id')
            return JsonResponse([serialize_rp(p) for p in q], safe=False)

        if request.method == 'POST':
            # handle multipart/form-data for invoice file
            no = request.POST.get('no','')
            date = request.POST.get('date')
            rp = RequestPayment.objects.create(
                no=no,
                date=date,
                payee=request.POST.get('payee',''),
                tin=request.POST.get('tin',''),
                action_required=request.POST.get('action_required',''),
                mode_of_payment=request.POST.get('mode_of_payment',''),
                payment_for=request.POST.get('payment_for',''),
                amount=request.POST.get('amount') or 0,
                remarks=request.POST.get('remarks',''),
                requested_by=request.POST.get('requested_by',''),
                checked_by=request.POST.get('checked_by',''),
                recommend_approval=request.POST.get('recommend_approval',''),
                approved_by=request.POST.get('approved_by',''),
            )
            if 'invoice' in request.FILES:
                rp.invoice = request.FILES['invoice']
                rp.save()
            return JsonResponse(serialize_rp(rp), status=201)

        return JsonResponse({'error': 'Method not allowed'}, status=405)
    except Exception as e:
        import traceback
        print(f'Error in rp_list: {str(e)}')
        traceback.print_exc()
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)

@csrf_exempt
def rp_detail(request, pk):
    try:
        rp = get_object_or_404(RequestPayment, pk=pk)
        if request.method == 'GET':
            return JsonResponse(serialize_rp(rp))
        if request.method == 'DELETE':
            rp.delete()
            return JsonResponse({'deleted': True})
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)

@csrf_exempt
def pr_list(request):
    try:
        if request.method == 'GET':
            q = PurchaseRequisition.objects.all().order_by('-id')
            return JsonResponse([serialize_pr(p) for p in q], safe=False)

        if request.method == 'POST':
            try:
                payload = json.loads(request.body.decode('utf-8'))
            except Exception as e:
                return JsonResponse({'error': f'Invalid JSON: {str(e)}'}, status=400)

            pr = PurchaseRequisition.objects.create(
                no=payload.get('no',''),
                date=payload.get('date'),
                requester=payload.get('requester',''),
                dept=payload.get('dept',''),
                date_needed=payload.get('date_needed') or None,
                remarks=payload.get('remarks',''),
            )
            for it in payload.get('items',[]):
                PRItem.objects.create(
                    pr=pr,
                    stk=it.get('stk',''),
                    qty=it.get('qty') or 0,
                    unit=it.get('unit',''),
                    desc=it.get('desc',''),
                    remark=it.get('remark',''),
                )
            return JsonResponse(serialize_pr(pr), status=201)

        return JsonResponse({'error': 'Method not allowed'}, status=405)
    except Exception as e:
        import traceback
        print(f'Error in pr_list: {str(e)}')
        traceback.print_exc()
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)

@csrf_exempt
def pr_detail(request, pk):
    try:
        pr = get_object_or_404(PurchaseRequisition, pk=pk)
        if request.method == 'GET':
            return JsonResponse(serialize_pr(pr))
        if request.method == 'DELETE':
            pr.delete()
            return JsonResponse({'deleted': True})
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return JsonResponse({'error': f'Server error: {str(e)}'}, status=500)
