/**
 * Atelier Luxe - Shopping Bag & Wishlist State Manager
 * Handles persistent cart storage, slide-out drawer rendering,
 * free-shipping threshold calculations, and toast alerts.
 */

const AtelierCart = (function() {
  const CART_KEY = 'atelier_cart_items';
  const WISHLIST_KEY = 'atelier_wishlist_ids';
  const FREE_SHIPPING_THRESHOLD = 200.00;

  let cart = [];
  let wishlist = [];

  function init() {
    try {
      cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
      wishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
    } catch (e) {
      cart = [];
      wishlist = [];
    }
    updateNavBadges();
  }

  function save() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    updateNavBadges();
    renderCartDrawer();
  }

  function updateNavBadges() {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadges = document.querySelectorAll('.cart-badge-count');
    cartBadges.forEach(badge => {
      badge.textContent = totalQty;
      badge.style.display = totalQty > 0 ? 'flex' : 'none';
    });

    const wishlistBadges = document.querySelectorAll('.wishlist-badge-count');
    wishlistBadges.forEach(badge => {
      badge.textContent = wishlist.length;
      badge.style.display = wishlist.length > 0 ? 'flex' : 'none';
    });
  }

  // Toast Notification System
  function showToast(message, icon = 'bi-bag-check') {
    let container = document.querySelector('.atelier-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'atelier-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'atelier-toast';
    toast.innerHTML = `<i class="bi ${icon} fs-5 text-warning"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Cart Operations
  function addItem(product, color, size, quantity = 1, imageOverride = null) {
    if (!size) {
      showToast('Please select a garment size first', 'bi-exclamation-circle');
      return false;
    }

    // Determine variant image
    let itemImage = imageOverride;
    if (!itemImage && product.images && product.images[color.slug]) {
      itemImage = product.images[color.slug][0];
    } else if (!itemImage && product.images) {
      const firstColorKey = Object.keys(product.images)[0];
      itemImage = product.images[firstColorKey][0];
    }

    const existingIndex = cart.findIndex(i => 
      i.productId === product.id && 
      i.color.slug === color.slug && 
      i.size === size
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: `${product.id}-${color.slug}-${size}`,
        productId: product.id,
        title: product.title,
        slug: product.slug,
        price: product.base_price,
        color: { name: color.name, slug: color.slug, hex: color.hex },
        size: size,
        quantity: quantity,
        image: itemImage || 'https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=300'
      });
    }

    save();
    showToast(`Added ${product.title} (${size}) to your bag`);
    openDrawer();
    return true;
  }

  function updateQuantity(cartItemId, newQty) {
    const item = cart.find(i => i.id === cartItemId);
    if (!item) return;

    if (newQty <= 0) {
      removeItem(cartItemId);
    } else {
      item.quantity = newQty;
      save();
    }
  }

  function removeItem(cartItemId) {
    const item = cart.find(i => i.id === cartItemId);
    if (item) {
      cart = cart.filter(i => i.id !== cartItemId);
      save();
      showToast(`Removed from your bag`, 'bi-trash');
    }
  }

  function clearCart() {
    cart = [];
    save();
  }

  function getCart() {
    return [...cart];
  }

  function getSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Wishlist Operations
  function toggleWishlist(productId) {
    const id = parseInt(productId);
    const index = wishlist.indexOf(id);
    let active = false;

    if (index > -1) {
      wishlist.splice(index, 1);
      showToast('Removed from your Wishlist', 'bi-heart');
    } else {
      wishlist.push(id);
      showToast('Saved to your Wishlist', 'bi-heart-fill');
      active = true;
    }

    save();
    return active;
  }

  function isInWishlist(productId) {
    return wishlist.includes(parseInt(productId));
  }

  // Drawer Render & Animation
  function openDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');
    if (drawer && overlay) {
      renderCartDrawer();
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartDrawerOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function renderCartDrawer() {
    const container = document.getElementById('cartDrawerItems');
    const subtotalEl = document.getElementById('cartDrawerSubtotal');
    const freeShippingEl = document.getElementById('freeShippingText');
    const freeProgressBar = document.getElementById('freeShippingProgress');
    if (!container) return;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-bag text-muted display-4"></i>
          <p class="font-serif fs-5 mt-3 mb-1">Your bag is empty</p>
          <p class="text-muted small mb-4">Discover our latest autumn/winter apparel collections.</p>
          <a href="shop.html" class="btn btn-atelier" onclick="AtelierCart.closeDrawer()">Explore The Collection</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (freeShippingEl) freeShippingEl.innerHTML = `Add <strong>$${FREE_SHIPPING_THRESHOLD.toFixed(2)}</strong> for complimentary express shipping.`;
      if (freeProgressBar) freeProgressBar.style.width = '0%';
      return;
    }

    const subtotal = getSubtotal();
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Calculate free shipping progress
    if (freeShippingEl && freeProgressBar) {
      if (subtotal >= FREE_SHIPPING_THRESHOLD) {
        freeShippingEl.innerHTML = `🎉 <strong>Complimentary Express Shipping</strong> Unlocked!`;
        freeProgressBar.style.width = '100%';
        freeProgressBar.style.backgroundColor = '#27ae60';
      } else {
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        const percent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
        freeShippingEl.innerHTML = `Add <strong>$${remaining.toFixed(2)}</strong> more for complimentary express shipping.`;
        freeProgressBar.style.width = `${percent}%`;
        freeProgressBar.style.backgroundColor = 'var(--color-accent)';
      }
    }

    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img">
        <div class="cart-item-details">
          <div>
            <div class="d-flex justify-content-between align-items-start">
              <h6 class="font-sans fw-semibold mb-1" style="font-size: 0.9rem;">${item.title}</h6>
              <button class="btn btn-link text-muted p-0 ms-2" onclick="AtelierCart.removeItem('${item.id}')" title="Remove item">
                <i class="bi bi-x-lg" style="font-size: 0.8rem;"></i>
              </button>
            </div>
            <div class="text-muted small">
              <span>Color: ${item.color.name}</span> &bull; 
              <span>Size: ${item.size}</span>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="cart-qty-control">
              <button class="cart-qty-btn" onclick="AtelierCart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
              <span class="cart-qty-val">${item.quantity}</span>
              <button class="cart-qty-btn" onclick="AtelierCart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <div class="fw-bold" style="font-size: 0.95rem;">
              $${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Self initialize on load
  init();

  return {
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getCart,
    getSubtotal,
    toggleWishlist,
    isInWishlist,
    openDrawer,
    closeDrawer,
    renderCartDrawer,
    showToast
  };
})();
