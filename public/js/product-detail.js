/**
 * Atelier Luxe - Product Detail Page (PDP) Controller
 * Drives multi-variant switching (swapping photos when color changes),
 * size inventory checking, thumbnail reels, size guide modal,
 * and review submissions.
 */

document.addEventListener('DOMContentLoaded', () => {
  initProductDetailPage();
});

let currentProduct = null;
let selectedColor = null;
let selectedSize = null;
let activeImageIndex = 0;

async function initProductDetailPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id') || 1;

  currentProduct = await AtelierAPI.getProduct(productId);
  if (!currentProduct) {
    document.getElementById('pdpContent').innerHTML = `
      <div class="container py-5 text-center">
        <h2 class="font-serif">Garment Not Found</h2>
        <p class="text-muted">The garment you are looking for is no longer in the active catalog.</p>
        <a href="shop.html" class="btn btn-atelier mt-3">Return to Collection</a>
      </div>
    `;
    return;
  }

  // Set default variants
  selectedColor = currentProduct.colors[0];
  const firstInStockSize = currentProduct.sizes.find(s => s.stock > 0);
  selectedSize = firstInStockSize ? firstInStockSize.size : null;

  renderProductDetails();
  renderGallery();
  renderReviews();
  renderRelatedProducts();
  setupReviewForm();
}

function renderProductDetails() {
  // Breadcrumbs & Title
  document.getElementById('pdpBreadcrumbCategory').textContent = currentProduct.category_name;
  document.getElementById('pdpBreadcrumbCategory').href = `shop.html?category=${currentProduct.category_id}`;
  document.getElementById('pdpBreadcrumbTitle').textContent = currentProduct.title;
  document.title = `${currentProduct.title} | ATELIER LUXE`;

  document.getElementById('pdpCategory').textContent = `${currentProduct.category_name} • ${currentProduct.gender}`;
  document.getElementById('pdpTitle').textContent = currentProduct.title;
  
  // Price
  const priceEl = document.getElementById('pdpPrice');
  priceEl.innerHTML = `
    $${currentProduct.base_price.toFixed(2)}
    ${currentProduct.original_price ? `<span class="original-price ms-2">$${currentProduct.original_price.toFixed(2)}</span>` : ''}
  `;

  // Rating
  document.getElementById('pdpRatingScore').textContent = currentProduct.rating.toFixed(1);
  document.getElementById('pdpReviewCount').textContent = `(${currentProduct.review_count} reviews)`;

  // Description & Garment Specs
  document.getElementById('pdpDescription').textContent = currentProduct.description;
  document.getElementById('pdpFabricDetails').textContent = currentProduct.fabric_details;
  document.getElementById('pdpCareInstructions').textContent = currentProduct.care_instructions;

  // Fit Summary
  document.getElementById('pdpFitSummary').textContent = currentProduct.fit_summary;
  const fitMarker = document.getElementById('pdpFitMarker');
  if (fitMarker) {
    // Center is 50% (True to size)
    fitMarker.style.left = `${currentProduct.fit_percent || 50}%`;
  }

  // Color Swatches
  renderColorSwatches();

  // Size Chips & Stock Alerts
  renderSizeChips();

  // Wishlist Button State
  const wishBtn = document.getElementById('pdpWishlistBtn');
  if (wishBtn) {
    const isSaved = AtelierCart.isInWishlist(currentProduct.id);
    updateWishlistBtnUI(wishBtn, isSaved);
    wishBtn.onclick = () => {
      const active = AtelierCart.toggleWishlist(currentProduct.id);
      updateWishlistBtnUI(wishBtn, active);
    };
  }

  // Add to Bag Button
  const addToBagBtn = document.getElementById('pdpAddToBagBtn');
  if (addToBagBtn) {
    addToBagBtn.onclick = handleAddToBag;
  }
}

function updateWishlistBtnUI(btn, isSaved) {
  if (isSaved) {
    btn.classList.add('active', 'border-danger', 'text-danger');
    btn.innerHTML = '<i class="bi bi-heart-fill me-2"></i> Saved in Wishlist';
  } else {
    btn.classList.remove('active', 'border-danger', 'text-danger');
    btn.innerHTML = '<i class="bi bi-heart me-2"></i> Save to Wishlist';
  }
}

function renderColorSwatches() {
  const container = document.getElementById('pdpColorSwatches');
  const label = document.getElementById('pdpColorLabel');
  if (!container) return;

  label.textContent = selectedColor.name;

  container.innerHTML = currentProduct.colors.map(c => `
    <span class="color-swatch-circle ${c.slug === selectedColor.slug ? 'active' : ''}" 
          style="background-color: ${c.hex}; width: 26px; height: 26px;" 
          title="${c.name}"
          data-slug="${c.slug}"
          onclick="handleColorChange('${c.slug}')">
    </span>
  `).join('');
}

window.handleColorChange = function(colorSlug) {
  const found = currentProduct.colors.find(c => c.slug === colorSlug);
  if (!found) return;

  selectedColor = found;
  activeImageIndex = 0;
  renderColorSwatches();
  renderGallery();
};

