// const storage = window.localStorage;
// const KEYS = {
//   PO_NEXT: 'hd_po_next',
//   RP_NEXT: 'hd_rp_next',
//   PR_NEXT: 'hd_pr_next',
// };

// // Keys for storing lists and id counters
// const DATA_KEYS = {
//   PO_LIST: 'hd_po_data',
//   RP_LIST: 'hd_rp_data',
//   PR_LIST: 'hd_pr_data',
//   PO_ID: 'hd_po_id_next',
//   RP_ID: 'hd_rp_id_next',
//   PR_ID: 'hd_pr_id_next'
// };

// // Ensure initial storage values
// function ensureStorageInitialized() {
//   if (!storage.getItem(KEYS.PO_NEXT)) storage.setItem(KEYS.PO_NEXT, 'PO-0001');
//   if (!storage.getItem(KEYS.RP_NEXT)) storage.setItem(KEYS.RP_NEXT, 'RP-0001');
//   if (!storage.getItem(KEYS.PR_NEXT)) storage.setItem(KEYS.PR_NEXT, 'PR-0001');

//   if (!storage.getItem(DATA_KEYS.PO_LIST)) storage.setItem(DATA_KEYS.PO_LIST, JSON.stringify([]));
//   if (!storage.getItem(DATA_KEYS.RP_LIST)) storage.setItem(DATA_KEYS.RP_LIST, JSON.stringify([]));
//   if (!storage.getItem(DATA_KEYS.PR_LIST)) storage.setItem(DATA_KEYS.PR_LIST, JSON.stringify([]));

//   if (!storage.getItem(DATA_KEYS.PO_ID)) storage.setItem(DATA_KEYS.PO_ID, '1');
//   if (!storage.getItem(DATA_KEYS.RP_ID)) storage.setItem(DATA_KEYS.RP_ID, '1');
//   if (!storage.getItem(DATA_KEYS.PR_ID)) storage.setItem(DATA_KEYS.PR_ID, '1');
// }

// // utility: map mod to data key names
// function listKey(mod){
//   if(mod === 'po') return DATA_KEYS.PO_LIST;
//   if(mod === 'rp') return DATA_KEYS.RP_LIST;
//   if(mod === 'pr') return DATA_KEYS.PR_LIST;
// }
// function idKey(mod){
//   if(mod === 'po') return DATA_KEYS.PO_ID;
//   if(mod === 'rp') return DATA_KEYS.RP_ID;
//   if(mod === 'pr') return DATA_KEYS.PR_ID;
// }

// function readList(mod){
//   const key = listKey(mod);
//   try{
//     const raw = storage.getItem(key);
//     return raw ? JSON.parse(raw) : [];
//   }catch(e){ return []; }
// }

// function writeList(mod, arr){
//   storage.setItem(listKey(mod), JSON.stringify(arr));
// }

// function generateId(mod){
//   const key = idKey(mod);
//   const cur = parseInt(storage.getItem(key) || '1', 10);
//   storage.setItem(key, String(cur + 1));
//   return cur; // return previous as id
// }

// function findById(mod, id){
//   const list = readList(mod);
//   return list.find(it => Number(it.id) === Number(id)) || null;
// }

// // API helpers — talk to Django endpoints; fall back to localStorage on failure
// function apiUrl(mod){
//   if (mod === 'po') return '/api/purchase_orders/';
//   if (mod === 'rp') return '/api/request_payments/';
//   if (mod === 'pr') return '/api/purchase_requisitions/';
//   return '/api/';
// }

// async function fetchListServer(mod){
//   try{
//     const res = await fetch(apiUrl(mod), { credentials: 'same-origin' });
//     if (!res.ok) throw new Error('HTTP ' + res.status);
//     const data = await res.json();
//     return Array.isArray(data) ? data : [];
//   }catch(err){
//     console.warn('fetchListServer failed for', mod, err);
//     return null; // caller will handle fallback
//   }
// }

// async function getServer(mod, id){
//   try{
//     const res = await fetch(apiUrl(mod) + id + '/', { credentials: 'same-origin' });
//     if (!res.ok) throw new Error('HTTP ' + res.status);
//     return await res.json();
//   }catch(err){
//     console.warn('getServer failed for', mod, id, err);
//     return null;
//   }
// }

// async function createServer(mod, payload, files){
//   const url = apiUrl(mod);
//   try{
//     let opts = { method: 'POST', credentials: 'same-origin' };
//     if (files) {
//       // payload is expected to be plain object; build FormData
//       const fd = new FormData();
//       for (const k in payload) {
//         if (payload[k] !== undefined && payload[k] !== null) fd.append(k, payload[k]);
//       }
//       // append invoice file if provided
//       if (files.invoice) fd.append('invoice', files.invoice, files.invoice.name);
//       opts.body = fd;
//     } else {
//       opts.headers = { 'Content-Type': 'application/json' };
//       opts.body = JSON.stringify(payload);
//     }
//     const res = await fetch(url, opts);
//     if (!res.ok) throw new Error('HTTP ' + res.status);
//     return await res.json();
//   }catch(err){
//     console.warn('createServer failed for', mod, err);
//     return null;
//   }
// }

// async function deleteServer(mod, id){
//   try{
//     const res = await fetch(apiUrl(mod) + id + '/', { method: 'DELETE', credentials: 'same-origin' });
//     if (!res.ok) throw new Error('HTTP ' + res.status);
//     return true;
//   }catch(err){
//     console.warn('deleteServer failed for', mod, id, err);
//     return false;
//   }
// }

// // initialize now
// ensureStorageInitialized();

// // Seed a few example records so app is usable without a backend (only if lists empty)
// function seedExampleData() {
//   // only seed if all lists are empty
//   const poList = readList('po');
//   const rpList = readList('rp');
//   const prList = readList('pr');
//   if ((poList && poList.length) || (rpList && rpList.length) || (prList && prList.length)) return;

//   // create a quick PO
//   const po = {
//     id: generateId('po'),
//     no: storage.getItem(KEYS.PO_NEXT) || 'PO-0001',
//     date: new Date().toISOString().slice(0,10),
//     dept: 'Housekeeping',
//     supplier: 'ACME Supplies',
//     tin: '123-456-789',
//     address: 'Brgy. Colon, City of Naga, Cebu',
//     contact_person: 'Juan Dela Cruz',
//     contact_number: '09171234567',
//     total: 4250.00,
//     prepared_by: 'Alice', checked_by: 'Bob', approved_by: 'Carol',
//     items: [ { qty: 10, unit: 'pcs', description: 'Bath Towel', unit_cost: 200.00, total: 2000.00 }, { qty: 5, unit: 'pcs', description: 'Pillow', unit_cost: 250.00, total: 1250.00 }, { qty: 1, unit: 'set', description: 'Shampoo Pack', unit_cost: 1000.00, total: 1000.00 } ]
//   };

//   // RP example
//   const rp = {
//     id: generateId('rp'),
//     no: storage.getItem(KEYS.RP_NEXT) || 'RP-0001',
//     date: new Date().toISOString().slice(0,10),
//     payee: 'Supply Co', tin: '987-654-321', action_required: 'NON-URGENT', mode_of_payment: 'CHECK', payment_for: 'SUPPLIER', amount: 1500.00, remarks: 'Payment for banners', requested_by: 'Eve', checked_by: 'Frank', recommend_approval: 'Grace', approved_by: 'Heidi'
//   };

//   // PR example
//   const pr = {
//     id: generateId('pr'),
//     no: storage.getItem(KEYS.PR_NEXT) || 'PR-0001',
//     date: new Date().toISOString().slice(0,10),
//     requester: 'Maintenance', dept: 'Engineering', date_needed: new Date().toISOString().slice(0,10), remarks: 'Urgent maintenance supplies',
//     items: [ { stk: 'STK-001', qty: 2, unit: 'pcs', desc: 'Pipe', remark: '' }, { stk: 'STK-002', qty: 4, unit: 'pcs', desc: 'Screws', remark: '' } ]
//   };

//   writeList('po', [...poList, po]);
//   writeList('rp', [...rpList, rp]);
//   writeList('pr', [...prList, pr]);

//   // bump serials so further creates will have next numbers
//   storage.setItem(KEYS.PO_NEXT, incrementSerial(po.no));
//   storage.setItem(KEYS.RP_NEXT, incrementSerial(rp.no));
//   storage.setItem(KEYS.PR_NEXT, incrementSerial(pr.no));
// }

// // Run seeder once
// seedExampleData();

// // ADD global editing state
// let editingPOId = null;
// let editingRPId = null;
// let editingPRId = null;

// // store invoice image dataURL for RP (not shown in PDF)
// // rpInvoiceData = data:... (sent to server). rpInvoicePreviewUrl used only for <img> preview (object URL).
// let rpInvoiceData = null;
// let rpInvoicePreviewUrl = null;

// // helper: read File -> dataURL (promise)
// function fileToDataURL(file) {
//   return new Promise((resolve, reject) => {
//     if (!file) return resolve(null);
//     const reader = new FileReader();
//     reader.onerror = () => reject(new Error('Failed to read file'));
//     reader.onload = () => resolve(reader.result); // data:<mime>;base64,...
//     reader.readAsDataURL(file);
//   });
// }

// // preview handler for invoice file input (call from onchange)
// async function previewRPInvoice() {
//   const fileInput = document.getElementById('rp-invoice-file');
//   const file = fileInput?.files?.[0];
//   if (!file) return;

//   // size limit 5MB
//   if (file.size > 5 * 1024 * 1024) {
//     alert('Invoice file must be less than 5MB');
//     fileInput.value = '';
//     return;
//   }

//   try {
//     // create preview object URL for fast display
//     if (rpInvoicePreviewUrl) {
//       try { URL.revokeObjectURL(rpInvoicePreviewUrl); } catch(e) {}
//       rpInvoicePreviewUrl = null;
//     }
//     rpInvoicePreviewUrl = URL.createObjectURL(file);
//     const img = document.getElementById('rp-invoice-img');
//     if (img) {
//       img.src = rpInvoicePreviewUrl;
//       img.style.display = 'block';
//     }

//     // also read full data URL for sending to server
//     rpInvoiceData = await fileToDataURL(file); // data:<mime>;base64,...
//   } catch (err) {
//     console.error('previewRPInvoice error:', err);
//     alert('Unable to read invoice file');
//     // cleanup on error
//     clearRPInvoice();
//   }
// }

