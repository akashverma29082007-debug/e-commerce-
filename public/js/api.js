/**
 * Atelier Luxe - Decoupled Client API Layer
 * Provides clean asynchronous Promise-based contracts for all e-commerce operations.
 * Currently serves from client data store with instant transition hooks to Express REST API (/api/v1/*).
 */

const AtelierAPI = (function() {
  const USE_BACKEND_API = false; // When Express backend is running, toggle to true
  const BASE_URL = '/api/v1';

  // Local storage keys for persisting mutations during client-only review
  const STORAGE_KEY_PRODUCTS = 'atelier_products_cache';
  const STORAGE_KEY_ORDERS = 'atelier_orders_cache';

  function initLocalCache() {
    if (!localStorage.getItem(STORAGE_KEY_PRODUCTS)) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(ATELIER_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEY_ORDERS)) {
      localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(INITIAL_ORDERS));
    }
  }

  initLocalCache();

  function getLocalProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_PRODUCTS)) || ATELIER_PRODUCTS;
  }

  function saveLocalProducts(products) {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }

  function getLocalOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS)) || INITIAL_ORDERS;
  }

  function saveLocalOrders(orders) {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }

  // Simulated asynchronous latency for smooth UI feedback
  function simulateAsync(data, delay = 60) {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
  }

  return {
    // 1. Fetch Categories
    async getCategories() {
      if (USE_BACKEND_API) {
        const res = await fetch(`${BASE_URL}/categories`);
        return await res.json();
      }
      return simulateAsync(ATELIER_CATEGORIES);
    },

    // 2. Fetch Products with Multi-Faceted Filters
    async getProducts(filters = {}) {
      if (USE_BACKEND_API) {
        const query = new URLSearchParams(filters).toString();
        const res = await fetch(`${BASE_URL}/products?${query}`);
        return await res.json();
      }

      let products = [...getLocalProducts()];

      // Filter: Category
      if (filters.category && filters.category !== 'all') {
        products = products.filter(p => p.category_id === parseInt(filters.category) || p.slug.includes(filters.category));
      }

      // Filter: Gender / Collection
      if (filters.gender && filters.gender !== 'all') {
        products = products.filter(p => p.gender.toLowerCase() === filters.gender.toLowerCase() || p.gender === 'Unisex');
      }

      // Filter: Size
      if (filters.size) {
        products = products.filter(p => p.sizes.some(s => s.size === filters.size && s.stock > 0));
      }

      // Filter: Color
      if (filters.color) {
        products = products.filter(p => p.colors.some(c => c.slug === filters.color || c.name.toLowerCase().includes(filters.color.toLowerCase())));
      }

      // Filter: Price Range
      if (filters.maxPrice) {
        products = products.filter(p => p.base_price <= parseFloat(filters.maxPrice));
      }

      // Filter: Search Keyword
      if (filters.search) {
        const term = filters.search.toLowerCase();
        products = products.filter(p => 
          p.title.toLowerCase().includes(term) || 
          p.description.toLowerCase().includes(term) ||
          p.category_name.toLowerCase().includes(term)
        );
      }

      // Sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'price_asc':
            products.sort((a, b) => a.base_price - b.base_price);
            break;
          case 'price_desc':
            products.sort((a, b) => b.base_price - a.base_price);
            break;
          case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
          case 'newest':
          default:
            products.sort((a, b) => (b.is_new_drop ? 1 : 0) - (a.is_new_drop ? 1 : 0));
            break;
        }
      }

      return simulateAsync(products);
    },

    // 3. Get Single Product by ID or Slug
    async getProduct(idOrSlug) {
      if (USE_BACKEND_API) {
        const res = await fetch(`${BASE_URL}/products/${idOrSlug}`);
        return await res.json();
      }

      const products = getLocalProducts();
      const product = products.find(p => p.id === parseInt(idOrSlug) || p.slug === idOrSlug);
      return simulateAsync(product || null);
    },

    // 4. Place Customer Order
    async createOrder(orderPayload) {
      if (USE_BACKEND_API) {
        const res = await fetch(`${BASE_URL}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload)
        });
        return await res.json();
      }

      // Decrement simulated stock
      const products = getLocalProducts();
      orderPayload.items.forEach(orderItem => {
        const prod = products.find(p => p.id === orderItem.productId);
        if (prod) {
          const sz = prod.sizes.find(s => s.size === orderItem.size);
          if (sz && sz.stock >= orderItem.quantity) {
            sz.stock -= orderItem.quantity;
          }
        }
      });
      saveLocalProducts(products);

      // Record order
      const orders = getLocalOrders();
      const newOrderNumber = 'ATL-' + Math.floor(10000 + Math.random() * 90000);
      const newOrder = {
        order_number: newOrderNumber,
        customer_name: `${orderPayload.shipping.firstName} ${orderPayload.shipping.lastName}`,
        customer_email: orderPayload.shipping.email,
        created_at: new Date().toLocaleString(),
        status: "Processing",
        total_amount: orderPayload.total,
        items: orderPayload.items.map(i => ({
          title: i.title,
          color: i.color,
          size: i.size,
          qty: i.quantity,
          price: i.price
        })),
        shipping_address: `${orderPayload.shipping.address}, ${orderPayload.shipping.city}, ${orderPayload.shipping.postalCode}`
      };

      orders.unshift(newOrder);
      saveLocalOrders(orders);

      return simulateAsync({ success: true, orderNumber: newOrderNumber, order: newOrder });
    },

    // 5. Get Order By Number (Tracking & Receipt)
    async getOrderByNumber(orderNumber) {
      if (USE_BACKEND_API) {
        const res = await fetch(`${BASE_URL}/orders/${orderNumber}`);
        return await res.json();
      }

      const orders = getLocalOrders();
      const order = orders.find(o => o.order_number === orderNumber);
      return simulateAsync(order || null);
    },

    // 6. Add Product Review
    async addReview(productId, reviewData) {
      if (USE_BACKEND_API) {
        const res = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reviewData)
        });
        return await res.json();
      }

      const products = getLocalProducts();
      const product = products.find(p => p.id === parseInt(productId));
      if (product) {
        const review = {
          id: Date.now(),
          author: reviewData.author || "Anonymous Customer",
          rating: parseInt(reviewData.rating) || 5,
          date: "Just now",
          fit: reviewData.fit || "True to Size",
          title: reviewData.title || "Customer Review",
          comment: reviewData.comment || ""
        };
        product.reviews.unshift(review);
        product.review_count += 1;
        saveLocalProducts(products);
        return simulateAsync({ success: true, review });
      }
      return simulateAsync({ success: false, error: "Product not found" });
    },

    // 7. Admin: Update Variant Stock Quantity
    async adminUpdateStock(productId, sizeName, newStock) {
      if (USE_BACKEND_API) {
        const res = await fetch(`${BASE_URL}/admin/variants/stock`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, sizeName, newStock })
        });
        return await res.json();
      }

      const products = getLocalProducts();
      const prod = products.find(p => p.id === parseInt(productId));
      if (prod) {
        const sz = prod.sizes.find(s => s.size === sizeName);
        if (sz) {
          sz.stock = parseInt(newStock);
          saveLocalProducts(products);
          return simulateAsync({ success: true, product: prod });
        }
      }
      return simulateAsync({ success: false, error: "Variant not found" });
    },

    // 8. Admin: Update Order Status
    async adminUpdateOrderStatus(orderNumber, newStatus) {
      if (USE_BACKEND_API) {
        const res = await fetch(`${BASE_URL}/admin/orders/${orderNumber}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        return await res.json();
      }

      const orders = getLocalOrders();
      const order = orders.find(o => o.order_number === orderNumber);
      if (order) {
        order.status = newStatus;
        saveLocalOrders(orders);
        return simulateAsync({ success: true, order });
      }
      return simulateAsync({ success: false, error: "Order not found" });
    },

    // 9. Admin: Create New Product
    async adminCreateProduct(newProductData) {
      if (USE_BACKEND_API) {
        const res = await fetch(`${BASE_URL}/admin/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProductData)
        });
        return await res.json();
      }

      const products = getLocalProducts();
      const id = Date.now();
      const product = {
        id,
        title: newProductData.title,
        slug: newProductData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category_id: parseInt(newProductData.category_id) || 1,
        category_name: newProductData.category_name || "Outerwear & Coats",
        gender: newProductData.gender || "Unisex",
        base_price: parseFloat(newProductData.base_price) || 99.00,
        original_price: null,
        is_featured: !!newProductData.is_featured,
        is_new_drop: true,
        rating: 5.0,
        review_count: 0,
        fit_summary: "True to size",
        fit_percent: 100,
        description: newProductData.description || "Master tailoring crafted with the finest luxury fabrics.",
        fabric_details: newProductData.fabric_details || "100% Organic Luxury Fibers",
        care_instructions: newProductData.care_instructions || "Dry clean only",
        colors: newProductData.colors || [{ name: "Standard Black", hex: "#111111", slug: "black" }],
        sizes: newProductData.sizes || [
          { size: "S", stock: 10 },
          { size: "M", stock: 15 },
          { size: "L", stock: 10 }
        ],
        images: newProductData.images || {
          black: [newProductData.primaryImage || "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=900&auto=format&fit=crop"]
        },
        reviews: []
      };

      products.unshift(product);
      saveLocalProducts(products);
      return simulateAsync({ success: true, product });
    }
  };
})();
