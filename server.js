/**
 * ATELIER LUXE - Express.js Decoupled Server
 * Serves the decoupled client-side application (HTML, CSS, Vanilla JS)
 * and the local uploads directory.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, 'public')));

// Serve local upload assets
app.use('/uploads', express.static(uploadsDir));

// System Health & Decoupled Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Atelier Luxe E-Commerce Platform',
    architecture: 'Decoupled (Vanilla Frontend + Express REST)',
    currentPhase: 'Frontend Review & Decoupled Serving',
    port: PORT
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n=============================================================`);
  console.log(`✨ ATELIER LUXE — APPAREL STOREFRONT SERVER ONLINE ✨`);
  console.log(`-------------------------------------------------------------`);
  console.log(`🌐 Storefront:       http://localhost:${PORT}`);
  console.log(`🛍️ Catalog Shop:     http://localhost:${PORT}/shop.html`);
  console.log(`👗 Product Detail:   http://localhost:${PORT}/product.html?id=1`);
  console.log(`💳 Express Checkout: http://localhost:${PORT}/checkout.html`);
  console.log(`🔐 Admin Portal:     http://localhost:${PORT}/admin.html`);
  console.log(`=============================================================\n`);
});