// function clearRPInvoice() {
//   // clear data that will be sent
//   rpInvoiceData = null;

//   // clear preview object URL
//   if (rpInvoicePreviewUrl) {
//     try { URL.revokeObjectURL(rpInvoicePreviewUrl); } catch(e) {}
//     rpInvoicePreviewUrl = null;
//   }

//   const fileInput = document.getElementById('rp-invoice-file');
//   if (fileInput) fileInput.value = '';

//   const img = document.getElementById('rp-invoice-img');
//   if (img) {
//     img.src = '';
//     img.style.display = 'none';
//   }
// }

// /* -------------------------
//    Navigation helpers
//    ------------------------- */
// function hideAll() {
//   document.querySelectorAll('.panel, .form-card, #home').forEach(el => el.style.display = 'none');
// }
// function showModule(mod) {
//   hideAll();
//   if (mod === 'po') { document.getElementById('panel-po').style.display = 'block'; renderList('po'); }
//   if (mod === 'rp') { document.getElementById('panel-rp').style.display = 'block'; renderList('rp'); }
//   if (mod === 'pr') { document.getElementById('panel-pr').style.display = 'block'; renderList('pr'); }
// }
// function goHome() {
//   hideAll();
//   document.getElementById('home').style.display = 'block';
// }
// function openCreate(mod) {
//   hideAll();
//   // clear editing state when creating new
//   editingPOId = null;
//   editingRPId = null;
//   editingPRId = null;

//   if (mod === 'po') { document.getElementById('form-po').style.display = 'block'; poPrepare(); }
//   if (mod === 'rp') { document.getElementById('form-rp').style.display = 'block'; rpPrepare(); }
//   if (mod === 'pr') { document.getElementById('form-pr').style.display = 'block'; prPrepare(); }
// }

// function closeForm() {
//   document.getElementById('form-po').style.display = 'none';
//   document.getElementById('form-rp').style.display = 'none';
//   document.getElementById('form-pr').style.display = 'none';
//   // clear editing state on close
//   editingPOId = null;
//   editingRPId = null;
//   editingPRId = null;
//   const last = storage.getItem('hd_last_module');
//   if (last) showModule(last);
//   else goHome();
// }

// /* -------------------------
//    Utility: increment number
//    ------------------------- */
// function incrementSerial(current) {
//   const parts = current.split('-');
//   const last = parts.pop();
//   const num = parseInt(last, 10) + 1;
//   const padded = String(num).padStart(last.length, '0');
//   parts.push(padded);
//   return parts.join('-');
// }

// /* -------------------------
//    Logo helper
//    ------------------------- */
// function getLogoDataURL(callback) {
//   const img = new Image();
//   img.crossOrigin = "anonymous";
//   img.src = 'logo.png';
//   img.onload = function () {
//     const canvas = document.createElement('canvas');
//     const maxW = 200;
//     const ratio = img.width > maxW ? (maxW / img.width) : 1;
//     canvas.width = img.width * ratio;
//     canvas.height = img.height * ratio;
//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//     try {
//       const dataURL = canvas.toDataURL('image/jpeg', 0.9);
//       callback(dataURL);
//     } catch (e) {
//       callback(null);
//     }
//   };
//   img.onerror = function () { callback(null); };
// }

// /* -------------------------
//    PURCHASE ORDER (PO)
//    ------------------------- */
// function poPrepare() {
//   const next = storage.getItem(KEYS.PO_NEXT);
//   document.getElementById('po-no').value = next;
//   document.getElementById('po-date').valueAsDate = new Date();
//   document.getElementById('po-dept').value = '';
//   document.getElementById('po-supplier').value = '';
//   document.getElementById('po-tin').value = '';
//   document.getElementById('po-address').value = '';
//   document.getElementById('po-contact-person').value = '';
//   document.getElementById('po-contact-number').value = '';
//   document.getElementById('po-prepared-by').value = '';
//   document.getElementById('po-checked-by').value = '';
//   document.getElementById('po-approved-by').value = '';
//   document.getElementById('po-items').innerHTML = '';
//   poAddItem();
//   updatePOTotal();
//   storage.setItem('hd_last_module', 'po');
// }

// function poAddItem(q=1, unit='pcs', desc='', cost=0) {
//   const tbody = document.getElementById('po-items');
//   const tr = document.createElement('tr');
//   tr.innerHTML = `
//     <td><input class="po-qty" type="number" min="0" value="${q}" oninput="updatePOTotal()"></td>
//     <td><input class="po-unit" value="${unit}"></td>
//     <td><input class="po-desc" value="${desc}"></td>
//     <td><input class="po-cost" type="number" step="0.01" value="${cost.toFixed(2)}" oninput="updatePOTotal()"></td>
//     <td class="po-sub">₱ 0.00</td>
//     <td><button class="btn secondary" onclick="this.closest('tr').remove(); updatePOTotal()">Remove</button></td>
//   `;
//   tbody.appendChild(tr);
// }

// function updatePOTotal() {
//   const rows = document.querySelectorAll('#po-items tr');
//   let total = 0;
//   rows.forEach(r => {
//     const qty = parseFloat(r.querySelector('.po-qty').value || 0);
//     const cost = parseFloat(r.querySelector('.po-cost').value || 0);
//     const sub = qty * cost;
//     total += sub;
//     r.querySelector('.po-sub').innerText = '₱ ' + sub.toFixed(2);
//   });
//   document.getElementById('po-total').innerText = '₱ ' + total.toFixed(2);
// }

// async function savePO() {
//   const no = document.getElementById('po-no').value;
//   const date = document.getElementById('po-date').value || new Date().toISOString().slice(0,10);
//   const dept = document.getElementById('po-dept').value;
//   const supplier = document.getElementById('po-supplier').value;
//   const tin = document.getElementById('po-tin').value;
//   const address = document.getElementById('po-address').value;
//   const contact_person = document.getElementById('po-contact-person').value;
//   const contact_number = document.getElementById('po-contact-number').value;
//   const prepared_by = document.getElementById('po-prepared-by').value;
//   const checked_by = document.getElementById('po-checked-by').value;
//   const approved_by = document.getElementById('po-approved-by').value;

//   // FIXED: Collect items with correct field names matching database schema
//   const items = [];
//   document.querySelectorAll('#po-items tr').forEach(row => {
//     const qty = parseFloat(row.querySelector('.po-qty').value || 0);
//     const unit = row.querySelector('.po-unit').value || '';
//     const description = row.querySelector('.po-desc').value || '';
//     const unit_cost = parseFloat(row.querySelector('.po-cost').value || 0);
//     const total = qty * unit_cost;
    
//     items.push({ qty, unit, description, unit_cost, total });
//   });

//   const total = items.reduce((sum, item) => sum + item.total, 0);

//   const po = {
//     no, date, dept, supplier, tin, address, 
//     contact_person, contact_number, total,
//     prepared_by, checked_by, approved_by,
//     items
//   };

//   try {
//     // try saving to server first
//     const serverResp = await createServer('po', po, null);
//     if (serverResp && serverResp.no) {
//       // server returned created object
//       const saved = serverResp;
//       // use server id if present, otherwise fall back to local id
//       const list = readList('po');
//       // remove existing editing entry if present
//       if (editingPOId) {
//         const idx = list.findIndex(it => Number(it.id) === Number(editingPOId));
//         if (idx !== -1) list.splice(idx,1);
//         editingPOId = null;
//       }
//       const localId = generateId('po');
//       // keep server id in a property `server_id` to avoid id collisions
//       saved.local_id = localId;
//       saved.id = localId;
//       list.push(saved);
//       writeList('po', list);
//       // increment serial
//       const cur = storage.getItem(KEYS.PO_NEXT);
//       storage.setItem(KEYS.PO_NEXT, incrementSerial(cur));
//       renderList('po');
//       alert('Purchase Order saved to server and cached locally.');
//       closeForm();
//       return;
//     }

//     // fallback: save locally
//     const list = readList('po');
//     if (editingPOId) {
//       const idx = list.findIndex(it => Number(it.id) === Number(editingPOId));
//       if (idx === -1) throw new Error('PO not found');
//       po.id = editingPOId;
//       list[idx] = po;
//       writeList('po', list);
//       editingPOId = null;
//       renderList('po');
//       alert('Purchase Order updated locally.');
//       closeForm();
//       return;
//     }
//     po.id = generateId('po');
//     list.push(po);
//     writeList('po', list);
//     const cur2 = storage.getItem(KEYS.PO_NEXT);
//     storage.setItem(KEYS.PO_NEXT, incrementSerial(cur2));
//     renderList('po');
//     alert('Purchase Order saved locally!');
//     closeForm();
//   } catch (err) {
//     console.error('Error saving PO:', err);
//     alert('Error saving PO. See console for details.');
//   }
// }

// // ...existing code...

// // Edit Purchase Order: load PO into the form for editing
// async function editPO(id) {
//   try {
//     editingPOId = id;
//     let po = await getServer('po', id);
//     if (!po) po = findById('po', id);
//     if (!po) throw new Error('Purchase Order not found');

//     // populate form fields
//     document.getElementById("po-no").value = po.no || '';
//     document.getElementById("po-date").value = po.date || '';
//     document.getElementById("po-dept").value = po.dept || '';
//     document.getElementById("po-supplier").value = po.supplier || '';
//     document.getElementById("po-tin").value = po.tin || '';
//     document.getElementById("po-address").value = po.address || '';
//     document.getElementById("po-contact-person").value = po.contact_person || '';
//     document.getElementById("po-contact-number").value = po.contact_number || '';
//     document.getElementById("po-prepared-by").value = po.prepared_by || '';
//     document.getElementById("po-checked-by").value = po.checked_by || '';
//     document.getElementById("po-approved-by").value = po.approved_by || '';

//     // items: clear and re-create rows
//     const itemsEl = document.getElementById("po-items");
//     if (itemsEl) itemsEl.innerHTML = '';
//     if (Array.isArray(po.items) && po.items.length) {
//       po.items.forEach(it => {
//         // poAddItem(q, unit, desc, cost)
//         poAddItem(it.qty || 0, it.unit || '', it.description || it.desc || '', Number(it.unit_cost || 0));
//       });
//     } else {
//       poAddItem();
//     }

//     updatePOTotal();
//     hideAll();
//     const f = document.getElementById('form-po');
//     if (f) f.style.display = 'block';
//   } catch (err) {
//     console.error('editPO error:', err);
//     alert('Error loading Purchase Order: ' + (err.message || err));
//     editingPOId = null;
//   }
// }

