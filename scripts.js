// Minimal frontend logic for Techvilla
const productsEl = document.getElementById('products');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');
const cartCountEl = document.getElementById('cartCount');
const yearEl = document.getElementById('year');

const modal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalPrice = document.getElementById('modalPrice');
const addToCartBtn = document.getElementById('addToCart');

let CART = [];
let currentProduct = null;
// Persisted cart support: load from localStorage on startup
function loadCart(){
  try{
    const raw = localStorage.getItem('techvilla_cart');
    if(raw){ CART = JSON.parse(raw) || []; }
  }catch(e){ CART = []; }
  // ensure items have qty when loaded
  try{ normalizeCart(); }catch(e){}
}
function saveCart(){
  try{ localStorage.setItem('techvilla_cart', JSON.stringify(CART)); }catch(e){}
}

// Ensure loaded cart items have a qty property (for older saved carts)
function normalizeCart(){
  CART = CART.map(item => {
    if(typeof item.qty === 'number' && item.qty > 0) return item;
    return Object.assign({}, item, { qty: 1 });
  });
}

const PRODUCTS = [
  {id:1,name:'iPhone 17 Air',category:'phones',price:899,desc:'iPhone 17 Air • 128GB • A20 Neural Chip',imageLocal:'images/iphone17%20air.jpeg',imageFallback:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=iphone'},
  {id:2,name:'Echo Buds',category:'audio',price:129,desc:'True wireless earbuds with ANC',imageLocal:'images/earbuds.webp',imageFallback:'https://images.unsplash.com/photo-1585386959984-a415522c7c36?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=earbuds'},
  {id:3,name:'PowerGo 20W',category:'accessories',price:29,desc:'Fast USB-C charger',imageLocal:'images/chargers.jpg',imageFallback:'https://images.unsplash.com/photo-1585386959984-a415522c7c36?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=charger'},
  {id:4,name:'MacBook Air',category:'phones',price:1199,desc:'MacBook Air • M3 • 16GB • 512GB',imageLocal:'images/Macbook%20pro.jpg',imageFallback:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=macbook'},
  {id:5,name:'PlayStation 5',category:'audio',price:499,desc:'PlayStation 5 • Disc • 1TB',imageLocal:'images/playstation%205.webp',imageFallback:'https://images.unsplash.com/photo-1606813902805-36a1f0d6c3fd?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=ps5'},
  {id:6,name:'Tempered Glass',category:'accessories',price:19,desc:'Tempered glass screen protector',imageLocal:'images/glass%20protector.webp',imageFallback:'https://images.unsplash.com/photo-1551033406-611cf9a9cf72?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=protector'},
  {id:7,name:'HP 15 Laptop',category:'laptops',price:249,desc:'HP 15 — 4GB RAM • 128GB storage',imageLocal:'images/HP%2015%204gb%20ram%20128%20internal%20storage.jpeg',imageFallback:''},
  {id:8,name:'iPhone 11 Pro Max',category:'phones',price:249,desc:'iPhone 11 Pro Max • 64GB',imageLocal:'images/iphone%2011promax%2064gb.jpeg',imageFallback:''},
  {id:9,name:'iPhone 16 Plus',category:'phones',price:799,desc:'iPhone 16 Plus • 256GB',imageLocal:'images/Iphone%2016plus%20256gb.jpeg',imageFallback:''},
  {id:10,name:'Apple iPad 10th Gen',category:'tablets',price:449,desc:'iPad 10th Gen — 64GB',imageLocal:'images/Apple%20ipad%2010th%20Gen.jpeg',imageFallback:''},
  {id:11,name:'PS3 Super Slim',category:'consoles',price:89,desc:'PlayStation 3 Super Slim — used',imageLocal:'images/Ps3%20Super%20slim.jpeg',imageFallback:''},
  {id:12,name:'PS5 (Disk)',category:'consoles',price:549,desc:'PlayStation 5 with disk drive',imageLocal:'images/PS5%20with%20disk.jpeg',imageFallback:''},
  {id:13,name:'Mercedes-Benz C300',category:'vehicles',price:5000,desc:'Used Mercedes-Benz C300 — listing photo',imageLocal:'images/MERCEDES%20BENZ%20C300.jpeg',imageFallback:''},
  {id:14,name:'Mercedes-Benz CLA 250',category:'vehicles',price:8200,desc:'Used Mercedes-Benz CLA 250 — listing photo',imageLocal:'images/MERCEDES%20BENZ%20CLA%20250.jpeg',imageFallback:''},
  {id:15,name:'Toyota Venza (Unreg)',category:'vehicles',price:8700,desc:'Unregistered Toyota Venza — photo',imageLocal:'images/Unregistered%20Toyota%20Venza%20010.jpeg',imageFallback:''},
  {id:16,name:'Brand New iPhone 14 Pro Max',category:'phones',price:799,desc:'Brand new iPhone 14 Pro Max — 128GB',imageLocal:'images/Brand New iphone 14 Promax.jpeg',imageFallback:''},
  {id:17,name:'iPad Air 10th Gen',category:'tablets',price:499,desc:'iPad Air — 10th Gen',imageLocal:'images/Ipad Air 10th Gen.jpeg',imageFallback:''},
  {id:18,name:'iPhone 11',category:'phones',price:199,desc:'iPhone 11 — used',imageLocal:'images/Iphone 11.jpeg',imageFallback:''},
  {id:19,name:'iPhone 13 Pro',category:'phones',price:599,desc:'iPhone 13 Pro — good condition',imageLocal:'images/Iphone 13pro.jpeg',imageFallback:''},
  {id:20,name:'iPhone 14 Pro',category:'phones',price:899,desc:'iPhone 14 Pro — new',imageLocal:'images/Iphone 14pro.jpeg',imageFallback:''},
  {id:21,name:'iPhone 14 Pro Max',category:'phones',price:999,desc:'iPhone 14 Pro Max — new',imageLocal:'images/Iphone 14promax.jpeg',imageFallback:''},
  {id:22,name:'iPhone 15 Pro 512GB',category:'phones',price:1299,desc:'iPhone 15 Pro • 512GB',imageLocal:'images/Iphone 15pro 512gb.jpeg',imageFallback:''},
  {id:23,name:'iPhone 17',category:'phones',price:949,desc:'iPhone 17 — listing photo',imageLocal:'images/Iphone 17.jpeg',imageFallback:''},
  {id:24,name:'JBL Charge 5',category:'audio',price:129,desc:'Portable Bluetooth speaker — JBL Charge 5',imageLocal:'images/JBL charge 5.jpeg',imageFallback:''},
  {id:25,name:'MacBook Air 2017',category:'laptops',price:399,desc:'MacBook Air (2017) — refurbished',imageLocal:'images/Macbook Air 2017.jpeg',imageFallback:''},
  {id:26,name:'Open Box iPhone 16',category:'phones',price:699,desc:'Open-box iPhone 16 — like new',imageLocal:'images/Open Box iphone 16.jpeg',imageFallback:''},
  {id:27,name:'Open Box iWatch',category:'wearables',price:199,desc:'Open-box smartwatch',imageLocal:'images/Open Box Iwatch.jpeg',imageFallback:''},
  {id:28,name:'PS4 & PS5 disk bundle',category:'consoles',price:79,desc:'Assorted PS4/PS5 disks bundle',imageLocal:'images/Ps4 & Ps5 disk.jpeg',imageFallback:''},
  {id:29,name:'UK iPhone X',category:'phones',price:249,desc:'iPhone X — UK listing',imageLocal:'images/UK iphone X.jpeg',imageFallback:''},
  {id:30,name:'UK mint XR',category:'phones',price:219,desc:'iPhone XR in mint condition',imageLocal:'images/UK mint XR.jpeg',imageFallback:''},
];

function formatPrice(p){return '$' + p.toFixed(2)}

function renderProducts(list){
  productsEl.innerHTML = '';
  if(list.length===0){productsEl.innerHTML = '<p class="muted">No products found.</p>';return}
  list.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="product-image"><img src="${p.imageLocal}" alt="${p.name}" loading="lazy" data-fallback="${p.imageFallback}"/></div>
      <div>
        <h4>${p.name}</h4>
        <p class="muted">${p.desc}</p>
      </div>
      <div class="card-footer">
        <div class="price">${formatPrice(p.price)}</div>
        <div>
          <button class="btn" data-id="${p.id}">View</button>
          <button class="btn primary" data-buy="${p.id}">Buy</button>
        </div>
      </div>
    `;
    productsEl.appendChild(card);
  })
}

function openModal(product){
  currentProduct = product;
  modalImage.src = product.imageLocal || product.imageFallback || '';
  modalImage.alt = product.name || '';
  // if local image fails to load, fall back to remote photo
  modalImage.onerror = () => { if(product.imageFallback) modalImage.src = product.imageFallback }
  modalTitle.textContent = product.name;
  modalDesc.textContent = product.desc;
  modalPrice.textContent = formatPrice(product.price);
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
}

function updateCart(){
  const subtotal = CART.reduce((s,it)=>s + ((it.price||0) * (it.qty||1)),0);
  // compute total discount based on per-item discount property (if present)
  const discountTotal = CART.reduce((s,it)=>{
    const line = (it.price||0) * (it.qty||1);
    return s + ((it.discount && typeof it.discount === 'number') ? +(line * it.discount) : 0);
  }, 0);
    const shippingMethod = (document.querySelector('input[name="shipping"]:checked')||{}).value || 'standard';
  let shipping = 0;
  if(shippingMethod==='expedited') shipping = 9.99;
  if(shippingMethod==='standard') shipping = 4.99;
  if(shippingMethod==='pickup') shipping = 0;
  // tax calculated on subtotal minus discounts
  const taxable = Math.max(0, subtotal - discountTotal);
  const tax = +(taxable * 0.07).toFixed(2);
  const total = +(subtotal - discountTotal + shipping + tax).toFixed(2);
  // If product already in cart (by id), increment qty; otherwise add with qty:1
  const existing = CART.find(it => it.id === product.id);
  const discountEl = document.getElementById('discountAmount');
  if(existing){ existing.qty = (existing.qty || 1) + 1; }
  else { CART.push(Object.assign({}, product, { qty: 1 })); }
  normalizeCart();
  updateCart();
  if(discountEl) discountEl.textContent = formatPrice(discountTotal);
  saveCart();
  // If we're currently viewing the cart page, re-render items so order summary updates immediately
  if(document.getElementById('orderItems')) renderCartItems();
}

document.addEventListener('click',e=>{
  const viewBtn = e.target.closest('button[data-id]');
  const buyBtn = e.target.closest('button[data-buy]');
  if(viewBtn){
    const id = Number(viewBtn.dataset.id);
    const p = PRODUCTS.find(x=>x.id===id);
    openModal(p);
  }
  if(buyBtn){
    const id = Number(buyBtn.dataset.buy);
    const p = PRODUCTS.find(x=>x.id===id);
    addToCart(p);
  }
  // If user clicked the cart header button (or a child inside it), navigate to the cart page
  const headerCart = e.target.closest('#cartBtn');
  if(headerCart){
    // navigate to the cart/checkout page
    window.location.href = 'cart.html';
  }
});

if(modalClose) modalClose.addEventListener('click',closeModal);
if(modal) modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
if(addToCartBtn) addToCartBtn.addEventListener('click',()=>{if(currentProduct){addToCart(currentProduct);closeModal()}});

if(searchInput) searchInput.addEventListener('input',()=>applyFilters());
if(categoryFilter) categoryFilter.addEventListener('change',()=>applyFilters());

// Update header cart count only
function updateCart(){
  const totalQty = CART.reduce((s,it)=>s + (it.qty||1), 0);
  if(cartCountEl) cartCountEl.textContent = totalQty;
  const header = document.getElementById('cartCountHeader');
  if(header) header.textContent = totalQty;
}

// Add product to cart (increment qty if present)
function addToCart(product){
  if(!product) return;
  const existing = CART.find(it => it.id === product.id);
  if(existing){ existing.qty = (existing.qty || 1) + 1; }
  else { CART.push(Object.assign({}, product, { qty: 1 })); }
  normalizeCart();
  saveCart();
  updateCart();
  // If we're currently viewing the cart page, re-render items so order summary updates immediately
  if(document.getElementById('orderItems')) renderCartItems();
}

function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  const cat = categoryFilter.value;
  const filtered = PRODUCTS.filter(p=>{
    if(cat!=='all' && p.category!==cat) return false;
    if(q && !(p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))) return false;
    return true;
  });
  renderProducts(filtered);
}

// Init
document.addEventListener('DOMContentLoaded',()=>{
  yearEl.textContent = new Date().getFullYear();
  if(productsEl) renderProducts(PRODUCTS);
  loadCart();
  updateCart();
  // If we're on the cart page, initialize cart UI
  if(document.getElementById('cartPage')) initCartPage();
});

/* Cart page support */
function initCartPage(){
  // Ensure we have the latest cart from localStorage (in case it changed in another tab)
  loadCart();
  updateCart();
  renderCartItems();
  attachCartListeners();
}

// Listen for storage changes (other tabs/windows) and update the UI
window.addEventListener('storage', (e)=>{
  if(e.key === 'techvilla_cart'){
    loadCart();
    updateCart();
    // If on cart page, re-render items and totals
    if(document.getElementById('orderItems')) renderCartItems();
  }
});

function renderCartItems(){
  const container = document.getElementById('orderItems');
  const subtotalEl = document.getElementById('subtotal');
  if(!container) return;
  container.innerHTML = '';
  if(CART.length===0){ container.innerHTML = '<p class="muted">Your cart is empty.</p>'; subtotalEl.textContent = '$0.00'; updateTotals(); return }
  CART.forEach((p,idx)=>{
    const item = document.createElement('div');
    item.className = 'cart-item';
    // Show quantity controls and line total
    const lineTotal = (p.price || 0) * (p.qty || 1);
    // Simple per-line tax (7%) and per-line discount (if any)
    const lineTax = +((lineTotal) * 0.07).toFixed(2);
    const lineDiscount = (p.discount && typeof p.discount === 'number') ? +(lineTotal * p.discount).toFixed(2) : 0;
    item.innerHTML = `<div style="display:flex;gap:12px;align-items:center">
      <img src="${p.imageLocal || p.imageFallback || ''}" alt="${p.name}" style="width:64px;height:64px;object-fit:cover;border-radius:8px;" />
      <div style="flex:1">
        <div style="font-weight:600">${p.name}</div>
        <div class="muted" style="font-size:13px">${p.desc}</div>
        <div style="margin-top:8px;display:flex;align-items:center;gap:8px">
          <button class="btn small" aria-label="Decrease quantity for ${p.name}" data-decr="${idx}">-</button>
          <input class="qty-input" data-idx="${idx}" value="${p.qty || 1}" aria-label="Quantity for ${p.name}" inputmode="numeric" style="width:56px;text-align:center;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit" />
          <button class="btn small" aria-label="Increase quantity for ${p.name}" data-incr="${idx}">+</button>
        </div>
        <div style="margin-top:6px;font-size:13px;color:var(--muted)">
          Line tax: ${formatPrice(lineTax)}${lineDiscount?(' • Discount: ' + formatPrice(lineDiscount)) : ''}
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-weight:700">${formatPrice(lineTotal - lineDiscount + lineTax)}</div>
        <div style="margin-top:6px"><button class="btn small" data-remove="${idx}">Remove</button></div>
      </div>
    </div>`;
    container.appendChild(item);
  });
  updateTotals();
}

function updateTotals(){
  const subtotal = CART.reduce((s,it)=>s + ((it.price||0) * (it.qty||1)),0);
  const shippingMethod = (document.querySelector('input[name="shipping"]:checked')||{}).value || 'standard';
  let shipping = 0;
  if(shippingMethod==='expedited') shipping = 9.99;
  if(shippingMethod==='standard') shipping = 4.99;
  if(shippingMethod==='pickup') shipping = 0;
  // If cart is empty, clear shipping fee
  if(subtotal === 0) shipping = 0;
  const tax = +(subtotal * 0.07).toFixed(2);
  const total = +(subtotal + shipping + tax).toFixed(2);
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shippingAmount');
  const taxEl = document.getElementById('taxAmount');
  const totalEl = document.getElementById('totalAmount');
  if(subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if(shippingEl) shippingEl.textContent = formatPrice(shipping);
  if(taxEl) taxEl.textContent = formatPrice(tax);
  if(totalEl) totalEl.textContent = formatPrice(total);
  // Enable place order when there's at least one item and form appears valid
  const place = document.getElementById('placeOrder');
  if(place) place.disabled = !(CART.length>0 && simpleDeliveryValid());
}

function attachCartListeners(){
  document.getElementById('clearCart').addEventListener('click',()=>{
    CART = [];
    saveCart();
    updateCart();
    renderCartItems();
    updateTotals();
  });

  // Header clear cart button (on main page)
  const clearHeader = document.getElementById('clearCartHeader');
  if(clearHeader){
    clearHeader.addEventListener('click', ()=>{
      const totalQty = CART.reduce((s,it)=>s + (it.qty||1),0);
      if(totalQty > 6){
        if(!confirm('You have multiple items in your cart. Clear all items?')) return;
      }
      CART = [];
      saveCart();
      updateCart();
      // If on cart page, re-render
      if(document.getElementById('orderItems')) renderCartItems();
      updateTotals();
    });
  }

  document.getElementById('orderItems').addEventListener('click',e=>{
    // Remove
    const rem = e.target.closest('button[data-remove]');
    if(rem){
      const idx = Number(rem.dataset.remove);
      if(Number.isFinite(idx)){
        // If cart has many items (or total qty large), confirm removal
        const totalQty = CART.reduce((s,it)=>s + (it.qty||1),0);
        if(totalQty > 8){
          const ok = confirm('Your cart has many items — are you sure you want to remove this item?');
          if(!ok) return;
        }
        CART.splice(idx,1);
        saveCart();
        updateCart();
        renderCartItems();
      }
      return;
    }

    // Increase quantity
    const inc = e.target.closest('button[data-incr]');
    if(inc){
      const idx = Number(inc.dataset.incr);
      if(Number.isFinite(idx) && CART[idx]){
        CART[idx].qty = (CART[idx].qty || 1) + 1;
        saveCart();
        updateCart();
        renderCartItems();
      }
      return;
    }

    // Decrease quantity
    const decr = e.target.closest('button[data-decr]');
    if(decr){
      const idx = Number(decr.dataset.decr);
      if(Number.isFinite(idx) && CART[idx]){
        CART[idx].qty = (CART[idx].qty || 1) - 1;
        if(CART[idx].qty <= 0){ CART.splice(idx,1); }
        saveCart();
        updateCart();
        renderCartItems();
      }
      return;
    }
  });

  // Also allow manual quantity input changes
  document.getElementById('orderItems').addEventListener('input', e => {
    const input = e.target.closest('.qty-input');
    if(!input) return;
    const idx = Number(input.dataset.idx);
    const val = Number(input.value);
    if(!Number.isFinite(idx) || !CART[idx]) return;
    if(!Number.isFinite(val) || val < 1){
      // reset to 1
      input.value = CART[idx].qty || 1;
      return;
    }
    CART[idx].qty = Math.floor(val);
    saveCart();
    updateCart();
    updateTotals();
  });

  document.getElementById('deliveryForm').addEventListener('input',()=>{
    // live-check totals that depend on shipping
    updateTotals();
  });

  document.querySelectorAll('input[name="payment"]').forEach(r=>{
    r.addEventListener('change',()=>{
      updatePaymentFields();
    })
  });

  // initial payment fields state
  updatePaymentFields();

  document.getElementById('placeOrder').addEventListener('click', ()=>{
    if(!simpleDeliveryValid()) return alert('Please provide required delivery information.');
    // Prepare order email to send via user's mail client
    try{
      updateTotals();
      const to = 'aderinkoyeemmanuel5@gmail.com';
      const subject = 'New order from Techvilla';

      // Collect delivery fields
      const fields = ['fullName','email','phone','address','city','state','zip','country'];
      const delivery = fields.map(id=>{
        const el = document.getElementById(id);
        return (el ? (id + ': ' + el.value) : (id + ':'));
      }).join('\n');

      // Order items
      const items = CART.map(it => {
        const qty = it.qty || 1;
        const line = (it.price||0) * qty;
        return `${qty} x ${it.name} @ ${formatPrice(it.price)} = ${formatPrice(line)}`;
      }).join('\n');

      // Totals
      const subtotal = document.getElementById('subtotal') ? document.getElementById('subtotal').textContent : formatPrice(CART.reduce((s,it)=>s + ((it.price||0)*(it.qty||1)),0));
      const shipping = document.getElementById('shippingAmount') ? document.getElementById('shippingAmount').textContent : '$0.00';
      const tax = document.getElementById('taxAmount') ? document.getElementById('taxAmount').textContent : '$0.00';
      const total = document.getElementById('totalAmount') ? document.getElementById('totalAmount').textContent : '$0.00';

      const paymentMethod = (document.querySelector('input[name="payment"]:checked')||{}).value || 'card';
      const bankRefEl = document.getElementById('bankReference');
      const bankRef = bankRefEl ? bankRefEl.value : '';
      const proofInput = document.getElementById('bankProof');

      let proofNote = '';
      if(paymentMethod === 'bank'){
        if(proofInput && proofInput.files && proofInput.files.length>0){
          proofNote = `Payment proof uploaded (filename: ${proofInput.files[0].name}). Please attach this file manually to the email before sending.`;
        } else {
          proofNote = 'No payment proof file uploaded. If you made a transfer, please attach the receipt to the email.';
        }
      }

      const body = `Order from Techvilla\n\nDelivery details:\n${delivery}\n\nItems:\n${items || 'No items'}\n\nSubtotal: ${subtotal}\nShipping: ${shipping}\nTax: ${tax}\nTotal: ${total}\n\nPayment method: ${paymentMethod}\nPayment reference: ${bankRef || 'N/A'}\n\n${proofNote}\n--\nThis message was prepared by the Techvilla checkout form.`;

      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      // Open the user's mail client with the prepared message
      window.location.href = mailto;
    }catch(err){
      console.error('Failed to prepare email', err);
      alert('Order placed — please contact support via email.');
    }

    // clear cart after opening mail client
    CART = [];
    saveCart();
    updateCart();
    renderCartItems();
    updateTotals();
  });

  // shipping radio changes should recalc totals
  document.querySelectorAll('input[name="shipping"]').forEach(r=>r.addEventListener('change',updateTotals));
}

function simpleDeliveryValid(){
  if(!document.getElementById('deliveryForm')) return false;
  const requiredIds = ['fullName','email','phone','address','city','zip','country'];
  let ok = true;
  requiredIds.forEach(id=>{
    const el = document.getElementById(id);
    const err = document.getElementById('err' + id.charAt(0).toUpperCase() + id.slice(1));
    if(!el) return;
    if(!el.value || el.value.trim()===''){
      ok = false;
      if(err) err.textContent = 'Required';
    } else { if(err) err.textContent = '' }
  });
  // basic email check
  const email = document.getElementById('email');
  if(email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){ ok=false; const e=document.getElementById('errEmail'); if(e) e.textContent='Invalid email' }
  const place = document.getElementById('placeOrder');
  if(place) place.disabled = !ok;
  return ok;
}

function updatePaymentFields(){
  const selected = (document.querySelector('input[name="payment"]:checked')||{}).value || 'card';
  const cardFields = document.getElementById('cardFields');
  const bankFields = document.getElementById('bankFields');
  if(cardFields) cardFields.style.display = (selected==='card') ? 'block' : 'none';
  if(bankFields) bankFields.style.display = (selected==='bank') ? 'block' : 'none';
}

// Attach error fallback for images in cards (for when local images are absent)
function attachImageFallbacks(){
  const imgs = document.querySelectorAll('.product-image img');
  imgs.forEach(img=>{
    const fallback = img.dataset.fallback;
    if(!fallback) return;
    img.onerror = () => { if(img.src !== fallback) img.src = fallback };
  })
}

// Observe product container to re-attach fallbacks after render
const observer = new MutationObserver(()=>attachImageFallbacks());
if(productsEl) observer.observe(productsEl, {childList:true, subtree:true});

/* Live photos 3D panel: inject layers, mouse parallax, and auto-cycle */
function initLivePhotos(){
  const layersEl = document.getElementById('liveLayers');
  if(!layersEl) return;
  // Image sets to cycle through (prefer local images, fall back to remote if missing)
  const sets = [
    ['images/iphone17%20air.jpeg','images/earbuds.webp','images/chargers.jpg'],
    ['images/Macbook%20pro.jpg','images/playstation%205.webp','images/JBL charge 5.jpeg'],
    ['images/Iphone%2016plus%20256gb.jpeg','images/Iphone%2011promax%2064gb.jpeg','images/Apple%20ipad%2010th%20Gen.jpeg']
  ];
  let active = 0;

  function renderSet(idx){
    layersEl.innerHTML = '';
    const set = sets[idx] || sets[0];
    // We create 3 depth layers: back, mid, front
    set.forEach((src,i)=>{
      const layer = document.createElement('div');
      layer.className = 'layer';
      // deeper layers are translated farther in Z
      const depth = (i - 1) * 40; // -40, 0, 40
      layer.style.transform = `translateZ(${depth}px)`;
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Live photo layer';
      layer.appendChild(img);
      // subtle parallax offsets stored as data
      layer.dataset.depth = depth;
      layersEl.appendChild(layer);
    });
  }

  renderSet(active);

  // Mouse parallax / tilt
  const panel = layersEl.closest('.live-photos-panel');
  if(panel){
    panel.addEventListener('mousemove', e => {
      const rect = panel.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) - 0.5; // -0.5..0.5
      const py = ((e.clientY - rect.top) / rect.height) - 0.5;
      const rotateY = px * 7; // degrees
      const rotateX = -py * 7;
      layersEl.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      // move each layer based on its depth
      const layerEls = layersEl.querySelectorAll('.layer');
      layerEls.forEach(l => {
        const d = Number(l.dataset.depth) || 0;
        const tx = px * (d * 0.2);
        const ty = py * (d * 0.2);
        l.style.transform = `translateZ(${d}px) translate(${tx}px, ${ty}px)`;
      });
    });
    panel.addEventListener('mouseleave', ()=>{
      layersEl.style.transform = '';
      const layerEls = layersEl.querySelectorAll('.layer');
      layerEls.forEach(l => { const d = Number(l.dataset.depth) || 0; l.style.transform = `translateZ(${d}px)` });
    });
  }

  // Auto-cycle every 6s
  setInterval(()=>{
    active = (active + 1) % sets.length;
    // fade-out current then render new set
    layersEl.querySelectorAll('.layer').forEach(l=>{ l.style.opacity = '0'; l.style.filter = 'blur(4px) grayscale(.3)'; });
    setTimeout(()=> renderSet(active), 420);
  }, 6000);
}

document.addEventListener('DOMContentLoaded', ()=>{
  initLivePhotos();
});

