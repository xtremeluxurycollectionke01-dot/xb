export interface CatalogueItem {
  id: string
  sku: string
  name: string
  description: string
  category: string
  subcategory: string
  price: number
  unit: string
  minOrderQuantity: number
  bulkPricing: {
    quantity: number
    price: number
  }[]
  inStock: boolean
  image?: string
  pageNumber: number
}

export interface Category {
  id: string
  name: string
  slug: string
  subcategories: Subcategory[]
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  itemCount: number
}

export const categories: Category[] = [
  {
    id: 'office',
    name: 'Office Supplies',
    slug: 'office-supplies',
    subcategories: [
      { id: 'paper', name: 'Paper Products', slug: 'paper', itemCount: 24 },
      { id: 'pens', name: 'Pens & Markers', slug: 'pens', itemCount: 36 },
      { id: 'filing', name: 'Filing & Storage', slug: 'filing', itemCount: 18 },
      { id: 'desk', name: 'Desk Accessories', slug: 'desk', itemCount: 22 },
    ],
  },
  {
    id: 'lab-equipment',
    name: 'Lab Equipment',
    slug: 'lab-equipment',
    subcategories: [
      { id: 'glassware', name: 'Glassware', slug: 'glassware', itemCount: 45 },
      { id: 'instruments', name: 'Instruments', slug: 'instruments', itemCount: 32 },
      { id: 'plasticware', name: 'Plasticware', slug: 'plasticware', itemCount: 28 },
      { id: 'safety', name: 'Safety Equipment', slug: 'safety', itemCount: 16 },
    ],
  },
  {
    id: 'chemicals',
    name: 'Chemicals',
    slug: 'chemicals',
    subcategories: [
      { id: 'acids', name: 'Acids', slug: 'acids', itemCount: 15 },
      { id: 'solvents', name: 'Solvents', slug: 'solvents', itemCount: 22 },
      { id: 'reagents', name: 'Reagents', slug: 'reagents', itemCount: 38 },
      { id: 'indicators', name: 'Indicators', slug: 'indicators', itemCount: 12 },
    ],
  },
  {
    id: 'furniture',
    name: 'Lab Furniture',
    slug: 'furniture',
    subcategories: [
      { id: 'workbenches', name: 'Workbenches', slug: 'workbenches', itemCount: 8 },
      { id: 'cabinets', name: 'Storage Cabinets', slug: 'cabinets', itemCount: 12 },
      { id: 'fumehoods', name: 'Fume Hoods', slug: 'fumehoods', itemCount: 6 },
    ],
  },
]

export const catalogueItems: CatalogueItem[] = [
  // Glassware
  {
    id: 'gw-001',
    sku: 'BEAK-100',
    name: 'Borosilicate Glass Beaker',
    description: 'High-quality borosilicate glass beaker with graduated markings, 100ml',
    category: 'lab-equipment',
    subcategory: 'glassware',
    price: 450,
    unit: 'piece',
    minOrderQuantity: 6,
    bulkPricing: [
      { quantity: 12, price: 400 },
      { quantity: 24, price: 350 },
      { quantity: 50, price: 300 },
    ],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    pageNumber: 12,
  },
  {
    id: 'gw-002',
    sku: 'FLASK-250',
    name: 'Erlenmeyer Flask',
    description: 'Borosilicate glass Erlenmeyer flask with narrow neck, 250ml',
    category: 'lab-equipment',
    subcategory: 'glassware',
    price: 650,
    unit: 'piece',
    minOrderQuantity: 4,
    bulkPricing: [
      { quantity: 10, price: 580 },
      { quantity: 20, price: 500 },
    ],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=400',
    pageNumber: 13,
  },
  {
    id: 'gw-003',
    sku: 'CYL-500',
    name: 'Graduated Cylinder',
    description: 'Class A graduated cylinder with pour spout, 500ml',
    category: 'lab-equipment',
    subcategory: 'glassware',
    price: 1200,
    unit: 'piece',
    minOrderQuantity: 2,
    bulkPricing: [
      { quantity: 6, price: 1100 },
      { quantity: 12, price: 1000 },
    ],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
    pageNumber: 14,
  },

  // Instruments
  {
    id: 'inst-001',
    sku: 'MIC-DIG-100',
    name: 'Digital Microscope',
    description: 'HD digital microscope with 1000x magnification and USB output',
    category: 'lab-equipment',
    subcategory: 'instruments',
    price: 45000,
    unit: 'piece',
    minOrderQuantity: 1,
    bulkPricing: [
      { quantity: 3, price: 42000 },
      { quantity: 5, price: 40000 },
    ],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    pageNumber: 25,
  },
  {
    id: 'inst-002',
    sku: 'CENT-4K',
    name: 'Centrifuge Machine',
    description: 'Benchtop centrifuge with 4x100ml rotor, max speed 4000 RPM',
    category: 'lab-equipment',
    subcategory: 'instruments',
    price: 89000,
    unit: 'piece',
    minOrderQuantity: 1,
    bulkPricing: [
      { quantity: 2, price: 85000 },
      { quantity: 4, price: 80000 },
    ],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400',
    pageNumber: 26,
  },

  // Chemicals
  {
    id: 'chem-001',
    sku: 'HCL-37-2.5L',
    name: 'Hydrochloric Acid 37%',
    description: 'Laboratory grade hydrochloric acid, 2.5L bottle',
    category: 'chemicals',
    subcategory: 'acids',
    price: 2800,
    unit: 'bottle',
    minOrderQuantity: 2,
    bulkPricing: [
      { quantity: 6, price: 2500 },
      { quantity: 12, price: 2200 },
    ],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    pageNumber: 38,
  },
  {
    id: 'chem-002',
    sku: 'ETOH-99-1L',
    name: 'Ethanol 99%',
    description: 'Absolute ethanol, molecular biology grade, 1L',
    category: 'chemicals',
    subcategory: 'solvents',
    price: 1800,
    unit: 'bottle',
    minOrderQuantity: 3,
    bulkPricing: [
      { quantity: 12, price: 1600 },
      { quantity: 24, price: 1400 },
    ],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
    pageNumber: 42,
  },

  // Office Supplies
  {
    id: 'off-001',
    sku: 'PAP-A4-80',
    name: 'A4 Copy Paper',
    description: '80gsm white copy paper, 500 sheets per ream',
    category: 'office',
    subcategory: 'paper',
    price: 550,
    unit: 'ream',
    minOrderQuantity: 5,
    bulkPricing: [
      { quantity: 20, price: 500 },
      { quantity: 50, price: 450 },
    ],
    inStock: true,
    image: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
    pageNumber: 5,
  },
]

// Flipbook pages data
export interface FlipbookPage {
  pageNumber: number
  imageUrl: string
  items: CatalogueItem[]
}

export const flipbookPages: FlipbookPage[] = [
  {
    pageNumber: 1,
    imageUrl: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800',
    items: catalogueItems.filter(item => item.pageNumber >= 1 && item.pageNumber <= 4),
  },
  {
    pageNumber: 2,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    items: catalogueItems.filter(item => item.pageNumber >= 5 && item.pageNumber <= 8),
  },
  // Add more pages as needed
]