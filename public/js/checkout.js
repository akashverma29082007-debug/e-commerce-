/**
 * Atelier Luxe - Checkout Flow Controller
 * Handles address validation, dynamic shipping method calculation,
 * coupon code discounts, card input masking, and order creation.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCheckoutPage();
});

let appliedDiscount = 0; // percentage, e.g. 10%
let selectedShippingFee = 0; // dynamic based on subtotal & method

function initCheckoutPage() {
  const cart = AtelierCart.getCart();

  if (cart.length === 0) {
    document.getElementById('checkoutContent').innerHTML = `
      <div class="container py-5 text-center">
        <i class="bi bi-bag text-muted display-3 mb-3 d-block"></i>
        <h2 class="font-serif">Your Shopping Bag is Empty</h2>
        <p class="text-muted">You have no garments in your bag to checkout.</p>
        <a href="shop.html" class="btn btn-atelier mt-3">Return to Collection</a>
      </div>
    `;
    return;
  }

  renderOrderSummary();
  setupCardFormatting();
  setupShippingMethodListeners();
  setupCouponForm();
  setupCheckoutSubmission();
}

function renderOrderSummary() {
  const cart = AtelierCart.getCart();
  const itemsContainer = document.getElementById('checkoutItemsList');
  if (!itemsContainer) return;

  itemsContainer.innerHTML = cart.map(item => `
    <div class="d-flex align-items-center gap-3 py-2 border-bottom">
      <div class="position-relative">
        <img src="${item.image}" alt="${item.title}" style="width: 58px; height: 74px; object-fit: cover;" class="border">
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
          ${item.quantity}
        </span>
      </div>
      <div class="flex-grow-1 small">
        <div class="fw-semibold text-truncate" style="max-width: 180px;">${item.title}</div>
        <div class="text-muted">${item.color.name} &bull; Size ${item.size}</div>
      </div>
      <div class="fw-bold text-end small">
        $${(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  `).join('');

  calculateTotals();
}

function setupShippingMethodListeners() {
  const radios = document.querySelectorAll('input[name="shippingMethod"]');
  radios.forEach(r => {
    r.addEventListener('change', () => {
      calculateTotals();
    });
  });
}

function calculateTotals() {
  const subtotal = AtelierCart.getSubtotal();
  const selectedRadio = document.querySelector('input[name="shippingMethod"]:checked');
  const methodType = selectedRadio ? selectedRadio.value : 'standard';

  // Shipping calculation
  if (methodType === 'standard') {
    selectedShippingFee = subtotal >= 200 ? 0 : 15.00;
  } else if (methodType === 'priority') {
    selectedShippingFee = 35.00;
  }

  // Discount calculation
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = taxableAmount * 0.08; // 8% estimated tax
  const total = taxableAmount + selectedShippingFee + tax;

  document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summaryShipping').textContent = selectedShippingFee === 0 ? 'FREE' : `$${selectedShippingFee.toFixed(2)}`;
  
  const discountRow = document.getElementById('summaryDiscountRow');
  if (discountRow) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('summaryDiscount').textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  document.getElementById('summaryTax').textContent = `$${tax.toFixed(2)}`;
  document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
}

function setupCouponForm() {
  const btn = document.getElementById('applyCouponBtn');
  const input = document.getElementById('couponCodeInput');
  const alertEl = document.getElementById('couponAlert');
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const code = input.value.trim().toUpperCase();
    if (code === 'ATELIER10' || code === 'VIP10') {
      appliedDiscount = 10;
      alertEl.innerHTML = '<span class="text-success"><i class="bi bi-check-circle me-1"></i> Coupon "ATELIER10" applied (10% Off)!</span>';
      alertEl.style.display = 'block';
      calculateTotals();
    } else if (code === 'LUXE20') {
      appliedDiscount = 20;
      alertEl.innerHTML = '<span class="text-success"><i class="bi bi-check-circle me-1"></i> VIP Coupon "LUXE20" applied (20% Off)!</span>';
      alertEl.style.display = 'block';
      calculateTotals();
    } else {
      alertEl.innerHTML = '<span class="text-danger"><i class="bi bi-x-circle me-1"></i> Invalid or expired promotion code.</span>';
      alertEl.style.display = 'block';
    }
  });
}

function setupCardFormatting() {
  const cardInput = document.getElementById('cardNumber');
  const expInput = document.getElementById('cardExpiry');
  const cvcInput = document.getElementById('cardCvc');

  if (cardInput) {
    cardInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      val = val.substring(0, 16);
      const parts = val.match(/.{1,4}/g);
      e.target.value = parts ? parts.join(' ') : '';
    });
  }

  if (expInput) {
    expInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length >= 2) {
        e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
      } else {
        e.target.value = val;
      }
    });
  }

  if (cvcInput) {
    cvcInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
    });
  }
}

function setupCheckoutSubmission() {
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitOrderBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Securing Order...';

    const cart = AtelierCart.getCart();
    const subtotal = AtelierCart.getSubtotal();
    const discountAmount = (subtotal * appliedDiscount) / 100;
    const tax = Math.max(0, subtotal - discountAmount) * 0.08;
    const total = Math.max(0, subtotal - discountAmount) + selectedShippingFee + tax;

    const payload = {
      shipping: {
        email: document.getElementById('custEmail').value.trim(),
        firstName: document.getElementById('custFirstName').value.trim(),
        lastName: document.getElementById('custLastName').value.trim(),
        address: document.getElementById('custAddress').value.trim(),
        city: document.getElementById('custCity').value.trim(),
        postalCode: document.getElementById('custPostal').value.trim()
      },
      payment: {
        method: document.querySelector('input[name="paymentMethod"]:checked').value
      },
      items: cart,
      subtotal,
      shippingFee: selectedShippingFee,
      tax,
      total
    };

    try {
      const response = await AtelierAPI.createOrder(payload);
      if (response.success) {
        AtelierCart.clearCart();
        window.location.href = `order-success.html?orderNumber=${response.orderNumber}`;
      } else {
        alert('Order processing error. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Complete Order';
      }
    } catch (err) {
      console.error(err);
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Complete Order';
    }
  });
}
