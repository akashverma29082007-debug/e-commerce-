/**
 * Atelier Luxe - Apparel Catalog & Master Mock Dataset
 * Models realistic fashion inventory with multi-variant SKU matrices,
 * size options, colorway swatches, and garment specifications.
 */

const ATELIER_CATEGORIES = [
  { id: 1, name: "Outerwear & Coats", slug: "outerwear", count: 4, banner: "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, name: "Knitwear & Sweaters", slug: "knitwear", count: 3, banner: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, name: "Tailored Trousers", slug: "trousers", count: 3, banner: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop" },
  { id: 4, name: "Luxury Shirts & Tops", slug: "shirts", count: 3, banner: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop" },
  { id: 5, name: "Dresses & Silk", slug: "dresses", count: 2, banner: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop" }
];

const ATELIER_PRODUCTS = [
  {
    id: 1,
    title: "Double-Breasted Cashmere-Wool Overcoat",
    slug: "double-breasted-cashmere-wool-overcoat",
    category_id: 1,
    category_name: "Outerwear & Coats",
    gender: "Men",
    base_price: 385.00,
    original_price: 450.00,
    is_featured: true,
    is_new_drop: true,
    rating: 4.9,
    review_count: 28,
    fit_summary: "True to size (Slightly relaxed tailoring)",
    fit_percent: 88, // 88% say True to size
    description: "Crafted in Northern Italy from a substantial 520 GSM blend of virgin wool and Mongolian cashmere. Features peak lapels, horn buttons, a deep rear vent, and a silky cupro lining designed for effortless layering over heavy tailoring.",
    fabric_details: "70% Virgin Wool, 30% Grade-A Mongolian Cashmere. 100% Cupro lining.",
    care_instructions: "Specialist dry clean only. Use cedar hangers to preserve shoulder structure.",
    colors: [
      { name: "Camel", hex: "#C19A6B", slug: "camel" },
      { name: "Onyx Black", hex: "#111111", slug: "black" },
      { name: "Slate Charcoal", hex: "#3A3D40", slug: "charcoal" }
    ],
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 5 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 0 } // Sold out demonstration
    ],
    images: {
      camel: [
        "https://images.unsplash.com/photo-1544923246-77307dd654cb?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516826957135-700dedea698c?q=80&w=900&auto=format&fit=crop"
      ],
      black: [
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=900&auto=format&fit=crop"
      ],
      charcoal: [
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=900&auto=format&fit=crop"
      ]
    },
    reviews: [
      { id: 101, author: "Harrison V.", rating: 5, date: "2 weeks ago", fit: "True to Size", title: "Unrivaled drape and warmth", comment: "The weight of the cashmere wool blend is extraordinary. Sits cleanly on the shoulders without pulling." },
      { id: 102, author: "Dominic L.", rating: 5, date: "1 month ago", fit: "True to Size", title: "Worth every penny", comment: "Looks like Savile Row bespoke. The horn buttons and cupro lining feel exceptionally luxurious." }
    ]
  },
  {
    id: 2,
    title: "Chunky Cable-Knit Merino Wool Crewneck",
    slug: "chunky-cable-knit-merino-crewneck",
    category_id: 2,
    category_name: "Knitwear & Sweaters",
    gender: "Unisex",
    base_price: 185.00,
    original_price: null,
    is_featured: true,
    is_new_drop: true,
    rating: 4.8,
    review_count: 34,
    fit_summary: "True to size (Boxy vintage cut)",
    fit_percent: 92,
    description: "Spun from 100% extrafine Australian Merino wool. Engineered with authentic Aran cable-knit patterns, reinforced ribbed cuffs, and an itch-free, thermo-regulating finish.",
    fabric_details: "100% Extrafine Australian Merino Wool (7-gauge heavy knit).",
    care_instructions: "Hand wash cold with wool detergent. Dry flat. Never hang.",
    colors: [
      { name: "Oatmeal Cream", hex: "#E3DAC9", slug: "cream" },
      { name: "Forest Olive", hex: "#3B4D3C", slug: "olive" },
      { name: "Espresso Brown", hex: "#42281D", slug: "espresso" }
    ],
    sizes: [
      { size: "XS", stock: 2 },
      { size: "S", stock: 6 },
      { size: "M", stock: 8 },
      { size: "L", stock: 4 },
      { size: "XL", stock: 1 }
    ],
    images: {
      cream: [
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=900&auto=format&fit=crop"
      ],
      olive: [
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=900&auto=format&fit=crop"
      ],
      espresso: [
        "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=900&auto=format&fit=crop"
      ]
    },
    reviews: [
      { id: 201, author: "Clara M.", rating: 5, date: "3 days ago", fit: "True to Size", title: "Cozy yet refined", comment: "Incredibly soft against bare skin. Not scratchy at all. Bought the cream and getting the olive next!" }
    ]
  },
  {
    id: 3,
    title: "High-Waisted Pleated Wool Flannel Trousers",
    slug: "high-waisted-pleated-wool-flannel-trousers",
    category_id: 3,
    category_name: "Tailored Trousers",
    gender: "Men",
    base_price: 195.00,
    original_price: 230.00,
    is_featured: true,
    is_new_drop: false,
    rating: 4.7,
    review_count: 19,
    fit_summary: "Runs slightly small in the waist",
    fit_percent: 74,
    description: "A sartorial staple featuring double forward pleats, extended side tab adjusters in lieu of belt loops, and an elegant gentle taper down to a clean break.",
    fabric_details: "98% Wool Flannel, 2% Elastane for natural movement.",
    care_instructions: "Dry clean. Steam to remove creases.",
    colors: [
      { name: "Charcoal Melange", hex: "#4B4E53", slug: "charcoal" },
      { name: "Navy Blue", hex: "#1B263B", slug: "navy" },
      { name: "Sand Stone", hex: "#D6CFC7", slug: "sand" }
    ],
    sizes: [
      { size: "S", stock: 1 },
      { size: "M", stock: 4 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 2 }
    ],
    images: {
      charcoal: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=900&auto=format&fit=crop"
      ],
      navy: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=900&auto=format&fit=crop"
      ],
      sand: [
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=900&auto=format&fit=crop"
      ]
    },
    reviews: [
      { id: 301, author: "Arthur S.", rating: 5, date: "1 week ago", fit: "Runs Small", title: "Impeccable cut", comment: "Size up if you are between waist sizes. The drape when walking is poetic." }
    ]
  },
  {
    id: 4,
    title: "Heavyweight Boxy Supima Cotton Overshirt",
    slug: "heavyweight-boxy-supima-cotton-overshirt",
    category_id: 4,
    category_name: "Luxury Shirts & Tops",
    gender: "Unisex",
    base_price: 135.00,
    original_price: null,
    is_featured: false,
    is_new_drop: true,
    rating: 4.9,
    review_count: 42,
    fit_summary: "True to size (Relaxed overshirt fit)",
    fit_percent: 94,
    description: "Crafted from 320 GSM American-grown Supima cotton twill. Garment-dyed for subtle patina, equipped with dual chest patch pockets and matte mother-of-pearl buttons.",
    fabric_details: "100% Long-Staple Supima Cotton Twill.",
    care_instructions: "Machine wash cold gentle cycle. Hang dry in shade.",
    colors: [
      { name: "Washed Olive", hex: "#556B2F", slug: "olive" },
      { name: "Ecru Canvas", hex: "#F3ECE1", slug: "ecru" },
      { name: "Midnight Navy", hex: "#16202C", slug: "navy" }
    ],
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 12 },
      { size: "L", stock: 7 },
      { size: "XL", stock: 3 }
    ],
    images: {
      olive: [
        "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900&auto=format&fit=crop"
      ],
      ecru: [
        "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=900&auto=format&fit=crop"
      ],
      navy: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900&auto=format&fit=crop"
      ]
    },
    reviews: [
      { id: 401, author: "Gabe T.", rating: 5, date: "Just now", fit: "True to Size", title: "Favorite layering piece", comment: "Substantial fabric weight that holds its structure all day. Perfectly executed." }
    ]
  },
  {
    id: 5,
    title: "Bias-Cut Mulberry Silk Slip Dress",
    slug: "bias-cut-mulberry-silk-slip-dress",
    category_id: 5,
    category_name: "Dresses & Silk",
    gender: "Women",
    base_price: 245.00,
    original_price: 295.00,
    is_featured: true,
    is_new_drop: false,
    rating: 5.0,
    review_count: 15,
    fit_summary: "True to size (Fluid body-skimming contour)",
    fit_percent: 96,
    description: "Sculpted on the bias in 22-momme pure mulberry silk for a sensual, liquid drape. Features adjustable delicate spaghetti straps, French seams, and a soft cowled neckline.",
    fabric_details: "100% Grade 6A Mulberry Silk (22 Momme).",
    care_instructions: "Hand wash cold with silk wash or gentle dry clean. Low iron reverse side.",
    colors: [
      { name: "Champagne Gold", hex: "#E6D5B8", slug: "champagne" },
      { name: "Burgundy Wine", hex: "#6E1B24", slug: "burgundy" },
      { name: "Midnight Black", hex: "#0D0E11", slug: "black" }
    ],
    sizes: [
      { size: "XS", stock: 2 },
      { size: "S", stock: 4 },
      { size: "M", stock: 3 },
      { size: "L", stock: 1 }
    ],
    images: {
      champagne: [
        "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=900&auto=format&fit=crop"
      ],
      burgundy: [
        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=900&auto=format&fit=crop"
      ],
      black: [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=900&auto=format&fit=crop"
      ]
    },
    reviews: [
      { id: 501, author: "Simone K.", rating: 5, date: "5 days ago", fit: "True to Size", title: "Liquid luxury", comment: "The 22 momme silk weight is visibly opaque and feels divine against the skin." }
    ]
  },
  {
    id: 6,
    title: "Cropped Suede Leather Flight Jacket",
    slug: "cropped-suede-leather-flight-jacket",
    category_id: 1,
    category_name: "Outerwear & Coats",
    gender: "Men",
    base_price: 495.00,
    original_price: null,
    is_featured: true,
    is_new_drop: true,
    rating: 4.9,
    review_count: 12,
    fit_summary: "True to size (Classic athletic cropped silhouette)",
    fit_percent: 90,
    description: "Sourced from supple Spanish goat suede with a velvety brushed nap. Features two-way brushed gunmetal zippers, tonal ribbed wool cuffs, and two interior welt pockets.",
    fabric_details: "100% Genuine Spanish Goat Suede. 100% Cotton body lining, Satin sleeve lining.",
    care_instructions: "Specialist leather clean only. Avoid prolonged moisture.",
    colors: [
      { name: "Tobacco Tan", hex: "#9E643C", slug: "tan" },
      { name: "Coffee Dark Brown", hex: "#3B2820", slug: "coffee" }
    ],
    sizes: [
      { size: "S", stock: 2 },
      { size: "M", stock: 3 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 0 }
    ],
    images: {
      tan: [
        "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=900&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1520975954732-35dd22299614?q=80&w=900&auto=format&fit=crop"
      ],
      coffee: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=900&auto=format&fit=crop"
      ]
    },
    reviews: [
      { id: 601, author: "Marcus V.", rating: 5, date: "2 weeks ago", fit: "True to Size", title: "Masterpiece outerwear", comment: "The suede nap is butter-soft. Outstanding hardware and fit." }
    ]
  }
];

// Initial mock orders for demonstration and admin tracking
const INITIAL_ORDERS = [
  {
    order_number: "ATL-89241",
    customer_name: "Chloe Vance",
    customer_email: "chloe.vance@example.com",
    created_at: "2026-10-14 14:32",
    status: "Processing",
    total_amount: 385.00,
    items: [
      { title: "Double-Breasted Cashmere-Wool Overcoat", color: "Camel", size: "M", qty: 1, price: 385.00 }
    ],
    shipping_address: "742 Evergreen Terrace, New York, NY 10001"
  },
  {
    order_number: "ATL-89240",
    customer_name: "Julian Brooks",
    customer_email: "julian.b@example.com",
    created_at: "2026-10-14 11:15",
    status: "Shipped",
    total_amount: 380.00,
    items: [
      { title: "Chunky Cable-Knit Merino Wool Crewneck", color: "Oatmeal Cream", size: "L", qty: 1, price: 185.00 },
      { title: "High-Waisted Pleated Wool Flannel Trousers", color: "Charcoal Melange", size: "L", qty: 1, price: 195.00 }
    ],
    shipping_address: "10 Downing St, London, UK"
  }
];