function renderSizeChips() {
  const container = document.getElementById('pdpSizeChips');
  const alertEl = document.getElementById('pdpStockAlert');
  if (!container) return;

  container.innerHTML = currentProduct.sizes.map(s => {
    const isSoldOut = s.stock === 0;
    const isSelected = s.size === selectedSize;
    return `
      <button type="button" 
              class="size-selector-btn ${isSelected ? 'active' : ''} ${isSoldOut ? 'disabled' : ''}" 
              data-size="${s.size}"
              ${isSoldOut ? 'disabled' : ''}
              onclick="handleSizeChange('${s.size}')">
        ${s.size}
      </button>
    `;
  }).join('');

  // Update Scarcity Alert
  const currentSizeObj = currentProduct.sizes.find(s => s.size === selectedSize);
  if (alertEl) {
    if (currentSizeObj && currentSizeObj.stock > 0 && currentSizeObj.stock <= 3) {
      alertEl.innerHTML = `<i class="bi bi-fire me-1"></i> Low Stock Alert: Only <strong>${currentSizeObj.stock} left</strong> in Size ${currentSizeObj.size}!`;
      alertEl.style.display = 'inline-flex';
    } else if (currentSizeObj && currentSizeObj.stock === 0) {
      alertEl.innerHTML = `<i class="bi bi-exclamation-circle me-1"></i> Currently sold out in Size ${currentSizeObj.size}`;
      alertEl.style.display = 'inline-flex';
    } else {
      alertEl.style.display = 'none';
    }
  }
}

window.handleSizeChange = function(size) {
  selectedSize = size;
  renderSizeChips();
};

function renderGallery() {
  const mainImg = document.getElementById('pdpMainImg');
  const reel = document.getElementById('pdpThumbnailReel');
  if (!mainImg || !reel) return;

  // Get photos for current colorway, or fallback
  const photos = currentProduct.images[selectedColor.slug] || 
                 currentProduct.images[Object.keys(currentProduct.images)[0]];

  mainImg.src = photos[activeImageIndex] || photos[0];

  reel.innerHTML = photos.map((url, idx) => `
    <img src="${url}" 
         alt="${currentProduct.title} - view ${idx + 1}" 
         class="pdp-thumb-img ${idx === activeImageIndex ? 'active' : ''}"
         onclick="setActivePhoto(${idx})">
  `).join('');
}

window.setActivePhoto = function(idx) {
  activeImageIndex = idx;
  renderGallery();
};

function handleAddToBag() {
  if (!selectedSize) {
    AtelierCart.showToast('Please select your size before adding to bag', 'bi-exclamation-circle');
    return;
  }

  const photos = currentProduct.images[selectedColor.slug] || 
                 currentProduct.images[Object.keys(currentProduct.images)[0]];
  const activeImage = photos[activeImageIndex] || photos[0];

  AtelierCart.addItem(currentProduct, selectedColor, selectedSize, 1, activeImage);
}

function renderReviews() {
  const container = document.getElementById('pdpReviewsList');
  if (!container) return;

  if (currentProduct.reviews.length === 0) {
    container.innerHTML = '<p class="text-muted">No reviews yet. Be the first to review this garment.</p>';
    return;
  }

  container.innerHTML = currentProduct.reviews.map(r => `
    <div class="border-bottom py-3">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <div>
          <span class="text-warning small">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
          <strong class="font-sans ms-2 small">${r.author}</strong>
          <span class="badge bg-light text-success border ms-2 small">Verified Client</span>
        </div>
        <span class="text-muted small">${r.date}</span>
      </div>
      <div class="small text-muted mb-2">Garment Fit: <span class="fw-semibold text-dark">${r.fit}</span></div>
      <h6 class="fw-bold fs-6 mb-1">${r.title}</h6>
      <p class="text-muted small mb-0">${r.comment}</p>
    </div>
  `).join('');
}

function setupReviewForm() {
  const form = document.getElementById('writeReviewForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const author = document.getElementById('reviewAuthor').value.trim();
    const rating = document.getElementById('reviewRating').value;
    const fit = document.getElementById('reviewFit').value;
    const title = document.getElementById('reviewTitle').value.trim();
    const comment = document.getElementById('reviewComment').value.trim();

    await AtelierAPI.addReview(currentProduct.id, { author, rating, fit, title, comment });
    
    // Refresh product reviews
    currentProduct = await AtelierAPI.getProduct(currentProduct.id);
    renderReviews();
    document.getElementById('pdpReviewCount').textContent = `(${currentProduct.review_count} reviews)`;

    // Close modal
    const modalEl = document.getElementById('writeReviewModal');
    const modalInstance = bootstrap.Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();
    form.reset();
    AtelierCart.showToast('Thank you! Your review has been submitted.');
  });
}

async function renderRelatedProducts() {
  const container = document.getElementById('pdpRelatedProducts');
  if (!container) return;

  const allProducts = await AtelierAPI.getProducts();
  const related = allProducts.filter(p => p.id !== currentProduct.id).slice(0, 3);

  container.innerHTML = related.map(p => createProductCardHTML(p)).join('');
}
