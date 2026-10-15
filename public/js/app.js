/**
 * Atelier Luxe - Global Client Application Controller
 * Manages sticky navigation, live search overlay, drawer triggers,
 * currency formatting, and shared component interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initSearchModal();
  initGlobalEventListeners();
});

// Sticky Navbar dynamic glassmorphism on scroll
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar-atelier');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('shadow-sm');
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.96)';
    } else {
      navbar.classList.remove('shadow-sm');
      navbar.style.backgroundColor = 'var(--glass-bg)';
    }
  });
}

// Live Search Overlay Controller
function initSearchModal() {
  const searchInput = document.getElementById('globalSearchInput');
  const searchResults = document.getElementById('globalSearchResults');
  if (!searchInput || !searchResults) return;

  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (query.length < 2) {
      searchResults.innerHTML = '<p class="text-muted text-center py-4">Type at least 2 characters to search...</p>';
      return;
    }

    debounceTimer = setTimeout(async () => {
      searchResults.innerHTML = '<div class="text-center py-4"><div class="spinner-border spinner-border-sm text-dark"></div> Searching...</div>';
      const results = await AtelierAPI.getProducts({ search: query });

      if (results.length === 0) {
        searchResults.innerHTML = `<p class="text-muted text-center py-4">No garments found matching "<strong>${query}</strong>"</p>`;
        return;
      }

      searchResults.innerHTML = `
        <div class="row g-3">
          ${results.slice(0, 4).map(p => {
            const firstColorKey = Object.keys(p.images)[0];
            const img = p.images[firstColorKey][0];
            return `
              <div class="col-6 col-md-3">
                <a href="product.html?id=${p.id}" class="d-block text-decoration-none">
                  <div class="aspect-ratio-3-4 bg-light mb-2 overflow-hidden" style="aspect-ratio: 3/4;">
                    <img src="${img}" alt="${p.title}" class="w-100 h-100 object-fit-cover">
                  </div>
                  <h6 class="small fw-semibold text-truncate mb-1 text-dark">${p.title}</h6>
                  <div class="fw-bold text-dark small">$${p.base_price.toFixed(2)}</div>
                </a>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }, 200);
  });
}

// Global Event Listeners (Drawer triggers, Quick view buttons)
function initGlobalEventListeners() {
  // Cart drawer open buttons
  document.querySelectorAll('.open-cart-drawer').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      AtelierCart.openDrawer();
    });
  });

  // Cart drawer close buttons & overlay click
  const closeBtn = document.getElementById('closeCartDrawer');
  const overlay = document.getElementById('cartDrawerOverlay');
  if (closeBtn) closeBtn.addEventListener('click', () => AtelierCart.closeDrawer());
  if (overlay) overlay.addEventListener('click', () => AtelierCart.closeDrawer());

  // Escape key closes modals and drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      AtelierCart.closeDrawer();
    }
  });
}

// Helper to render high-fashion product card HTML
function createProductCardHTML(p) {
  const isWishlisted = AtelierCart.isInWishlist(p.id);
  const colorKeys = Object.keys(p.images);
  const primaryImg = p.images[colorKeys[0]][0];
  const hoverImg = p.images[colorKeys[0]][1] || primaryImg;

  const colorSwatchesHTML = p.colors.map((c, i) => `
    <span class="color-swatch-circle ${i === 0 ? 'active' : ''}" 
          style="background-color: ${c.hex};" 
          title="${c.name}"
          data-color-slug="${c.slug}"
          data-product-id="${p.id}"
          onclick="handleSwatchCardClick(event, ${p.id}, '${c.slug}')">
    </span>
  `).join('');

  return `
    <div class="col-6 col-md-4 col-lg-4">
      <div class="product-card" id="card-${p.id}">
        <div class="product-img-wrapper">
          <div class="product-badges">
            ${p.is_new_drop ? '<span class="badge badge-drop badge-new">New Drop</span>' : ''}
            ${p.original_price ? '<span class="badge badge-drop badge-sale">Sale</span>' : ''}
          </div>
          <a href="product.html?id=${p.id}">
            <img src="${primaryImg}" alt="${p.title}" class="primary-img" id="card-img-${p.id}">
            <img src="${hoverImg}" alt="${p.title}" class="hover-img" id="card-hover-img-${p.id}">
          </a>
          <div class="product-quick-actions">
            <button class="btn btn-quick-add" onclick="handleQuickAdd(${p.id})">
              <i class="bi bi-bag-plus me-1"></i> Quick Add
            </button>
            <button class="btn btn-wishlist ${isWishlisted ? 'active' : ''}" onclick="handleWishlistClick(${p.id}, this)">
              <i class="bi ${isWishlisted ? 'bi-heart-fill' : 'bi-heart'}"></i>
            </button>
          </div>
        </div>
        <div class="product-info">
          <div class="product-category-tag">${p.category_name} &bull; ${p.gender}</div>
          <h3 class="product-title">
            <a href="product.html?id=${p.id}">${p.title}</a>
          </h3>
          <div class="product-price">
            $${p.base_price.toFixed(2)}
            ${p.original_price ? `<span class="original-price">$${p.original_price.toFixed(2)}</span>` : ''}
          </div>
          <div class="swatch-group">
            ${colorSwatchesHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Swatch click on card switches the image
window.handleSwatchCardClick = async function(event, productId, colorSlug) {
  event.preventDefault();
  event.stopPropagation();

  const product = await AtelierAPI.getProduct(productId);
  if (!product || !product.images[colorSlug]) return;

  const card = document.getElementById(`card-${productId}`);
  const primaryImg = document.getElementById(`card-img-${productId}`);
  const hoverImg = document.getElementById(`card-hover-img-${productId}`);

  if (primaryImg) primaryImg.src = product.images[colorSlug][0];
  if (hoverImg && product.images[colorSlug][1]) hoverImg.src = product.images[colorSlug][1];

  // Update active swatch state
  if (card) {
    card.querySelectorAll('.color-swatch-circle').forEach(sw => sw.classList.remove('active'));
    event.target.classList.add('active');
  }
};

// Quick add helper: adds default available size and colorway
window.handleQuickAdd = async function(productId) {
  const product = await AtelierAPI.getProduct(productId);
  if (!product) return;

  const defaultColor = product.colors[0];
  const availableSize = product.sizes.find(s => s.stock > 0);

  if (!availableSize) {
    AtelierCart.showToast(`${product.title} is currently sold out`, 'bi-x-circle');
    return;
  }

  AtelierCart.addItem(product, defaultColor, availableSize.size, 1);
};

// Wishlist button click on card
window.handleWishlistClick = function(productId, btnElement) {
  const isNowActive = AtelierCart.toggleWishlist(productId);
  if (isNowActive) {
    btnElement.classList.add('active');
    btnElement.innerHTML = '<i class="bi bi-heart-fill"></i>';
  } else {
    btnElement.classList.remove('active');
    btnElement.innerHTML = '<i class="bi bi-heart"></i>';
  }
};
