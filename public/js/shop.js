/**
 * Atelier Luxe - Shop & Faceted Catalog Controller
 * Drives live filtering (Categories, Gender, Sizes, Colors, Price slider),
 * sorting, active filter tags, and URL query param synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
  initShopPage();
});

let currentFilters = {
  category: 'all',
  gender: 'all',
  size: '',
  color: '',
  maxPrice: 500,
  sort: 'newest',
  search: ''
};

async function initShopPage() {
  // 1. Read URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('category')) currentFilters.category = urlParams.get('category');
  if (urlParams.has('gender')) currentFilters.gender = urlParams.get('gender');
  if (urlParams.has('search')) currentFilters.search = urlParams.get('search');

  // 2. Setup Filter Event Listeners
  setupCategoryListeners();
  setupGenderListeners();
  setupSizeListeners();
  setupColorListeners();
  setupPriceSlider();
  setupSortListener();

  // 3. Perform Initial Fetch & Render
  await executeFilters();
}

function setupCategoryListeners() {
  const categoryInputs = document.querySelectorAll('input[name="filterCategory"]');
  categoryInputs.forEach(input => {
    if (input.value === currentFilters.category) input.checked = true;
    input.addEventListener('change', (e) => {
      currentFilters.category = e.target.value;
      executeFilters();
    });
  });
}

function setupGenderListeners() {
  const genderInputs = document.querySelectorAll('input[name="filterGender"]');
  genderInputs.forEach(input => {
    if (input.value === currentFilters.gender) input.checked = true;
    input.addEventListener('change', (e) => {
      currentFilters.gender = e.target.value;
      executeFilters();
    });
  });
}

function setupSizeListeners() {
  const sizeBtns = document.querySelectorAll('.size-filter-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedSize = btn.getAttribute('data-size');
      if (currentFilters.size === selectedSize) {
        currentFilters.size = '';
        btn.classList.remove('active');
      } else {
        sizeBtns.forEach(b => b.classList.remove('active'));
        currentFilters.size = selectedSize;
        btn.classList.add('active');
      }
      executeFilters();
    });
  });
}

function setupColorListeners() {
  const colorSwatches = document.querySelectorAll('.color-filter-swatch');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const selectedColor = swatch.getAttribute('data-color');
      if (currentFilters.color === selectedColor) {
        currentFilters.color = '';
        swatch.classList.remove('active');
      } else {
        colorSwatches.forEach(s => s.classList.remove('active'));
        currentFilters.color = selectedColor;
        swatch.classList.add('active');
      }
      executeFilters();
    });
  });
}

function setupPriceSlider() {
  const slider = document.getElementById('priceRangeSlider');
  const label = document.getElementById('priceRangeLabel');
  if (!slider || !label) return;

  slider.addEventListener('input', (e) => {
    label.textContent = `$${e.target.value}`;
  });

  slider.addEventListener('change', (e) => {
    currentFilters.maxPrice = e.target.value;
    executeFilters();
  });
}

function setupSortListener() {
  const sortSelect = document.getElementById('sortSelect');
  if (!sortSelect) return;

  sortSelect.addEventListener('change', (e) => {
    currentFilters.sort = e.target.value;
    executeFilters();
  });
}

// Execute filters asynchronously against decoupled API
async function executeFilters() {
  const grid = document.getElementById('shopProductsGrid');
  const countEl = document.getElementById('productResultsCount');
  const tagsContainer = document.getElementById('activeFilterTags');

  if (grid) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border spinner-border-sm text-dark me-2"></div>
        <span class="text-muted">Filtering catalog...</span>
      </div>
    `;
  }

  renderActiveTags(tagsContainer);

  const products = await AtelierAPI.getProducts(currentFilters);

  if (countEl) {
    countEl.textContent = `Showing ${products.length} style${products.length === 1 ? '' : 's'}`;
  }

  if (!grid) return;

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-funnel text-muted display-4"></i>
        <h4 class="font-serif mt-3 mb-2">No matching garments found</h4>
        <p class="text-muted small mb-4">Try clearing one or more active filters or search terms.</p>
        <button class="btn btn-atelier" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => createProductCardHTML(p)).join('');
}

function renderActiveTags(container) {
  if (!container) return;

  const tags = [];
  if (currentFilters.category && currentFilters.category !== 'all') {
    tags.push({ label: `Category: ${currentFilters.category}`, key: 'category', resetVal: 'all' });
  }
  if (currentFilters.gender && currentFilters.gender !== 'all') {
    tags.push({ label: `Gender: ${currentFilters.gender}`, key: 'gender', resetVal: 'all' });
  }
  if (currentFilters.size) {
    tags.push({ label: `Size: ${currentFilters.size}`, key: 'size', resetVal: '' });
  }
  if (currentFilters.color) {
    tags.push({ label: `Color: ${currentFilters.color}`, key: 'color', resetVal: '' });
  }
  if (currentFilters.maxPrice < 500) {
    tags.push({ label: `Max: $${currentFilters.maxPrice}`, key: 'maxPrice', resetVal: 500 });
  }

  if (tags.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
      <span class="small text-muted fw-semibold">Active:</span>
      ${tags.map(t => `
        <span class="badge bg-light text-dark border px-2 py-1 d-inline-flex align-items-center gap-1">
          ${t.label}
          <button class="btn btn-link text-muted p-0 border-0 ms-1" onclick="clearSpecificFilter('${t.key}', '${t.resetVal}')">
            <i class="bi bi-x"></i>
          </button>
        </span>
      `).join('')}
      <button class="btn btn-link text-dark small p-0 text-decoration-underline ms-2" onclick="resetAllFilters()">
        Clear All
      </button>
    </div>
  `;
}

window.clearSpecificFilter = function(key, resetVal) {
  currentFilters[key] = resetVal;
  
  // Uncheck/reset DOM elements
  if (key === 'category') {
    document.querySelector('input[name="filterCategory"][value="all"]').checked = true;
  } else if (key === 'gender') {
    document.querySelector('input[name="filterGender"][value="all"]').checked = true;
  } else if (key === 'size') {
    document.querySelectorAll('.size-filter-btn').forEach(b => b.classList.remove('active'));
  } else if (key === 'color') {
    document.querySelectorAll('.color-filter-swatch').forEach(s => s.classList.remove('active'));
  } else if (key === 'maxPrice') {
    const slider = document.getElementById('priceRangeSlider');
    const label = document.getElementById('priceRangeLabel');
    if (slider) slider.value = 500;
    if (label) label.textContent = '$500';
  }

  executeFilters();
};

window.resetAllFilters = function() {
  currentFilters = {
    category: 'all',
    gender: 'all',
    size: '',
    color: '',
    maxPrice: 500,
    sort: 'newest',
    search: ''
  };

  document.querySelector('input[name="filterCategory"][value="all"]').checked = true;
  document.querySelector('input[name="filterGender"][value="all"]').checked = true;
  document.querySelectorAll('.size-filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.color-filter-swatch').forEach(s => s.classList.remove('active'));
  
  const slider = document.getElementById('priceRangeSlider');
  const label = document.getElementById('priceRangeLabel');
  if (slider) slider.value = 500;
  if (label) label.textContent = '$500';

  executeFilters();
};
