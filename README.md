# ATELIER LUXE — Decoupled Apparel E-Commerce Web Application

**Role:** Lead Software Architect  
**Architecture:** Decoupled Architecture (Vanilla HTML5 / CSS3 / ES6+ JavaScript + Bootstrap 5 + Express REST API)  
**Current Phase:** Phase 1 — Frontend Implementation & User Review  

---

## 🏛️ Architecture Overview

This project is built following an **iterative decoupled architecture**:
1. **Frontend Layer (`public/`)**:
   - Zero frontend framework overhead (strictly **NO** React, Vue, or Angular).
   - Built with **semantic HTML5**, **Vanilla ES6+ JavaScript**, and **Bootstrap 5 CSS**.
   - Augmented by a custom luxury fashion design system (`public/css/custom.css`) with bespoke typography (`Playfair Display`, `Cinzel`, `Plus Jakarta Sans`), dark/light neutral palettes, glassmorphism, and micro-animations.
   - Decoupled API abstraction layer (`public/js/api.js`) communicating asynchronously via standard Promise/Fetch contracts.
2. **Persistence & Data State**:
   - Persistent client-side shopping bag, wishlist, and temporary catalog cache stored via `localStorage`.
   - Real-time stock decrementing, dynamic free shipping meter, and live discount calculations.
3. **Upcoming Backend Layer (Phase 2)**:
   - Headless **Node.js + Express.js** server exposing REST API endpoints under `/api/v1/*`.
   - **SQLite3** relational database with schema for Categories, Products, Variants (SKU, Size, Color, Stock), Orders, and Reviews.
   - Dedicated local folder (`uploads/`) for handling image uploads via `multer`.

---

## 📁 Project Directory Structure

```
E commerce website/
│
├── README.md                      # Documentation & Review Guide
│
└── public/                        # Decoupled Frontend Application
    ├── index.html                 # Storefront Homepage (Hero, Seasonal Categories, Trending Drops)
    ├── shop.html                  # Catalog Shop (Live faceted filters, price slider, sorting)
    ├── product.html               # Product Detail Page (Dynamic color swatches, size guide, gallery zoom)
    ├── checkout.html              # Streamlined Checkout (Dynamic courier rates, coupon codes, card mask)
    ├── order-success.html         # Order Receipt & 4-step delivery tracking stepper
    ├── admin.html                 # Admin Portal (KPI cards, inline SKU stock editor, order management)
    │
    ├── css/
    │   └── custom.css             # Luxury fashion design system & animations
    │
    └── js/
        ├── data.js                # Master fashion dataset with multi-variant SKUs & specs
        ├── api.js                 # Decoupled client API layer (ready to swap to Express /api/v1)
        ├── cart.js                # Shopping bag state, slide-out drawer & toast alerts
        ├── app.js                 # Global controller, sticky navbar, live search modal
        ├── shop.js                # Catalog filter engine
        ├── product-detail.js      # Variant colorway switcher, size scarcity alerts, reviews
        ├── checkout.js            # Checkout validator & order creator
        └── admin.js               # Admin stock updater & new garment publisher
```

---

## 🌟 Interactive Features Ready for Review

### 1. Storefront Discovery (`index.html`)
- **Top Announcement Bar**: Dynamic messaging on complimentary express courier thresholds.
- **Hero Showcase**: Editorial high-fashion hero banner with seasonal typography.
- **Seasonal Categories Grid**: Quick access to Outerwear, Knitwear, Trousers, Shirts, and Dresses.
- **Trending Drops Showcase**: Responsive product cards with hover-to-flip image switching, quick-add drawer button, and wishlist toggle.
- **Global Search Modal**: Click the magnifying glass in the navbar to search garments live with real-time autocompletion.

### 2. Catalog Shop & Live Filtering (`shop.html`)
- **Instant Facet Filtering (Zero Page Reload)**:
  - Filter by Department (Outerwear, Knitwear, Trousers, Shirts, Dresses)
  - Filter by Gender (Men, Women, All)
  - Filter by Size (XS, S, M, L, XL)
  - Filter by Color Swatch (Camel, Black, Charcoal, Cream, Olive, Navy, Champagne, Burgundy)
  - Price Range Slider ($50 – $500)
- **Active Filter Badges**: Remove individual filter tags or click "Clear All".
- **Dynamic Sorting**: Sort by New Drops, Price (Low to High), Price (High to Low), or Customer Rating.

### 3. Rich Product Detail Page (`product.html`)
- **Variant-Driven Gallery**: Click any color swatch (e.g. *Camel* vs. *Onyx Black* vs. *Slate Charcoal* on the Overcoat) and watch the photo gallery dynamically swap to that colorway's photos.
- **Size Selector & Scarcity Alerts**: Low stock (< 3 units) triggers an amber alert badge. Sold-out sizes are automatically struck through and disabled.
- **Interactive Size Guide Modal**: Click *"Size & Fit Guide"* to view comprehensive European & US garment measurements (Chest, Waist, Hips, Inseam in inches and cm).
- **Accordions**: Sourcing & Fabric details (GSM weight, fibers), Garment Care instructions, and Courier Delivery terms.
- **Customer Reviews & Fit Meter**: Visual indicator showing if the garment runs small, true to size, or large, plus a modal to submit verified reviews.

### 4. Slide-Out Shopping Bag Drawer
- Accessible from any page by clicking the bag icon in the navbar or via "Quick Add" / "Add to Bag".
- Dynamic **Free Express Shipping Progress Meter** (e.g., *"Add $15.00 more to unlock Free Express Shipping"*).
- Quantity stepper controls (`+` / `-`) and one-click removal with animated toast feedback.

### 5. Streamlined Checkout Flow (`checkout.html`)
- Continuous checkout form: Contact information, Delivery destination, Courier shipping selection, and Payment method (Card or Cash on Delivery).
- Auto-formatted card inputs (number spacing, MM/YY masking).
- **Promotion Code Engine**: Test with `ATELIER10` or `VIP10` for 10% off, or `LUXE20` for 20% off.
- Authorizes and transitions to the order confirmation page.

### 6. Order Tracking & Manifest (`order-success.html`)
- Displays unique order reference (e.g. `ATL-89241`) with copy-to-clipboard button.
- 4-step delivery progress stepper (*Order Placed → Tailoring & Pack → Courier Dispatch → Delivered*).
- Itemized garment receipt and destination address summary.

### 7. Admin Operations Portal (`admin.html`)
- **KPI Metrics**: Real-time Gross Volume Settled, Active Orders, Low Stock Alerts, and Catalog Styles.
- **Inline SKU Stock Editor**: Edit variant stock quantity per size (e.g., Size M from 5 to 20) with immediate persistence.
- **Orders Queue**: View inbound customer orders and transition statuses (*Processing → Shipped → Delivered*).
- **Add New Garment Form**: Includes file selection preview for the local uploads folder concept, category assignment, and dynamic variant publishing.

---

## 🚀 How to Review the Frontend

You can inspect and interact with the application immediately:
1. Open [`public/index.html`](file:///c:/Users/ADMIN/Desktop/E%20commerce%20website/public/index.html) in Google Chrome, Microsoft Edge, or any modern web browser.
2. Navigate across the pages (`Collection`, `Outerwear`, `Product Detail`, `Shopping Bag`, `Checkout`, `Admin Portal`).
3. Test variant swatches, filters, adding items to bag, running through checkout, and editing inventory in the admin portal.

Once you have reviewed the frontend and approved the layout and experience, we will proceed to **Phase 2: Backend Implementation (Node.js + Express.js + SQLite3 + Multer Local Uploads)**!