// // Delete Purchase Order
// async function deletePO(id) {
//   if (!confirm('Delete this Purchase Order?')) return;
//   try {
//     // try server delete; ignore failure and still remove local cache
//     await deleteServer('po', id);
//     const list = readList('po');
//     const idx = list.findIndex(it => Number(it.id) === Number(id));
//     if (idx === -1) { alert('PO not found'); return; }
//     list.splice(idx,1);
//     writeList('po', list);
//     alert('Deleted successfully');
//     renderList('po');
//   } catch (err) {
//     console.error('deletePO error:', err);
//     alert('Error deleting Purchase Order');
//   }
// }


// // ===== PURCHASE ORDER - HTML2PDF =====
// function generatePOPdfFromForm() {
//   const print = document.getElementById("print-po");
//   if (!print) return;

//   // fill template values
//   document.getElementById("p_po_no").textContent = document.getElementById("po-no").value || '';
//   document.getElementById("p_po_date").textContent = document.getElementById("po-date").value || '';
//   document.getElementById("p_po_dept").textContent = document.getElementById("po-dept").value || '';
//   document.getElementById("p_po_supplier").textContent = document.getElementById("po-supplier").value || '';
//   document.getElementById("p_po_tin").textContent = document.getElementById("po-tin").value || '';
//   document.getElementById("p_po_address").textContent = document.getElementById("po-address").value || '';
//   document.getElementById("p_po_contact_person").textContent = document.getElementById("po-contact-person").value || '';
//   document.getElementById("p_po_contact_number").textContent = document.getElementById("po-contact-number").value || '';

//   // signature placeholders: show names on the print template
//   document.getElementById('p_po_prepared').textContent = document.getElementById('po-prepared-by')?.value || '';/* Copied runtime script (server-aware) — kept in root and static for dev convenience.
//    The canonical editable file is at project root `script.js`. This copy is used by Django static serving. */

// // NOTE: This static copy is generated from the main `script.js` file.

const storage = window.localStorage;
const KEYS = {
  PO_NEXT: 'hd_po_next',
  RP_NEXT: 'hd_rp_next',
  PR_NEXT: 'hd_pr_next',
};

// Keys for storing lists and id counters
const DATA_KEYS = {
  PO_LIST: 'hd_po_data',
  RP_LIST: 'hd_rp_data',
  PR_LIST: 'hd_pr_data',
  PO_ID: 'hd_po_id_next',
  RP_ID: 'hd_rp_id_next',
  PR_ID: 'hd_pr_id_next'
};

// Ensure initial storage values
function ensureStorageInitialized() {
  if (!storage.getItem(KEYS.PO_NEXT)) storage.setItem(KEYS.PO_NEXT, 'PO-0001');
  if (!storage.getItem(KEYS.RP_NEXT)) storage.setItem(KEYS.RP_NEXT, 'RP-0001');
  if (!storage.getItem(KEYS.PR_NEXT)) storage.setItem(KEYS.PR_NEXT, 'PR-0001');

  if (!storage.getItem(DATA_KEYS.PO_LIST)) storage.setItem(DATA_KEYS.PO_LIST, JSON.stringify([]));
  if (!storage.getItem(DATA_KEYS.RP_LIST)) storage.setItem(DATA_KEYS.RP_LIST, JSON.stringify([]));
  if (!storage.getItem(DATA_KEYS.PR_LIST)) storage.setItem(DATA_KEYS.PR_LIST, JSON.stringify([]));

  if (!storage.getItem(DATA_KEYS.PO_ID)) storage.setItem(DATA_KEYS.PO_ID, '1');
  if (!storage.getItem(DATA_KEYS.RP_ID)) storage.setItem(DATA_KEYS.RP_ID, '1');
  if (!storage.getItem(DATA_KEYS.PR_ID)) storage.setItem(DATA_KEYS.PR_ID, '1');
}

// utility: map mod to data key names
function listKey(mod){
  if(mod === 'po') return DATA_KEYS.PO_LIST;
  if(mod === 'rp') return DATA_KEYS.RP_LIST;
  if(mod === 'pr') return DATA_KEYS.PR_LIST;
}
function idKey(mod){
  if(mod === 'po') return DATA_KEYS.PO_ID;
  if(mod === 'rp') return DATA_KEYS.RP_ID;
  if(mod === 'pr') return DATA_KEYS.PR_ID;
}

