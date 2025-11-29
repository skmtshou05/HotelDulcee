# Hotel Dulcee — Django Conversion

This repository contains a minimal Django scaffold that serves the existing frontend and provides basic JSON API endpoints and admin registration for Purchase Orders, Request Payments, and Purchase Requisitions.

Quick start (Windows PowerShell):

1. Create a virtual environment and activate it:

```powershell
python -m venv .venv; .\.venv\Scripts\Activate.ps1
```

2. Install requirements:

```powershell
pip install -r requirements.txt
```

3. Run migrations and start server:

```powershell
python manage.py migrate
python manage.py runserver
```

4. Open http://127.0.0.1:8000/ to view the app.

Notes:
- Static `script.js` and `style.css` in the repo root are referenced by the template via Django's static system (DEBUG mode). You can move them into a `static/` directory if you prefer.
- API endpoints:
  - `GET /api/purchase_orders/`  (list)
  - `POST /api/purchase_orders/` (create JSON)
  - `GET/DELETE /api/purchase_orders/<id>/`
  - similarly for `request_payments` and `purchase_requisitions`
