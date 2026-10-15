/**
 * Atelier Luxe - Admin Portal Controller
 * Drives inventory management, inline stock updates per SKU/size,
 * customer order fulfillment transitions, and local upload preview for new styles.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminPortal();
});

async function initAdminPortal() {
  await renderKPIs();
  await renderInventoryTable();
  await renderOrdersTable();
  setupNewProductForm();
}

async function renderKPIs() {
  const products = await AtelierAPI.getProducts();
  const orders = await AtelierAPI.getProducts(); // Will fetch orders
  
  let lowStockCount = 0;
  let totalStock = 0;

  products.forEach(p => {
    p.sizes.forEach(s => {
      totalStock += s.stock;
      if (s.stock > 0 && s.stock <= 3) lowStockCount++;
    });
  });

  const ordersList = JSON.parse(localStorage.getItem('atelier_orders_cache')) || INITIAL_ORDERS;
  const totalRevenue = ordersList.reduce((sum, o) => sum + o.total_amount, 0);

  document.getElementById('kpiRevenue').textContent = `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  document.getElementById('kpiActiveOrders').textContent = ordersList.length;
  document.getElementById('kpiLowStock').textContent = lowStockCount;
  document.getElementById('kpiTotalStyles').textContent = products.length;
}

async function renderInventoryTable() {
  const container = document.getElementById('adminInventoryTbody');
  if (!container) return;

  const products = await AtelierAPI.getProducts();

  container.innerHTML = products.map(p => {
    const firstColor = Object.keys(p.images)[0];
    const img = p.images[firstColor][0];

    // Sizes stock rows
    const sizesHTML = p.sizes.map(s => `
      <div class="d-inline-flex align-items-center gap-1 me-2 mb-1 p-1 border bg-light">
        <span class="fw-bold small px-1">${s.size}:</span>
        <input type="number" min="0" max="999" value="${s.stock}" 
               style="width: 50px; font-size: 0.8rem;" 
               class="form-control form-control-sm py-0 px-1 rounded-0"
               onchange="handleQuickStockUpdate(${p.id}, '${s.size}', this.value)">
      </div>
    `).join('');

    return `
      <tr>
        <td style="width: 70px;">
          <img src="${img}" alt="${p.title}" style="width: 50px; height: 65px; object-fit: cover;" class="border">
        </td>
        <td>
          <strong class="d-block text-dark">${p.title}</strong>
          <span class="text-muted small">${p.category_name} &bull; ${p.gender}</span>
        </td>
        <td>
          <strong>$${p.base_price.toFixed(2)}</strong>
        </td>
        <td>
          <div class="d-flex flex-wrap align-items-center">
            ${sizesHTML}
          </div>
        </td>
        <td>
          <a href="product.html?id=${p.id}" target="_blank" class="btn btn-outline-dark btn-sm rounded-0">
            <i class="bi bi-box-arrow-up-right"></i> View PDP
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

window.handleQuickStockUpdate = async function(productId, sizeName, newStock) {
  const res = await AtelierAPI.adminUpdateStock(productId, sizeName, newStock);
  if (res.success) {
    AtelierCart.showToast(`Updated Size ${sizeName} stock to ${newStock}`, 'bi-check-circle');
    renderKPIs();
  }
};

async function renderOrdersTable() {
  const container = document.getElementById('adminOrdersTbody');
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem('atelier_orders_cache')) || INITIAL_ORDERS;

  container.innerHTML = orders.map(o => {
    const statusBadges = {
      'Pending': 'bg-secondary',
      'Processing': 'bg-warning text-dark',
      'Shipped': 'bg-info text-dark',
      'Delivered': 'bg-success',
      'Cancelled': 'bg-danger'
    };

    const currentBadge = statusBadges[o.status] || 'bg-secondary';

    return `
      <tr>
        <td>
          <strong class="font-monospace text-dark">${o.order_number}</strong>
          <div class="text-muted small">${o.created_at}</div>
        </td>
        <td>
          <div class="fw-semibold">${o.customer_name}</div>
          <div class="text-muted small">${o.customer_email}</div>
        </td>
        <td>
          <div class="small">
            ${o.items.map(i => `${i.title} (${i.color}, ${i.size}) x${i.qty}`).join('<br>')}
          </div>
        </td>
        <td class="fw-bold">
          $${o.total_amount.toFixed(2)}
        </td>
        <td>
          <select class="form-select form-select-sm rounded-0 border-secondary" 
                  onchange="handleOrderStatusChange('${o.order_number}', this.value)">
            <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `;
  }).join('');
}

window.handleOrderStatusChange = async function(orderNumber, newStatus) {
  const res = await AtelierAPI.adminUpdateOrderStatus(orderNumber, newStatus);
  if (res.success) {
    AtelierCart.showToast(`Order ${orderNumber} updated to ${newStatus}`, 'bi-truck');
  }
};

function setupNewProductForm() {
  const form = document.getElementById('adminNewProductForm');
  const imageInput = document.getElementById('newProdImage');
  const previewImg = document.getElementById('imageUploadPreview');

  if (imageInput && previewImg) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          previewImg.src = re.target.result;
          previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const title = document.getElementById('newProdTitle').value.trim();
      const categoryId = document.getElementById('newProdCategory').value;
      const basePrice = document.getElementById('newProdPrice').value;
      const gender = document.getElementById('newProdGender').value;
      const description = document.getElementById('newProdDescription').value.trim();
      const fabricDetails = document.getElementById('newProdFabric').value.trim();
      const imageUrl = document.getElementById('newProdImageUrl').value.trim() || 
                       (previewImg && previewImg.src ? previewImg.src : "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=900&auto=format&fit=crop");

      const categoryNames = {
        '1': 'Outerwear & Coats',
        '2': 'Knitwear & Sweaters',
        '3': 'Tailored Trousers',
        '4': 'Luxury Shirts & Tops',
        '5': 'Dresses & Silk'
      };

      const newProductPayload = {
        title,
        category_id: categoryId,
        category_name: categoryNames[categoryId],
        base_price: basePrice,
        gender,
        description,
        fabric_details: fabricDetails,
        primaryImage: imageUrl,
        colors: [
          { name: "Obsidian Black", hex: "#111111", slug: "black" },
          { name: "Ecru Ivory", hex: "#F2ECE1", slug: "ecru" }
        ],
        sizes: [
          { size: "S", stock: 8 },
          { size: "M", stock: 15 },
          { size: "L", stock: 10 }
        ]
      };

      const res = await AtelierAPI.adminCreateProduct(newProductPayload);
      if (res.success) {
        AtelierCart.showToast(`Published "${title}" to Atelier catalog!`, 'bi-check-all');
        form.reset();
        if (previewImg) previewImg.style.display = 'none';
        await renderKPIs();
        await renderInventoryTable();
        // Switch to inventory tab
        const inventoryTab = document.getElementById('pills-inventory-tab');
        if (inventoryTab) inventoryTab.click();
      }
    });
  }
}