function readList(mod){
  const key = listKey(mod);
  try{
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}

function writeList(mod, arr){
  storage.setItem(listKey(mod), JSON.stringify(arr));
}

function generateId(mod){
  const key = idKey(mod);
  const cur = parseInt(storage.getItem(key) || '1', 10);
  storage.setItem(key, String(cur + 1));
  return cur; // return previous as id
}

function findById(mod, id){
  const list = readList(mod);
  return list.find(it => Number(it.id) === Number(id)) || null;
}

// API helpers — talk to Django endpoints; fall back to localStorage on failure
function apiUrl(mod){
  if (mod === 'po') return '/api/purchase_orders/';
  if (mod === 'rp') return '/api/request_payments/';
  if (mod === 'pr') return '/api/purchase_requisitions/';
  return '/api/';
}

async function fetchListServer(mod){
  try{
    const res = await fetch(apiUrl(mod), { credentials: 'same-origin' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }catch(err){
    console.warn('fetchListServer failed for', mod, err);
    return null; // caller will handle fallback
  }
}

async function getServer(mod, id){
  try{
    const res = await fetch(apiUrl(mod) + id + '/', { credentials: 'same-origin' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  }catch(err){
    console.warn('getServer failed for', mod, id, err);
    return null;
  }
}

async function createServer(mod, payload, files){
  const url = apiUrl(mod);
  try{
    let opts = { method: 'POST', credentials: 'same-origin' };
    if (files) {
      // payload is expected to be plain object; build FormData
      const fd = new FormData();
      for (const k in payload) {
        if (payload[k] !== undefined && payload[k] !== null) fd.append(k, payload[k]);
      }
      // append invoice file if provided
      if (files.invoice) fd.append('invoice', files.invoice, files.invoice.name);
      opts.body = fd;
    } else {
      opts.headers = { 'Content-Type': 'application/json' };
      opts.body = JSON.stringify(payload);
    }
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  }catch(err){
    console.warn('createServer failed for', mod, err);
    return null;
  }
}

async function deleteServer(mod, id){
  try{
    const res = await fetch(apiUrl(mod) + id + '/', { method: 'DELETE', credentials: 'same-origin' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return true;
  }catch(err){
    console.warn('deleteServer failed for', mod, id, err);
    return false;
  }
}

// initialize now
ensureStorageInitialized();

// Seed a few example records so app is usable without a backend (only if lists empty)
function seedExampleData() {
  // only seed if all lists are empty
  const poList = readList('po');
  const rpList = readList('rp');
  const prList = readList('pr');
  if ((poList && poList.length) || (rpList && rpList.length) || (prList && prList.length)) return;

  // create a quick PO
  const po = {
    id: generateId('po'),
    no: storage.getItem(KEYS.PO_NEXT) || 'PO-0001',
    date: new Date().toISOString().slice(0,10),
    dept: 'Housekeeping',
    supplier: 'ACME Supplies',
    tin: '123-456-789',
    address: 'Brgy. Colon, City of Naga, Cebu',
    contact_person: 'Juan Dela Cruz',
    contact_number: '09171234567',
    total: 4250.00,
    prepared_by: 'Alice', checked_by: 'Bob', approved_by: 'Carol',
    items: [ { qty: 10, unit: 'pcs', description: 'Bath Towel', unit_cost: 200.00, total: 2000.00 }, { qty: 5, unit: 'pcs', description: 'Pillow', unit_cost: 250.00, total: 1250.00 }, { qty: 1, unit: 'set', description: 'Shampoo Pack', unit_cost: 1000.00, total: 1000.00 } ]
  };

  // RP example
  const rp = {
    id: generateId('rp'),
    no: storage.getItem(KEYS.RP_NEXT) || 'RP-0001',
    date: new Date().toISOString().slice(0,10),
    payee: 'Supply Co', tin: '987-654-321', action_required: 'NON-URGENT', mode_of_payment: 'CHECK', payment_for: 'SUPPLIER', amount: 1500.00, remarks: 'Payment for banners', requested_by: 'Eve', checked_by: 'Frank', recommend_approval: 'Grace', approved_by: 'Heidi'
  };

  // PR example
  const pr = {
    id: generateId('pr'),
    no: storage.getItem(KEYS.PR_NEXT) || 'PR-0001',
    date: new Date().toISOString().slice(0,10),
    requester: 'Maintenance', dept: 'Engineering', date_needed: new Date().toISOString().slice(0,10), remarks: 'Urgent maintenance supplies',
    items: [ { stk: 'STK-001', qty: 2, unit: 'pcs', desc: 'Pipe', remark: '' }, { stk: 'STK-002', qty: 4, unit: 'pcs', desc: 'Screws', remark: '' } ]
  };

  writeList('po', [...poList, po]);
  writeList('rp', [...rpList, rp]);
  writeList('pr', [...prList, pr]);

  // bump serials so further creates will have next numbers
  storage.setItem(KEYS.PO_NEXT, incrementSerial(po.no));
  storage.setItem(KEYS.RP_NEXT, incrementSerial(rp.no));
  storage.setItem(KEYS.PR_NEXT, incrementSerial(pr.no));
}

// Run seeder once
seedExampleData();

// ADD global editing state
let editingPOId = null;
let editingRPId = null;
let editingPRId = null;

// store invoice image dataURL for RP (not shown in PDF)
// rpInvoiceData = data:... (sent to server). rpInvoicePreviewUrl used only for <img> preview (object URL).
let rpInvoiceData = null;
let rpInvoicePreviewUrl = null;

// helper: read File -> dataURL (promise)
function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => resolve(reader.result); // data:<mime>;base64,...
    reader.readAsDataURL(file);
  });
}

// preview handler for invoice file input (call from onchange)
async function previewRPInvoice() {
  const fileInput = document.getElementById('rp-invoice-file');
  const file = fileInput?.files?.[0];
  if (!file) return;

  // size limit 5MB
  if (file.size > 5 * 1024 * 1024) {
    alert('Invoice file must be less than 5MB');
    fileInput.value = '';
    return;
  }

  try {
    // create preview object URL for fast display
    if (rpInvoicePreviewUrl) {
      try { URL.revokeObjectURL(rpInvoicePreviewUrl); } catch(e) {}
      rpInvoicePreviewUrl = null;
    }
    rpInvoicePreviewUrl = URL.createObjectURL(file);
    const img = document.getElementById('rp-invoice-img');
    if (img) {
      img.src = rpInvoicePreviewUrl;
      img.style.display = 'block';
    }

    // also read full data URL for sending to server
    rpInvoiceData = await fileToDataURL(file); // data:<mime>;base64,...
  } catch (err) {
    console.error('previewRPInvoice error:', err);
    alert('Unable to read invoice file');
    // cleanup on error
    clearRPInvoice();
  }
}

function clearRPInvoice() {
  // clear data that will be sent
  rpInvoiceData = null;

  // clear preview object URL
  if (rpInvoicePreviewUrl) {
    try { URL.revokeObjectURL(rpInvoicePreviewUrl); } catch(e) {}
    rpInvoicePreviewUrl = null;
  }

  const fileInput = document.getElementById('rp-invoice-file');
  if (fileInput) fileInput.value = '';

  const img = document.getElementById('rp-invoice-img');
  if (img) {
    img.src = '';
    img.style.display = 'none';
  }
}

/* -------------------------
   Navigation helpers
   ------------------------- */
function hideAll() {
  document.querySelectorAll('.panel, .form-card, #home').forEach(el => el.style.display = 'none');
}
function showModule(mod) {
  hideAll();
  if (mod === 'po') { document.getElementById('panel-po').style.display = 'block'; renderList('po'); }
  if (mod === 'rp') { document.getElementById('panel-rp').style.display = 'block'; renderList('rp'); }
  if (mod === 'pr') { document.getElementById('panel-pr').style.display = 'block'; renderList('pr'); }
}
function goHome() {
  hideAll();
  document.getElementById('home').style.display = 'block';
}
function openCreate(mod) {
  hideAll();
  // clear editing state when creating new
  editingPOId = null;
  editingRPId = null;
  editingPRId = null;

  if (mod === 'po') { document.getElementById('form-po').style.display = 'block'; poPrepare(); }
  if (mod === 'rp') { document.getElementById('form-rp').style.display = 'block'; rpPrepare(); }
  if (mod === 'pr') { document.getElementById('form-pr').style.display = 'block'; prPrepare(); }
}

function closeForm() {
  document.getElementById('form-po').style.display = 'none';
  document.getElementById('form-rp').style.display = 'none';
  document.getElementById('form-pr').style.display = 'none';
  // clear editing state on close
  editingPOId = null;
  editingRPId = null;
  editingPRId = null;
  const last = storage.getItem('hd_last_module');
  if (last) showModule(last);
  else goHome();
}

/* -------------------------
   Utility: increment number
   ------------------------- */
function incrementSerial(current) {
  const parts = current.split('-');
  const last = parts.pop();
  const num = parseInt(last, 10) + 1;
  const padded = String(num).padStart(last.length, '0');
  parts.push(padded);
  return parts.join('-');
}

/* -------------------------
   Logo helper
   ------------------------- */
function getLogoDataURL(callback) {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = 'logo.png';
  img.onload = function () {
    const canvas = document.createElement('canvas');
    const maxW = 200;
    const ratio = img.width > maxW ? (maxW / img.width) : 1;
    canvas.width = img.width * ratio;
    canvas.height = img.height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    try {
      const dataURL = canvas.toDataURL('image/jpeg', 0.9);
      callback(dataURL);
    } catch (e) {
      callback(null);
    }
  };
  img.onerror = function () { callback(null); };
}

/* -------------------------
   PURCHASE ORDER (PO)
   ------------------------- */
function poPrepare() {
  const next = storage.getItem(KEYS.PO_NEXT);
  document.getElementById('po-no').value = next;
  document.getElementById('po-date').valueAsDate = new Date();
  document.getElementById('po-dept').value = '';
  document.getElementById('po-supplier').value = '';
  document.getElementById('po-tin').value = '';
  document.getElementById('po-address').value = '';
  document.getElementById('po-contact-person').value = '';
  document.getElementById('po-contact-number').value = '';
  document.getElementById('po-prepared-by').value = '';
  document.getElementById('po-checked-by').value = '';
  document.getElementById('po-approved-by').value = '';
  document.getElementById('po-items').innerHTML = '';
  poAddItem();
  updatePOTotal();
  storage.setItem('hd_last_module', 'po');
}

function poAddItem(q=1, unit='pcs', desc='', cost=0) {
  const tbody = document.getElementById('po-items');
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="po-qty" type="number" min="0" value="${q}" oninput="updatePOTotal()"></td>
    <td><input class="po-unit" value="${unit}"></td>
    <td><input class="po-desc" value="${desc}"></td>
    <td><input class="po-cost" type="number" step="0.01" value="${cost.toFixed(2)}" oninput="updatePOTotal()"></td>
    <td class="po-sub">₱ 0.00</td>
    <td><button class="btn secondary" onclick="this.closest('tr').remove(); updatePOTotal()">Remove</button></td>
  `;
  tbody.appendChild(tr);
}

function updatePOTotal() {
  const rows = document.querySelectorAll('#po-items tr');
  let total = 0;
  rows.forEach(r => {
    const qty = parseFloat(r.querySelector('.po-qty').value || 0);
    const cost = parseFloat(r.querySelector('.po-cost').value || 0);
    const sub = qty * cost;
    total += sub;
    r.querySelector('.po-sub').innerText = '₱ ' + sub.toFixed(2);
  });
  document.getElementById('po-total').innerText = '₱ ' + total.toFixed(2);
}

async function savePO() {
  const no = document.getElementById('po-no').value;
  const date = document.getElementById('po-date').value || new Date().toISOString().slice(0,10);
  const dept = document.getElementById('po-dept').value;
  const supplier = document.getElementById('po-supplier').value;
  const tin = document.getElementById('po-tin').value;
  const address = document.getElementById('po-address').value;
  const contact_person = document.getElementById('po-contact-person').value;
  const contact_number = document.getElementById('po-contact-number').value;
  const prepared_by = document.getElementById('po-prepared-by').value;
  const checked_by = document.getElementById('po-checked-by').value;
  const approved_by = document.getElementById('po-approved-by').value;

  // FIXED: Collect items with correct field names matching database schema
  const items = [];
  document.querySelectorAll('#po-items tr').forEach(row => {
    const qty = parseFloat(row.querySelector('.po-qty').value || 0);
    const unit = row.querySelector('.po-unit').value || '';
    const description = row.querySelector('.po-desc').value || '';
    const unit_cost = parseFloat(row.querySelector('.po-cost').value || 0);
    const total = qty * unit_cost;
    
    items.push({ qty, unit, description, unit_cost, total });
  });

  const total = items.reduce((sum, item) => sum + item.total, 0);

  const po = {
    no, date, dept, supplier, tin, address, 
    contact_person, contact_number, total,
    prepared_by, checked_by, approved_by,
    items
  };

  try {
    // try saving to server first
    const serverResp = await createServer('po', po, null);
    if (serverResp && serverResp.no) {
      // server returned created object
      const saved = serverResp;
      // use server id if present, otherwise fall back to local id
      const list = readList('po');
      // remove existing editing entry if present
      if (editingPOId) {
        const idx = list.findIndex(it => Number(it.id) === Number(editingPOId));
        if (idx !== -1) list.splice(idx,1);
        editingPOId = null;
      }
      const localId = generateId('po');
      // keep server id in a property `server_id` to avoid id collisions
      saved.local_id = localId;
      saved.id = localId;
      list.push(saved);
      writeList('po', list);
      // increment serial
      const cur = storage.getItem(KEYS.PO_NEXT);
      storage.setItem(KEYS.PO_NEXT, incrementSerial(cur));
      renderList('po');
      alert('Purchase Order saved to server and cached locally.');
      closeForm();
      return;
    }

    // fallback: save locally
    const list = readList('po');
    if (editingPOId) {
      const idx = list.findIndex(it => Number(it.id) === Number(editingPOId));
      if (idx === -1) throw new Error('PO not found');
      po.id = editingPOId;
      list[idx] = po;
      writeList('po', list);
      editingPOId = null;
      renderList('po');
      alert('Purchase Order updated locally.');
      closeForm();
      return;
    }
    po.id = generateId('po');
    list.push(po);
    writeList('po', list);
    const cur2 = storage.getItem(KEYS.PO_NEXT);
    storage.setItem(KEYS.PO_NEXT, incrementSerial(cur2));
    renderList('po');
    alert('Purchase Order saved locally!');
    closeForm();
  } catch (err) {
    console.error('Error saving PO:', err);
    alert('Error saving PO. See console for details.');
  }
}

// ...existing code...

// Edit Purchase Order: load PO into the form for editing
async function editPO(id) {
  try {
    editingPOId = id;
    // IMPORTANT: Set hd_last_module so closeForm() knows to return to PO list
    storage.setItem('hd_last_module', 'po');
    let po = await getServer('po', id);
    if (!po) po = findById('po', id);
    if (!po) throw new Error('Purchase Order not found');

    // populate form fields
    document.getElementById("po-no").value = po.no || '';
    document.getElementById("po-date").value = po.date || '';
    document.getElementById("po-dept").value = po.dept || '';
    document.getElementById("po-supplier").value = po.supplier || '';
    document.getElementById("po-tin").value = po.tin || '';
    document.getElementById("po-address").value = po.address || '';
    document.getElementById("po-contact-person").value = po.contact_person || '';
    document.getElementById("po-contact-number").value = po.contact_number || '';
    document.getElementById("po-prepared-by").value = po.prepared_by || '';
    document.getElementById("po-checked-by").value = po.checked_by || '';
    document.getElementById("po-approved-by").value = po.approved_by || '';

    // items: clear and re-create rows
    const itemsEl = document.getElementById("po-items");
    if (itemsEl) itemsEl.innerHTML = '';
    if (Array.isArray(po.items) && po.items.length) {
      po.items.forEach(it => {
        // poAddItem(q, unit, desc, cost)
        poAddItem(it.qty || 0, it.unit || '', it.description || it.desc || '', Number(it.unit_cost || 0));
      });
    } else {
      poAddItem();
    }

    updatePOTotal();
    hideAll();
    const f = document.getElementById('form-po');
    if (f) f.style.display = 'block';
  } catch (err) {
    console.error('editPO error:', err);
    alert('Error loading Purchase Order: ' + (err.message || err));
    editingPOId = null;
  }
}

// Delete Purchase Order
async function deletePO(id) {
  if (!confirm('Delete this Purchase Order?')) return;
  try {
    // try server delete; ignore failure and still remove local cache
    await deleteServer('po', id);
    const list = readList('po');
    const idx = list.findIndex(it => Number(it.id) === Number(id));
    if (idx === -1) { alert('PO not found'); return; }
    list.splice(idx,1);
    writeList('po', list);
    alert('Deleted successfully');
    renderList('po');
  } catch (err) {
    console.error('deletePO error:', err);
    alert('Error deleting Purchase Order');
  }
}


// ===== PURCHASE ORDER - HTML2PDF =====
function generatePOPdfFromForm() {
  const print = document.getElementById("print-po");
  if (!print) return;

  // fill template values
  document.getElementById("p_po_no").textContent = document.getElementById("po-no").value || '';
  document.getElementById("p_po_date").textContent = document.getElementById("po-date").value || '';
  document.getElementById("p_po_dept").textContent = document.getElementById("po-dept").value || '';
  document.getElementById("p_po_supplier").textContent = document.getElementById("po-supplier").value || '';
  document.getElementById("p_po_tin").textContent = document.getElementById("po-tin").value || '';
  document.getElementById("p_po_address").textContent = document.getElementById("po-address").value || '';
  document.getElementById("p_po_contact_person").textContent = document.getElementById("po-contact-person").value || '';
  document.getElementById("p_po_contact_number").textContent = document.getElementById("po-contact-number").value || '';

  // signature placeholders: show names on the print template
  document.getElementById('p_po_prepared').textContent = document.getElementById('po-prepared-by')?.value || '';
  document.getElementById('p_po_checked').textContent = document.getElementById('po-checked-by')?.value || '';
  document.getElementById('p_po_approved').textContent = document.getElementById('po-approved-by')?.value || '';

  // populate rows
  const tbody = document.getElementById("p_po_items");
  tbody.innerHTML = "";
  let total = 0;

  const rows = document.querySelectorAll("#po-items tr");
  rows.forEach((row, idx) => {
    const stk = idx + 1;
    const qty = row.querySelector(".po-qty")?.value || '0';
    const unit = row.querySelector(".po-unit")?.value || '';
    const desc = row.querySelector(".po-desc")?.value || '';
    const cost = parseFloat(row.querySelector(".po-cost")?.value || 0);
    const sub = parseFloat(qty) * cost;
    total += sub;

    const tr = document.createElement('tr');
    tr.style.height = '16px';
    tr.innerHTML = `
      <td style="padding:2px 4px; text-align:center; font-size:8.5px;">${stk}</td>
      <td style="padding:2px 4px; text-align:center; font-size:8.5px;">${qty}</td>
      <td style="padding:2px 4px; text-align:center; font-size:8.5px;">${unit}</td>
      <td style="padding:2px 4px; font-size:8.5px;">${desc}</td>
      <td style="padding:2px 4px; text-align:right; font-size:8.5px;">₱ ${cost.toFixed(2)}</td>
      <td style="padding:2px 4px; text-align:right; font-size:8.5px;">₱ ${sub.toFixed(2)}</td>
    `;
    // ensure cell borders inherit table borders (border-collapse will show complete box)
    tbody.appendChild(tr);
  });

  // Add N empty rows (same style)
  const extraRows = 8;
  for (let i = 0; i < extraRows; i++) {
    const tr = document.createElement('tr');
    tr.style.height = '16px';
    tr.innerHTML = `
      <td style="padding:2px;"></td>
      <td style="padding:2px;"></td>
      <td style="padding:2px;"></td>
      <td style="padding:2px;"></td>
      <td style="padding:2px;"></td>
      <td style="padding:2px;"></td>
    `;
    tbody.appendChild(tr);
  }

  document.getElementById("p_po_total").textContent = `₱ ${total.toFixed(2)}`;

  // force narrower width for short bondpaper and render
  const prevDisplay = print.style.display;
  print.style.width = '7.4in';
  print.style.maxWidth = '7.4in';
  print.style.boxSizing = 'border-box';
  print.style.background = '#ffffff';
  print.style.display = 'block';

  setTimeout(() => {
    const opt = {
      margin: 8,
      filename: (document.getElementById("po-no").value || 'PO') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(print).save().then(() => {
      print.style.display = prevDisplay;
    }).catch(err => {
      print.style.display = prevDisplay;
      console.error('PDF Error:', err);
      alert('PDF Error: ' + err.message);
    });
  }, 300);
}

// function generateRPPdfFromForm() {
//   const print = document.getElementById("print-rp");
  
//   if (!print) {
//     alert('Print template not found');
//     return;
//   }

//   document.getElementById("p_rp_no").textContent = document.getElementById("rp-no").value || '';
//   document.getElementById("p_rp_date").textContent = document.getElementById("rp-date").value || '';
//   document.getElementById("p_rp_payee").textContent = document.getElementById("rp-payee").value || '';
//   document.getElementById("p_rp_tin").textContent = document.getElementById("rp-tin").value || '';
//   document.getElementById("p_rp_amount").textContent = `₱ ${parseFloat(document.getElementById("rp-amount").value || 0).toFixed(2)}`;
//   document.getElementById("p_rp_remarks").textContent = document.getElementById("rp-remarks").value || '';

//   print.style.display = 'block';
//   print.style.visibility = 'visible';
//   print.style.position = 'relative';

//   setTimeout(() => {
//     const opt = {
//       margin: 8,
//       filename: (document.getElementById("rp-no").value || 'RP') + '.pdf',
//       image: { type: 'jpeg', quality: 0.98 },
//       html2canvas: { 
//         scale: 2, 
//         useCORS: true, 
//         logging: false, 
//         backgroundColor: '#ffffff',
//         allowTaint: true
//       },
//       jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//     };

//     html2pdf()
//       .set(opt)
//       .from(print)
//       .save()
//       .then(() => {
//         print.style.display = 'none';
//       })
//       .catch(err => {
//         console.error('PDF Error:', err);
//         print.style.display = 'none';
//         alert('PDF Error: ' + err.message);
//       });
//   }, 200);
// }

function generateRPPdfFromForm() {
  const print = document.getElementById("print-rp");
  if (!print) { alert('Print template not found'); return; }

  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value || ''; };

  // Basic info
  setText('p_rp_no', document.getElementById("rp-no")?.value || '');
  setText('p_rp_date', document.getElementById("rp-date")?.value || '');
  setText('p_rp_payee', document.getElementById("rp-payee")?.value || '');
  setText('p_rp_tin', document.getElementById("rp-tin")?.value || '');
  setText('p_rp_amount', `₱ ${parseFloat(document.getElementById("rp-amount")?.value || 0).toFixed(2)}`);
  setText('p_rp_remarks', document.getElementById("rp-remarks")?.value || '');

  // Signature fields
  setText('p_rp_requested', document.getElementById("rp-requested-by")?.value || '');
  setText('p_rp_checked', document.getElementById("rp-checked-by")?.value || '');
  setText('p_rp_recommend', document.getElementById("rp-recommend-approval")?.value || '');
  setText('p_rp_approved', document.getElementById("rp-approved-by")?.value || '');

  // Read selections from form
  const actionRequired = document.querySelector('input[name="rp-action"]:checked')?.value || '';
  const modes = Array.from(document.querySelectorAll('.rp-mode:checked')).map(c => c.value);
  const paymentFor = Array.from(document.querySelectorAll('.rp-payment-for:checked')).map(c => c.value);

  // ACTION REQUIRED
  const actionChecks = document.querySelectorAll('.rp-action-check');
  if (actionChecks.length >= 1) actionChecks[0].textContent = actionRequired === 'URGENT' ? '☒' : '☐';
  const actionCheck2 = document.querySelector('.rp-action-check2');
  if (actionCheck2) actionCheck2.textContent = actionRequired === 'NON-URGENT' ? '☒' : '☐';

  // MODES OF PAYMENT (safe guard: ensure we have four check spans)
  const modeChecks = document.querySelectorAll('.rp-mode-check');
  if (modeChecks.length >= 4) {
    modeChecks[0].textContent = modes.includes('CHECK') ? '☒' : '☐';
    modeChecks[1].textContent = modes.includes('CASH') ? '☒' : '☐';
    modeChecks[2].textContent = modes.includes('BANK TRANSFER') ? '☒' : '☐';
    modeChecks[3].textContent = modes.includes('ONLINE') ? '☒' : '☐';
  }

  // PAYMENT FOR (compute hasRepair BEFORE use; tolerant to typos / variations)
  const paymentChecks = document.querySelectorAll('.rp-payment-check');
  if (paymentChecks.length >= 5) {
    const hasRepair = paymentFor.some(s => !!s && s.toUpperCase().includes('REPAIR'));
    paymentChecks[0].textContent = paymentFor.some(s => !!s && s.toUpperCase().includes('SUPPLIER')) ? '☒' : '☐';
    paymentChecks[1].textContent = paymentFor.some(s => !!s && s.toUpperCase().includes('MACHINERY')) ? '☒' : '☐';
    paymentChecks[2].textContent = hasRepair ? '☒' : '☐';
    paymentChecks[3].textContent = paymentFor.some(s => !!s && s.toUpperCase().includes('UTILITY')) ? '☒' : '☐';
    paymentChecks[4].textContent = paymentFor.some(s => !!s && s.toUpperCase().includes('OTHERS')) ? '☒' : '☐';
  }

  print.style.display = 'block';
  print.style.visibility = 'visible';
  print.style.position = 'relative';

  setTimeout(() => {
    const opt = {
      margin: 8,
      filename: (document.getElementById("rp-no")?.value || 'RP') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff', allowTaint: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(print).save()
      .then(() => { print.style.display = 'none'; })
      .catch(err => { console.error('PDF Error:', err); print.style.display = 'none'; alert('PDF Error: ' + err.message); });
  }, 200);
}

// ===== PURCHASE REQUISITION (PR) - HTML2PDF =====
function generatePRPdfFromForm() {
  const print = document.getElementById("print-pr");
  
  if (!print) {
    alert('Print template not found');
    return;
  }

  document.getElementById("p_pr_no").textContent = document.getElementById("pr-no").value || '';
  document.getElementById("p_pr_remarks").textContent = document.getElementById("pr-remarks").value || '';
  document.getElementById("p_pr_requester").textContent = document.getElementById("pr-requester").value || '';
  document.getElementById("p_pr_dept").textContent = document.getElementById("pr-dept").value || '';
  document.getElementById("p_pr_date_needed").textContent = document.getElementById("pr-needed").value || '';
  // populate signature placeholders from form
  if (document.getElementById("p_pr_requested")) document.getElementById("p_pr_requested").textContent = document.getElementById("pr-requested-by").value || '';
  if (document.getElementById("p_pr_checked")) document.getElementById("p_pr_checked").textContent = document.getElementById("pr-checked-by").value || '';
  if (document.getElementById("p_pr_recommend")) document.getElementById("p_pr_recommend").textContent = document.getElementById("pr-recommend-approval").value || '';
  if (document.getElementById("p_pr_approved")) document.getElementById("p_pr_approved").textContent = document.getElementById("pr-approved-by").value || '';

  const tbody = document.getElementById("p_pr_items");
  tbody.innerHTML = "";

  document.querySelectorAll("#pr-items tr").forEach(row => {
    const stk = row.querySelector(".pr-stk")?.value || '';
    const qty = row.querySelector(".pr-qty")?.value || '';
    const unit = row.querySelector(".pr-unit")?.value || '';
    const desc = row.querySelector(".pr-desc")?.value || '';
    const remark = row.querySelector(".pr-remark")?.value || '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="border:1px solid #000; padding:6px;">${stk}</td>
      <td style="border:1px solid #000; padding:6px; text-align:center;">${qty}</td>
      <td style="border:1px solid #000; padding:6px; text-align:center;">${unit}</td>
      <td style="border:1px solid #000; padding:6px;">${desc}</td>
      <td style="border:1px solid #000; padding:6px;">${remark}</td>
    `;
    tbody.appendChild(tr);
  });

  print.style.display = 'block';
  print.style.visibility = 'visible';
  print.style.position = 'relative';

  setTimeout(() => {
    const opt = {
      margin: 8,
      filename: (document.getElementById("pr-no").value || 'PR') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false, 
        backgroundColor: '#ffffff',
        allowTaint: true
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .set(opt)
      .from(print)
      .save()
      .then(() => {
        print.style.display = 'none';
      })
      .catch(err => {
        console.error('PDF Error:', err);
        print.style.display = 'none';
        alert('PDF Error: ' + err.message);
      });
  }, 200);
}

/* -------------------------
   FIXED: Render lists from DATABASE
   ------------------------- */
async function renderList(mod) {
  const area = document.getElementById(mod + '-list-area');
  area.innerHTML = '<div style="padding:12px">Loading...</div>';

  try {
    // try fetching from server; fall back to localStorage
    let list = await fetchListServer(mod);
    if (!Array.isArray(list)) {
      list = readList(mod) || [];
    } else {
      // cache server list locally for offline use
      try { writeList(mod, list); } catch(e) { /* ignore */ }
    }

    // Apply filters
    const period = document.getElementById(mod + '-filter') ? document.getElementById(mod + '-filter').value : 'all';
    const from = document.getElementById(mod + '-from') ? document.getElementById(mod + '-from').value : '';
    const to = document.getElementById(mod + '-to') ? document.getElementById(mod + '-to').value : '';
    const search = document.getElementById(mod + '-search') ? document.getElementById(mod + '-search').value.toLowerCase() : '';
    // NEW: department search input
    const deptSearch = document.getElementById(mod + '-dept-search') ? document.getElementById(mod + '-dept-search').value.toLowerCase().trim() : '';

    const now = new Date();
    list = list.filter(item => {
      let ok = true;
      if (period === 'weekly') {
        const d = new Date(item.date);
        const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diff > 7) ok = false;
      }
      if (period === 'monthly') {
        const d = new Date(item.date);
        if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) ok = false;
      }
      if (period === 'yearly') {
        const d = new Date(item.date);
        if (d.getFullYear() !== now.getFullYear()) ok = false;
      }
      if (from && new Date(item.date) < new Date(from)) ok = false;
      if (to && new Date(item.date) > new Date(to)) ok = false;
      if (search && JSON.stringify(item).toLowerCase().indexOf(search) === -1) ok = false;
      // NEW: apply department filter (works for PO, RP, PR)
      if (deptSearch) {
        const deptVal = (item.dept || '').toLowerCase();
        if (!deptVal.includes(deptSearch)) ok = false;
      }
      return ok;
    });

    if (!list || list.length === 0) {
      area.innerHTML = '<div class="small" style="padding:12px">No records</div>';
      return;
    }

    let html = '<table><thead><tr>';
    if (mod === 'po') html += '<th>PO No.</th><th>Date</th><th>Supplier</th><th>Dept</th><th>Total</th><th></th>';
    if (mod === 'rp') html += '<th>RP No.</th><th>Date</th><th>Payee</th><th>Amount</th><th></th>';
    if (mod === 'pr') html += '<th>MRF No.</th><th>Date</th><th>Requester</th><th>Dept</th><th></th>';
    html += '</tr></thead><tbody>';

    list.forEach((it) => {
      if (mod === 'po') {
        html += `<tr><td>${it.no}</td><td>${it.date}</td><td>${it.supplier}</td><td>${it.dept||''}</td><td>₱ ${Number(it.total||0).toFixed(2)}</td><td>
          <button class="btn" onclick="downloadPOFromDB(${it.id})">PDF</button>
          <button class="btn" onclick="editPO(${it.id})">Edit</button>
          <button class="btn danger" onclick="deletePO(${it.id})">Delete</button>
        </td></tr>`;
      }
      if (mod === 'rp') {
        html += `<tr><td>${it.no}</td><td>${it.date}</td><td>${it.payee}</td><td>₱ ${Number(it.amount||0).toFixed(2)}</td><td>
          <button class="btn" onclick="downloadRPFromDB(${it.id})">PDF</button>
          <button class="btn" onclick="editRP(${it.id})">Edit</button>
          <button class="btn" onclick="viewRPInvoice(${it.id})">View Invoice</button>
          <button class="btn danger" onclick="deleteRP(${it.id})">Delete</button>
        </td></tr>`;
      }
      if (mod === 'pr') {
        const itemCount = it.items ? (Array.isArray(it.items) ? it.items.length : 0) : 0;
        html += `<tr><td>${it.no}</td><td>${it.date}</td><td>${it.requester}</td><td>${it.dept||''}</td><td>
          <button class="btn" onclick="downloadPRFromDB(${it.id})">PDF</button>
          <button class="btn" onclick="editPR(${it.id})">Edit</button>
          <button class="btn danger" onclick="deletePR(${it.id})">Delete</button>
        </td></tr>`;
      }
    });

    html += '</tbody></table>';
    area.innerHTML = html;

  } catch (err) {
    console.error('Error loading list:', err);
    area.innerHTML = '<div style="padding:12px;color:red">Error loading records. Make sure server is running.</div>';
  }
}

/* Download functions - fetch from database by ID */
async function downloadPOFromDB(id) {
  try {
    // try server GET first
    let po = await getServer('po', id);
    if (!po) {
      // fallback to local
      po = findById('po', id);
    }
    if (!po) throw new Error('Purchase Order not found');

    // Fill form
    document.getElementById("po-no").value = po.no || '';
    document.getElementById("po-date").value = po.date || '';
    document.getElementById("po-dept").value = po.dept || '';
    document.getElementById("po-supplier").value = po.supplier || '';
    document.getElementById("po-tin").value = po.tin || '';
    document.getElementById("po-address").value = po.address || '';
    document.getElementById("po-contact-person").value = po.contact_person || '';
    document.getElementById("po-contact-number").value = po.contact_number || '';

    document.getElementById("po-prepared-by").value = po.prepared_by || '';
    document.getElementById("po-checked-by").value = po.checked_by || '';
    document.getElementById("po-approved-by").value = po.approved_by || '';

    document.getElementById("po-items").innerHTML = '';
    if (Array.isArray(po.items) && po.items.length > 0) {
      po.items.forEach(it => {
        poAddItem(it.qty || 0, it.unit || '', it.description || it.desc || '', Number(it.unit_cost || it.unit_cost || 0));
      });
    }

    updatePOTotal();
    generatePOPdfFromForm();
  } catch (err) {
    console.error('downloadPOFromDB Error:', err);
    alert('Error loading Purchase Order: ' + err.message);
  }
}

async function editPR(id) {
  try {
    editingPRId = id;
    // IMPORTANT: Set hd_last_module so closeForm() knows to return to PR list
    storage.setItem('hd_last_module', 'pr');
    let pr = await getServer('pr', id);
    if (!pr) pr = findById('pr', id);
    if (!pr) throw new Error('Purchase Requisition not found');

    // populate fields
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
    set('pr-no', pr.no);
    set('pr-date', pr.date);
    set('pr-requester', pr.requester);
    set('pr-dept', pr.dept);
    set('pr-needed', pr.date_needed);
    // populate signature inputs when editing
    set('pr-requested-by', pr.requested_by || '');
    set('pr-checked-by', pr.checked_by || '');
    set('pr-recommend-approval', pr.recommend_approval || '');
    set('pr-approved-by', pr.approved_by || '');

    // items
    const itemsEl = document.getElementById('pr-items');
    if (itemsEl) itemsEl.innerHTML = '';
    let items = pr.items;
    if (typeof items === 'string') {
      try { items = JSON.parse(items); } catch(e) { items = []; }
    }
    if (Array.isArray(items) && items.length > 0) {
      items.forEach(it => {
        // prAddItem(stk='', q=1, unit='pcs', desc='', remark='')
        if (typeof prAddItem === 'function') prAddItem(it.stk || '', it.qty || 0, it.unit || '', it.desc || it.description || '', it.remark || it.remarks || '');
      });
    } else {
      if (typeof prAddItem === 'function') prAddItem();
    }

    hideAll();
    const f = document.getElementById('form-pr');
    if (f) f.style.display = 'block';
  } catch (err) {
    console.error('editPR error:', err);
    alert('Error loading Purchase Requisition for edit.');
    editingPRId = null;
  }
}

// Delete Purchase Requisition
async function deletePR(id) {
  if (!confirm('Delete this Purchase Requisition?')) return;
  try {
    await deleteServer('pr', id);
    const list = readList('pr');
    const idx = list.findIndex(it => Number(it.id) === Number(id));
    if (idx === -1) { alert('PR not found'); return; }
    list.splice(idx,1);
    writeList('pr', list);
    alert('Deleted successfully');
    renderList('pr');
  } catch (err) {
    console.error('deletePR error:', err);
    alert('Error deleting Purchase Requisition');
  }
}

// Download PR and generate PDF (used by list "PDF" button)
async function downloadPRFromDB(id) {
  try {
    // try server first
    let pr = await getServer('pr', id);
    if (!pr) pr = findById('pr', id);
    if (!pr) throw new Error('PR not found');

    // populate hidden print form fields so generatePRPdfFromForm can use them
    const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value || ''; };
    setText('p_pr_no', pr.no || '');
    setText('p_pr_requester', pr.requester || '');
    setText('p_pr_dept', pr.dept || '');
    setText('p_pr_date_needed', pr.date_needed || '');
    // also populate form fields so generatePRPdfFromForm reads them
    const setInput = (id, v) => { const el = document.getElementById(id); if (el) el.value = v || ''; };
    // core form values
    setInput('pr-no', pr.no || '');
    setInput('pr-date', pr.date || '');
    setInput('pr-requester', pr.requester || '');
    setInput('pr-dept', pr.dept || '');
    setInput('pr-needed', pr.date_needed || '');
    setInput('pr-remarks', pr.remarks || '');
    // signature inputs
    setInput('pr-requested-by', pr.requested_by || '');
    setInput('pr-checked-by', pr.checked_by || '');
    setInput('pr-recommend-approval', pr.recommend_approval || '');
    setInput('pr-approved-by', pr.approved_by || '');

    // also populate print-only placeholders for the fast download path
    setText('p_pr_requested', pr.requested_by || '');
    setText('p_pr_checked', pr.checked_by || '');
    setText('p_pr_recommend', pr.recommend_approval || '');
    setText('p_pr_approved', pr.approved_by || '');

    const tbody = document.getElementById('p_pr_items');
    if (tbody) {
      tbody.innerHTML = '';
      let items = pr.items;
      if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch(e) { items = []; }
      }
      if (Array.isArray(items) && items.length) {
        // populate both the print-only table AND the editable form rows
        const formItemsEl = document.getElementById('pr-items');
        if (formItemsEl) formItemsEl.innerHTML = '';
        items.forEach(it => {
          if (typeof prAddItem === 'function') prAddItem(it.stk || '', it.qty || 0, it.unit || '', it.desc || it.description || '', it.remark || it.remarks || '');
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td style="border:1px solid #000; padding:6px;">${it.stk || ''}</td>
            <td style="border:1px solid #000; padding:6px; text-align:center;">${it.qty || ''}</td>
            <td style="border:1px solid #000; padding:6px; text-align:center;">${it.unit || ''}</td>
            <td style="border:1px solid #000; padding:6px;">${it.desc || it.description || ''}</td>
            <td style="border:1px solid #000; padding:6px;">${it.remark || it.remarks || ''}</td>
          `;
          tbody.appendChild(tr);
        });
      }
    }

    // generate PDF from print-pr template
    generatePRPdfFromForm();
  } catch (err) {
    console.error('downloadPRFromDB error:', err);
    alert('Error loading Purchase Requisition for PDF: ' + (err.message || err));
  }
}

async function downloadRPFromDB(id) {
  try {
    // try server first
    let rp = await getServer('rp', id);
    if (!rp) rp = findById('rp', id);
    if (!rp) throw new Error('RP not found');

    // Fill form fields (so generateRPPdfFromForm can read them)
    document.getElementById("rp-no").value = rp.no || '';
    document.getElementById("rp-date").value = rp.date || '';
    document.getElementById("rp-payee").value = rp.payee || '';
    document.getElementById("rp-tin").value = rp.tin || '';
    document.getElementById("rp-amount").value = rp.amount || '';
    document.getElementById("rp-remarks").value = rp.remarks || '';
    document.getElementById("rp-requested-by").value = rp.requested_by || '';
    document.getElementById("rp-checked-by").value = rp.checked_by || '';
    document.getElementById("rp-recommend-approval").value = rp.recommend_approval || '';
    document.getElementById("rp-approved-by").value = rp.approved_by || '';

    // Restore checkbox/radio states from DB so generateRPPdfFromForm reads them
    document.querySelectorAll('input[name="rp-action"]').forEach(el => el.checked = (el.value === rp.action_required));

    if (rp.mode_of_payment) {
      const modes = rp.mode_of_payment.split(',').map(s => s.trim());
      document.querySelectorAll('.rp-mode').forEach(el => el.checked = modes.includes(el.value));
    } else {
      document.querySelectorAll('.rp-mode').forEach(el => el.checked = false);
    }

    if (rp.payment_for) {
      const pf = rp.payment_for.split(',').map(s => s.trim());
      document.querySelectorAll('.rp-payment-for').forEach(el => el.checked = pf.includes(el.value));
    } else {
      document.querySelectorAll('.rp-payment-for').forEach(el => el.checked = false);
    }

    // Preview existing invoice if server returned invoice_url
    if (rp.invoice_url) {
      const img = document.getElementById('rp-invoice-img');
      if (img) { img.src = rp.invoice_url; img.style.display = 'block'; }
    }

    // NOW generateRPPdfFromForm can read the restored checkboxes
    generateRPPdfFromForm();
    
  } catch (err) {
    console.error('downloadRPFromDB Error:', err);
    alert('Error loading Request for Payment: ' + err.message);
  }
}

function prAddItem(stk='', qty=1, unit='pcs', desc='', remark='') {
  const tbody = document.getElementById('pr-items');
  if (!tbody) return;

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input class="pr-stk" type="text" value="${stk}" placeholder="Stock Code"></td>
    <td><input class="pr-qty" type="number" min="0" value="${qty}"></td>
    <td><input class="pr-unit" type="text" value="${unit}" placeholder="Unit"></td>
    <td><input class="pr-desc" type="text" value="${desc}" placeholder="Description"></td>
    <td><input class="pr-remark" type="text" value="${remark}" placeholder="Remarks"></td>
    <td><button class="btn secondary" onclick="this.closest('tr').remove()">Remove</button></td>
  `;
  tbody.appendChild(tr);
}

async function savePR() {
  const no = document.getElementById('pr-no').value;
  const date = document.getElementById('pr-date').value || new Date().toISOString().slice(0,10);
  const requester = document.getElementById('pr-requester').value;
  const dept = document.getElementById('pr-dept').value;
  const date_needed = document.getElementById('pr-needed').value;
  const remarks = document.getElementById('pr-remarks').value || '';
  // signature fields
  const requested_by = document.getElementById('pr-requested-by')?.value || '';
  const checked_by = document.getElementById('pr-checked-by')?.value || '';
  const recommend_approval = document.getElementById('pr-recommend-approval')?.value || '';
  const approved_by = document.getElementById('pr-approved-by')?.value || '';

  const items = [];
  document.querySelectorAll('#pr-items tr').forEach((row, idx) => {
    const stk = row.querySelector('.pr-stk')?.value || '';
    const qty = parseFloat(row.querySelector('.pr-qty')?.value || 0);
    const unit = row.querySelector('.pr-unit')?.value || '';
    const desc = row.querySelector('.pr-desc')?.value || '';
    const remark = row.querySelector('.pr-remark')?.value || '';

    items.push({ stk, qty, unit, desc, description: desc, remark, remarks: remark });
  });

  const pr = { no, date, requester, dept, date_needed, remarks, requested_by, checked_by, recommend_approval, approved_by, items };

  try {
    // try server save first
    const serverResp = await createServer('pr', pr, null);
    if (serverResp && serverResp.no) {
      const list = readList('pr');
      if (editingPRId) {
        const idx = list.findIndex(it => Number(it.id) === Number(editingPRId));
        if (idx !== -1) list.splice(idx,1);
        editingPRId = null;
      }
      const localId = generateId('pr');
      // ensure signature fields are preserved in cached copy even if server response omitted them
      serverResp.requested_by = serverResp.requested_by || requested_by;
      serverResp.checked_by = serverResp.checked_by || checked_by;
      serverResp.recommend_approval = serverResp.recommend_approval || recommend_approval;
      serverResp.approved_by = serverResp.approved_by || approved_by;
      serverResp.remarks = serverResp.remarks || remarks;
      serverResp.local_id = localId;
      serverResp.id = localId;
      list.push(serverResp);
      writeList('pr', list);
      storage.setItem(KEYS.PR_NEXT, incrementSerial(no));
      renderList('pr');
      alert('Purchase Requisition saved to server and cached locally.');
      closeForm();
      return;
    }

    // fallback local save
    const list = readList('pr');
    if (editingPRId) {
      const idx = list.findIndex(it => Number(it.id) === Number(editingPRId));
      if (idx === -1) throw new Error('PR not found');
      pr.id = editingPRId;
      list[idx] = pr;
      writeList('pr', list);
      editingPRId = null;
      alert('Purchase Requisition updated locally!');
      renderList('pr');
      closeForm();
      return;
    }
    pr.id = generateId('pr');
    list.push(pr);
    writeList('pr', list);
    storage.setItem(KEYS.PR_NEXT, incrementSerial(no));
    alert('Purchase Requisition saved locally!');
    renderList('pr');
    closeForm();
  } catch (err) {
    console.error('Error saving PR:', err);
    alert('Error saving PR. See console for details.');
  }
}

function rpPrepare() {
  const next = storage.getItem(KEYS.RP_NEXT);
  document.getElementById('rp-no').value = next;
  document.getElementById('rp-date').valueAsDate = new Date();
  document.getElementById('rp-payee').value = '';
  document.getElementById('rp-tin').value = '';
  document.querySelectorAll('input[name="rp-action"]').forEach(r => r.checked = false);
  document.querySelectorAll('.rp-mode').forEach(c => c.checked = false);
  document.querySelectorAll('.rp-payment-for').forEach(c => c.checked = false);
  document.getElementById('rp-payment-for-other').value = '';
  document.getElementById('rp-amount').value = '';
  document.getElementById('rp-remarks').value = '';
  document.getElementById('rp-requested-by').value = '';
  document.getElementById('rp-checked-by').value = '';
  document.getElementById('rp-recommend-approval').value = '';
  document.getElementById('rp-approved-by').value = '';
  // clear invoice state when preparing a new RFP
  clearRPInvoice();
  storage.setItem('hd_last_module', 'rp');
}

async function saveRP() {
  const no = document.getElementById('rp-no').value;
  const date = document.getElementById('rp-date').value || new Date().toISOString().slice(0,10);
  const payee = document.getElementById('rp-payee').value;
  const tin = document.getElementById('rp-tin').value;

  const action_required = document.querySelector('input[name="rp-action"]:checked')?.value || null;
  const modes = Array.from(document.querySelectorAll('.rp-mode:checked')).map(c => c.value).join(', ');
  const mode_of_payment = modes || null;

  const paymentFor = Array.from(document.querySelectorAll('.rp-payment-for:checked')).map(c => c.value);
  if (paymentFor.includes('OTHERS')) {
    paymentFor[paymentFor.indexOf('OTHERS')] = document.getElementById('rp-payment-for-other').value || 'OTHERS';
  }
  const payment_for = paymentFor.join(', ') || null;

  const amount = parseFloat(document.getElementById('rp-amount').value || 0);
  const remarks = document.getElementById('rp-remarks').value;
  const requested_by = document.getElementById('rp-requested-by').value;
  const checked_by = document.getElementById('rp-checked-by').value;
  const recommend_approval = document.getElementById('rp-recommend-approval').value;
  const approved_by = document.getElementById('rp-approved-by').value;

  // ensure rpInvoiceData populated if user selected a file but didn't trigger preview
  const invoiceFile = document.getElementById('rp-invoice-file')?.files?.[0];
  const invoice_filename = invoiceFile ? invoiceFile.name : null;
  if (invoiceFile && !rpInvoiceData) {
    try {
      if (invoiceFile.size > 5 * 1024 * 1024) {
        alert('Invoice file must be less than 5MB');
        return;
      }
      rpInvoiceData = await fileToDataURL(invoiceFile);
    } catch (e) {
      console.error('Failed to read invoice before save:', e);
      alert('Unable to read invoice file');
      return;
    }
  }

  // Build payload: include invoice_image ONLY when it's a proper data: URL
  const rp = {
    no, date, payee, tin, action_required, mode_of_payment, payment_for,
    amount, remarks, requested_by, checked_by, recommend_approval, approved_by
  };

  if (rpInvoiceData && typeof rpInvoiceData === 'string' && rpInvoiceData.startsWith('data:')) {
    rp.invoice_image = rpInvoiceData;
    rp.invoice_filename = invoice_filename || null;
  } else {
    // do not include invoice_image key to avoid sending object URLs or invalid values
    // if you want to clear existing invoice on edit, set rp.invoice_image = null explicitly
  }

  try {
    // attempt server save using multipart (for invoice file)
    const invoiceFile = document.getElementById('rp-invoice-file')?.files?.[0] || null;
    const files = invoiceFile ? { invoice: invoiceFile } : null;
    const serverResp = await createServer('rp', rp, files);
    if (serverResp && serverResp.no) {
      const list = readList('rp');
      if (editingRPId) {
        const idx = list.findIndex(it => Number(it.id) === Number(editingRPId));
        if (idx !== -1) list.splice(idx,1);
        editingRPId = null;
      }
      const localId = generateId('rp');
      serverResp.local_id = localId;
      serverResp.id = localId;
      // server may return invoice URL as invoice (invoice field)
      if (serverResp.invoice_url) serverResp.invoice_image = serverResp.invoice_url;
      list.push(serverResp);
      writeList('rp', list);
      storage.setItem(KEYS.RP_NEXT, incrementSerial(no));
      renderList('rp');
      alert('Request for Payment saved to server and cached locally.');
      closeForm();
      return;
    }

    // fallback: local save
    const list = readList('rp');
    if (editingRPId) {
      const idx = list.findIndex(it => Number(it.id) === Number(editingRPId));
      if (idx === -1) throw new Error('RP not found');
      rp.id = editingRPId;
      const existing = list[idx] || {};
      if (!rp.invoice_image && existing.invoice_image) {
        rp.invoice_image = existing.invoice_image;
        rp.invoice_filename = existing.invoice_filename;
      }
      list[idx] = rp;
      writeList('rp', list);
      editingRPId = null;
      alert('Request for Payment updated locally!');
      renderList('rp');
      closeForm();
      return;
    }
    rp.id = generateId('rp');
    list.push(rp);
    writeList('rp', list);
    storage.setItem(KEYS.RP_NEXT, incrementSerial(no));
    editingRPId = null;
    alert('Request for Payment saved locally!');
    renderList('rp');
    closeForm();
  } catch (err) {
    console.error("Error saving RP:", err);
    alert("Error saving RP. See console for details.");
  }
}

function prPrepare() {
  const next = storage.getItem(KEYS.PR_NEXT);
  const el = id => document.getElementById(id);
  if (el('pr-no')) el('pr-no').value = next;
  if (el('pr-date')) el('pr-date').valueAsDate = new Date();
  if (el('pr-requester')) el('pr-requester').value = '';
  if (el('pr-dept')) el('pr-dept').value = '';
  if (el('pr-needed')) el('pr-needed').value = '';
  if (el('pr-remarks')) el('pr-remarks').value = '';
  if (el('pr-requested-by')) el('pr-requested-by').value = '';
  if (el('pr-checked-by')) el('pr-checked-by').value = '';
  if (el('pr-recommend-approval')) el('pr-recommend-approval').value = '';
  if (el('pr-approved-by')) el('pr-approved-by').value = '';
  if (el('pr-items')) el('pr-items').innerHTML = '';
  // add first empty item row if helper exists
  if (typeof prAddItem === 'function') prAddItem();
  // clear editing state for PR
  editingPRId = null;
  storage.setItem('hd_last_module', 'pr');
}

// ADD: Edit & Delete handlers for Request for Payment
async function editRP(id) {
  try {
    editingRPId = id;
    // IMPORTANT: Set hd_last_module so closeForm() knows to return to RP list
    storage.setItem('hd_last_module', 'rp');
    let rp = await getServer('rp', id);
    if (!rp) rp = findById('rp', id);
    if (!rp) throw new Error('RP not found');

    document.getElementById("rp-no").value = rp.no || '';
    document.getElementById("rp-date").value = rp.date || '';
    document.getElementById("rp-payee").value = rp.payee || '';
    document.getElementById("rp-tin").value = rp.tin || '';
    document.getElementById("rp-amount").value = rp.amount ?? '';
    document.getElementById("rp-remarks").value = rp.remarks || '';
    document.getElementById("rp-requested-by").value = rp.requested_by || '';
    document.getElementById("rp-checked-by").value = rp.checked_by || '';
    document.getElementById("rp-recommend-approval").value = rp.recommend_approval || '';
    document.getElementById("rp-approved-by").value = rp.approved_by || '';

    // radio/checkbox state
    document.querySelectorAll('input[name="rp-action"]').forEach(el => el.checked = (el.value === rp.action_required));
    if (rp.mode_of_payment) {
      const modes = rp.mode_of_payment.split(',').map(s => s.trim());
      document.querySelectorAll('.rp-mode').forEach(el => el.checked = modes.includes(el.value));
    } else {
      document.querySelectorAll('.rp-mode').forEach(el => el.checked = false);
    }

    if (rp.payment_for) {
      const pf = rp.payment_for.split(',').map(s => s.trim());
      document.querySelectorAll('.rp-payment-for').forEach(el => el.checked = pf.includes(el.value));
      // set "others" text if provided
      const others = pf.find(v => v && !['SUPPLIER','MACHINERY','REPAIR & MAINTENANCE','UTILITY','OTHERS'].includes(v.toUpperCase()));
      document.getElementById('rp-payment-for-other').value = others || '';
    } else {
      document.querySelectorAll('.rp-payment-for').forEach(el => el.checked = false);
      document.getElementById('rp-payment-for-other').value = '';
    }

    // Preview existing invoice (do NOT set rpInvoiceData to the dataURL, only for preview)
    if (rp.invoice_image) {
      // rp.invoice_image is a data:... URL
      const img = document.getElementById('rp-invoice-img');
      if (img) { img.src = rp.invoice_image; img.style.display = 'block'; }
      rpInvoicePreviewUrl = null;
      rpInvoiceData = null;
    } else {
      const img = document.getElementById('rp-invoice-img');
      if (img) { img.src = ''; img.style.display = 'none'; }
      rpInvoicePreviewUrl = null;
      rpInvoiceData = null;
    }

    // show form
    hideAll();
    const f = document.getElementById('form-rp');
    if (f) f.style.display = 'block';
  } catch (err) {
    console.error('editRP error:', err);
    alert('Error loading Request for Payment for edit: ' + (err.message || err));
    editingRPId = null;
  }
}

async function deleteRP(id) {
  if (!confirm('Delete this Request for Payment?')) return;
  try {
    await deleteServer('rp', id);
    const list = readList('rp');
    const idx = list.findIndex(it => Number(it.id) === Number(id));
    if (idx === -1) { alert('RP not found'); return; }
    list.splice(idx,1);
    writeList('rp', list);
    alert('Deleted successfully');
    renderList('rp');
  } catch (err) {
    console.error('deleteRP error:', err);
    alert('Error deleting Request for Payment');
  }
}

// New: fetch and display invoice blob in modal
async function viewRPInvoice(id) {
  try {
    const rp = findById('rp', id);
    if (!rp) { alert('RP not found'); return; }
    if (!rp.invoice_image) { alert('No invoice attached for this RFP.'); return; }
    const url = rp.invoice_image; // data URL
    const img = document.getElementById('invoice-modal-img');
    const download = document.getElementById('invoice-modal-download');
    if (img) img.src = url;
    if (download) {
      download.href = url;
      download.download = rp.invoice_filename || (rp.no || 'invoice') + '.jpg';
    }
    const modal = document.getElementById('invoice-modal');
    if (modal) modal.style.display = 'flex';
  } catch (err) {
    console.error('viewRPInvoice error:', err);
    alert('Unable to load invoice. See console for details.');
  }
}

function closeInvoiceModal() {
  const modal = document.getElementById('invoice-modal');
  const img = document.getElementById('invoice-modal-img');
  if (img) {
    // revoke blob URL if set
    try { URL.revokeObjectURL(img.src); } catch(e){}
    img.src = '';
  }
  const download = document.getElementById('invoice-modal-download');
  if (download) download.href = '#';
  if (modal) modal.style.display = 'none';
}

