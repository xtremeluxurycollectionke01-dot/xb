/*export interface Product {
  id: string
  sku: string
  name: string
  description: string
  category: string
  categorySlug: string
  subcategory: string
  brand: string
  price: number
  retailPrice: number
  unit: string
  minOrderQuantity: number
  stock: number
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock'
  rating: number
  reviewCount: number
  images: string[]
  specifications: Record<string, string>
  tags: string[]
  isNew?: boolean
  isFeatured?: boolean
  discount?: number
}

export const products: Product[] = [
  {
    id: 'gw-001',
    sku: 'BEAK-100',
    name: 'Borosilicate Glass Beaker',
    description: 'High-quality borosilicate glass beaker with graduated markings. Resistant to thermal shock and chemical corrosion. Ideal for laboratory use.',
    category: 'Lab Equipment',
    categorySlug: 'lab-equipment',
    subcategory: 'Glassware',
    brand: 'Pyrex',
    price: 450,
    retailPrice: 450,
    unit: 'piece',
    minOrderQuantity: 6,
    stock: 245,
    stockStatus: 'in-stock',
    rating: 4.5,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      'https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=400',
    ],
    specifications: {
      'Material': 'Borosilicate Glass',
      'Capacity': '100ml',
      'Graduation': 'Yes',
      'Autoclavable': 'Yes',
    },
    tags: ['beaker', 'glassware', 'laboratory'],
    isFeatured: true,
  },
  {
    id: 'gw-002',
    sku: 'FLASK-250',
    name: 'Erlenmeyer Flask',
    description: 'Borosilicate glass Erlenmeyer flask with narrow neck. Ideal for mixing, heating, and storing liquids.',
    category: 'Lab Equipment',
    categorySlug: 'lab-equipment',
    subcategory: 'Glassware',
    brand: 'Pyrex',
    price: 650,
    retailPrice: 650,
    unit: 'piece',
    minOrderQuantity: 4,
    stock: 128,
    stockStatus: 'in-stock',
    rating: 4.8,
    reviewCount: 95,
    images: [
      'https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=400',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    ],
    specifications: {
      'Material': 'Borosilicate Glass',
      'Capacity': '250ml',
      'Neck Type': 'Narrow',
      'Autoclavable': 'Yes',
    },
    tags: ['flask', 'glassware', 'erlenmeyer'],
    isNew: true,
  },
  {
    id: 'gw-003',
    sku: 'CYL-500',
    name: 'Graduated Cylinder',
    description: 'Class A graduated cylinder with hexagonal base for stability. Features clear graduations and pour spout.',
    category: 'Lab Equipment',
    categorySlug: 'lab-equipment',
    subcategory: 'Glassware',
    brand: 'Kimble',
    price: 1200,
    retailPrice: 1200,
    unit: 'piece',
    minOrderQuantity: 2,
    stock: 67,
    stockStatus: 'low-stock',
    rating: 4.6,
    reviewCount: 42,
    images: [
      'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    ],
    specifications: {
      'Material': 'Borosilicate Glass',
      'Capacity': '500ml',
      'Accuracy': 'Class A',
      'Base': 'Hexagonal',
    },
    tags: ['cylinder', 'graduated', 'glassware'],
  },
  {
    id: 'inst-001',
    sku: 'MIC-DIG-100',
    name: 'Digital Microscope',
    description: 'HD digital microscope with 1000x magnification. Features USB output, adjustable LED illumination, and software for image capture.',
    category: 'Lab Equipment',
    categorySlug: 'lab-equipment',
    subcategory: 'Instruments',
    brand: 'LabTech',
    price: 45000,
    retailPrice: 45000,
    unit: 'piece',
    minOrderQuantity: 1,
    stock: 23,
    stockStatus: 'in-stock',
    rating: 4.9,
    reviewCount: 56,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400',
    ],
    specifications: {
      'Magnification': '1000x',
      'Type': 'Digital',
      'Illumination': 'LED',
      'Output': 'USB 2.0',
    },
    tags: ['microscope', 'digital', 'instruments'],
    isFeatured: true,
    isNew: true,
  },
  {
    id: 'inst-002',
    sku: 'CENT-4K',
    name: 'Centrifuge Machine',
    description: 'Benchtop centrifuge with 4x100ml rotor. Digital display, timer, and safety lock. Max speed 4000 RPM.',
    category: 'Lab Equipment',
    categorySlug: 'lab-equipment',
    subcategory: 'Instruments',
    brand: 'Heraeus',
    price: 89000,
    retailPrice: 89000,
    unit: 'piece',
    minOrderQuantity: 1,
    stock: 8,
    stockStatus: 'low-stock',
    rating: 4.7,
    reviewCount: 34,
    images: [
      'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    ],
    specifications: {
      'Max Speed': '4000 RPM',
      'Capacity': '4 x 100ml',
      'Display': 'Digital',
      'Safety': 'Lid Lock',
    },
    tags: ['centrifuge', 'instruments', 'lab-equipment'],
  },
  {
    id: 'chem-001',
    sku: 'HCL-37-2.5L',
    name: 'Hydrochloric Acid 37%',
    description: 'Laboratory grade hydrochloric acid, 37% concentration. Supplied in 2.5L amber glass bottle with safety seal.',
    category: 'Chemicals',
    categorySlug: 'chemicals',
    subcategory: 'Acids',
    brand: 'Sigma-Aldrich',
    price: 2800,
    retailPrice: 2800,
    unit: 'bottle',
    minOrderQuantity: 2,
    stock: 156,
    stockStatus: 'in-stock',
    rating: 4.4,
    reviewCount: 78,
    images: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400',
    ],
    specifications: {
      'Purity': '37%',
      'Grade': 'Laboratory',
      'Volume': '2.5L',
      'Packaging': 'Amber Glass',
    },
    tags: ['acid', 'chemical', 'hcl'],
  },
  {
    id: 'chem-002',
    sku: 'ETOH-99-1L',
    name: 'Ethanol 99%',
    description: 'Absolute ethanol, molecular biology grade. Denatured, suitable for DNA/RNA work.',
    category: 'Chemicals',
    categorySlug: 'chemicals',
    subcategory: 'Solvents',
    brand: 'VWR',
    price: 1800,
    retailPrice: 1800,
    unit: 'bottle',
    minOrderQuantity: 3,
    stock: 0,
    stockStatus: 'out-of-stock',
    rating: 4.3,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
    ],
    specifications: {
      'Purity': '99%',
      'Grade': 'Molecular Biology',
      'Volume': '1L',
      'Denatured': 'Yes',
    },
    tags: ['ethanol', 'alcohol', 'solvent'],
  },
  {
    id: 'off-001',
    sku: 'PAP-A4-80',
    name: 'A4 Copy Paper',
    description: '80gsm white copy paper, 500 sheets per ream. Suitable for all printers and copiers.',
    category: 'Office Supplies',
    categorySlug: 'office-supplies',
    subcategory: 'Paper',
    brand: 'Navigator',
    price: 550,
    retailPrice: 550,
    unit: 'ream',
    minOrderQuantity: 5,
    stock: 1250,
    stockStatus: 'in-stock',
    rating: 4.6,
    reviewCount: 234,
    images: [
      'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
    ],
    specifications: {
      'Size': 'A4',
      'Weight': '80gsm',
      'Sheets': '500',
      'Brightness': '92%',
    },
    tags: ['paper', 'office', 'printing'],
    discount: 10,
  },
  {
    id: 'off-002',
    sku: 'PEN-BLUE-10',
    name: 'Ballpoint Pens (Blue)',
    description: 'Smooth writing ballpoint pens with blue ink. Pack of 10.',
    category: 'Office Supplies',
    categorySlug: 'office-supplies',
    subcategory: 'Pens',
    brand: 'Bic',
    price: 250,
    retailPrice: 280,
    unit: 'pack',
    minOrderQuantity: 5,
    stock: 850,
    stockStatus: 'in-stock',
    rating: 4.5,
    reviewCount: 189,
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    ],
    specifications: {
      'Type': 'Ballpoint',
      'Ink Color': 'Blue',
      'Pack Size': '10',
      'Retractable': 'No',
    },
    tags: ['pens', 'office', 'stationery'],
    discount: 15,
  },
]

export const brands = [...new Set(products.map(p => p.brand))].sort()
export const categories = [...new Set(products.map(p => p.category))].sort()

export interface FilterState {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  ratings: number[]
  inStock: boolean
  onSale: boolean
  newArrivals: boolean
}

export const priceRanges = [
  { label: 'Under KES 1,000', min: 0, max: 1000 },
  { label: 'KES 1,000 - 5,000', min: 1000, max: 5000 },
  { label: 'KES 5,000 - 20,000', min: 5000, max: 20000 },
  { label: 'KES 20,000 - 50,000', min: 20000, max: 50000 },
  { label: 'Over KES 50,000', min: 50000, max: Infinity },
]*/

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  category: string
  categorySlug: string
  subcategory: string
  brand: string
  price: number
  retailPrice: number
  unit: string
  minOrderQuantity: number
  stock: number
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock'
  rating: number
  reviewCount: number
  images: string[]
  specifications: Record<string, string>
  tags: string[]
  isNew?: boolean
  isFeatured?: boolean
  discount?: number
  // Extended fields
  fullDescription?: string
  downloads?: DownloadItem[]
  reviews?: Review[]
  wholesalePrice?: number
  costPrice?: number // Staff only
  reorderPoint?: number
  suppliers?: Supplier[]
bulkPricing?: BulkPricingTier[]
}

export interface BulkPricingTier {
  quantity: number
  price: number
}

export interface DownloadItem {
  name: string
  fileSize: string
  fileType: string
  url: string
}

export interface Review {
  id: string
  userName: string
  userAvatar?: string
  rating: number
  date: string
  title: string
  comment: string
  verified: boolean
}

export interface Supplier {
  id: string
  name: string
  leadTime: string
  minimumOrder: number
}

export const products: Product[] = [
  {
    id: 'gw-001',
    sku: 'BEAK-100',
    name: 'Borosilicate Glass Beaker',
    description: 'High-quality borosilicate glass beaker with graduated markings. Resistant to thermal shock and chemical corrosion. Ideal for laboratory use.',
    category: 'Lab Equipment',
    categorySlug: 'lab-equipment',
    subcategory: 'Glassware',
    brand: 'Pyrex',
    price: 450,
    retailPrice: 450,
    unit: 'piece',
    minOrderQuantity: 6,
    stock: 245,
    stockStatus: 'in-stock',
    rating: 4.5,
    reviewCount: 128,
    images: [
      'https://images.nsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      'https://images.nsplash.com/photo-1576086213360-ff97d0d37d2b?w=400',
    ],
    specifications: {
      'Material': 'Borosilicate Glass',
      'Capacity': '100ml',
      'Graduation': 'Yes',
      'Autoclavable': 'Yes',
    },
    tags: ['beaker', 'glassware', 'laboratory'],
    isFeatured: true,
    // Extended data
    fullDescription: `
      <p>The Borosilicate Glass Beaker is an essential piece of laboratory glassware, manufactured from high-quality borosilicate glass (ISO 3585). This material offers exceptional thermal shock resistance and chemical durability, making it ideal for a wide range of laboratory applications including heating, mixing, and measuring liquids.</p>
      <p>Key features include:</p>
      <ul>
        <li>Graduated markings in ml for approximate measurements</li>
        <li>Reinforced rim for added strength and easy pouring</li>
        <li>Large marking area for sample identification</li>
        <li>Excellent transparency for clear visibility of contents</li>
        <li>Autoclavable and sterilizable without damage</li>
      </ul>
      <p>Perfect for educational laboratories, research facilities, and industrial applications. Each beaker is manufactured to strict quality standards ensuring consistent performance and reliability.</p>
    `,
    downloads: [
      { name: 'Product Datasheet', fileSize: '245 KB', fileType: 'PDF', url: '/downloads/beaker-100-datasheet.pdf' },
      { name: 'Safety Data Sheet', fileSize: '180 KB', fileType: 'PDF', url: '/downloads/beaker-100-sds.pdf' },
      { name: 'Usage Instructions', fileSize: '120 KB', fileType: 'PDF', url: '/downloads/beaker-100-manual.pdf' },
    ],
    reviews: [
      {
        id: 'rev-001',
        userName: 'Dr. Sarah Johnson',
        rating: 5,
        date: '2024-01-15',
        title: 'Excellent quality glassware',
        comment: 'These beakers are perfect for our teaching labs. The glass is thick and durable, and the graduations are clear and accurate.',
        verified: true,
      },
      {
        id: 'rev-002',
        userName: 'Prof. James Mwangi',
        rating: 4,
        date: '2024-01-10',
        title: 'Good product, fast delivery',
        comment: 'Quality is consistent with previous orders. Delivery was prompt and packaging was secure.',
        verified: true,
      },
    ],
    wholesalePrice: 380,
    costPrice: 320,
    reorderPoint: 50,
    suppliers: [
      { id: 'sup-001', name: 'Pyrex Supplies Ltd', leadTime: '3-5 days', minimumOrder: 12 },
      { id: 'sup-002', name: 'Local Distributor', leadTime: '1-2 days', minimumOrder: 6 },
    ],
  },
  {
    id: 'gw-002',
    sku: 'FLASK-250',
    name: 'Erlenmeyer Flask',
    description: 'Borosilicate glass Erlenmeyer flask with narrow neck. Ideal for mixing, heating, and storing liquids.',
    category: 'Lab Equipment',
    categorySlug: 'lab-equipment',
    subcategory: 'Glassware',
    brand: 'Pyrex',
    price: 650,
    retailPrice: 650,
    unit: 'piece',
    minOrderQuantity: 4,
    stock: 128,
    stockStatus: 'in-stock',
    rating: 4.8,
    reviewCount: 95,
    images: [
      'https://images.nsplash.com/photo-1576086213360-ff97d0d37d2b?w=400',
      'https://images.nsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    ],
    specifications: {
      'Material': 'Borosilicate Glass',
      'Capacity': '250ml',
      'Neck Type': 'Narrow',
      'Autoclavable': 'Yes',
    },
    tags: ['flask', 'glassware', 'erlenmeyer'],
    isNew: true,
  },
  {
    id: 'gw-003',
    sku: 'CYL-500',
    name: 'Graduated Cylinder',
    description: 'Class A graduated cylinder with hexagonal base for stability. Features clear graduations and pour spout.',
    category: 'Lab Equipment',
    categorySlug: 'lab-equipment',
    subcategory: 'Glassware',
    brand: 'Kimble',
    price: 1200,
    retailPrice: 1200,
    unit: 'piece',
    minOrderQuantity: 2,
    stock: 67,
    stockStatus: 'low-stock',
    rating: 4.6,
    reviewCount: 42,
    images: [
      'https://images.nsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
      'https://images.nsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    ],
    specifications: {
      'Material': 'Borosilicate Glass',
      'Capacity': '500ml',
      'Accuracy': 'Class A',
      'Base': 'Hexagonal',
    },
    tags: ['cylinder', 'graduated', 'glassware'],
  },
  {
    id: 'inst-001',
    sku: 'MIC-DIG-100',
    name: 'Digital Microscope',
    description: 'HD digital microscope with 1000x magnification. Features USB output, adjustable LED illumination, and software for image capture.',
    category: 'Lab Equipment',
    categorySlug: 'lab-equipment',
    subcategory: 'Instruments',
    brand: 'LabTech',
    price: 45000,
    retailPrice: 45000,
    unit: 'piece',
    minOrderQuantity: 1,
    stock: 23,
    stockStatus: 'in-stock',
    rating: 4.9,
    reviewCount: 56,
    images: [
      'https://images.nsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      'https://images.nsplash.com/photo-1581093588401-fbb62a02f120?w=400',
    ],
    specifications: {
      'Magnification': '1000x',
      'Type': 'Digital',
      'Illumination': 'LED',
      'Output': 'USB 2.0',
    },
    tags: ['microscope', 'digital', 'instruments'],
    isFeatured: true,
    isNew: true,
    // Extended data
    fullDescription: `
      <p>The Digital Microscope delivers professional-grade imaging capabilities in a compact, user-friendly package. With 1000x magnification and HD digital output, it's perfect for educational demonstrations, research applications, and quality control inspections.</p>
      <p>Advanced features include:</p>
      <ul>
        <li>HD CMOS sensor for crisp, clear images</li>
        <li>Adjustable LED illumination with intensity control</li>
        <li>USB 2.0 output for direct connection to computers</li>
        <li>Software included for image capture and measurement</li>
        <li>Compatible with Windows and Mac OS</li>
      </ul>
      <p>Includes calibration slide, dust cover, and software CD. Backed by 2-year warranty.</p>
    `,
    downloads: [
      { name: 'Product Brochure', fileSize: '1.2 MB', fileType: 'PDF', url: '/downloads/microscope-brochure.pdf' },
      { name: 'Software Driver', fileSize: '45 MB', fileType: 'ZIP', url: '/downloads/microscope-driver.zip' },
      { name: 'User Manual', fileSize: '3.5 MB', fileType: 'PDF', url: '/downloads/microscope-manual.pdf' },
    ],
    reviews: [
      {
        id: 'rev-003',
        userName: 'Lab Technician Emily',
        rating: 5,
        date: '2024-01-05',
        title: 'Excellent microscope for the price',
        comment: 'Image quality is superb. The software is intuitive and the capture function works perfectly. Highly recommended.',
        verified: true,
      },
    ],
    wholesalePrice: 38500,
    costPrice: 32000,
    reorderPoint: 3,
    suppliers: [
      { id: 'sup-003', name: 'LabTech Direct', leadTime: '5-7 days', minimumOrder: 1 },
    ],
  },
  {
    id: 'inst-002',
    sku: 'CENT-4K',
    name: 'Centrifuge Machine',
    description: 'Benchtop centrifuge with 4x100ml rotor. Digital display, timer, and safety lock. Max speed 4000 RPM.',
    category: 'Lab Equipment',
    categorySlug: 'lab-equipment',
    subcategory: 'Instruments',
    brand: 'Heraeus',
    price: 89000,
    retailPrice: 89000,
    unit: 'piece',
    minOrderQuantity: 1,
    stock: 8,
    stockStatus: 'low-stock',
    rating: 4.7,
    reviewCount: 34,
    images: [
      'https://images.nsplash.com/photo-1581093588401-fbb62a02f120?w=400',
      'https://images.nsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    ],
    specifications: {
      'Max Speed': '4000 RPM',
      'Capacity': '4 x 100ml',
      'Display': 'Digital',
      'Safety': 'Lid Lock',
    },
    tags: ['centrifuge', 'instruments', 'lab-equipment'],
  },
  {
    id: 'chem-001',
    sku: 'HCL-37-2.5L',
    name: 'Hydrochloric Acid 37%',
    description: 'Laboratory grade hydrochloric acid, 37% concentration. Supplied in 2.5L amber glass bottle with safety seal.',
    category: 'Chemicals',
    categorySlug: 'chemicals',
    subcategory: 'Acids',
    brand: 'Sigma-Aldrich',
    price: 2800,
    retailPrice: 2800,
    unit: 'bottle',
    minOrderQuantity: 2,
    stock: 156,
    stockStatus: 'in-stock',
    rating: 4.4,
    reviewCount: 78,
    images: [
      'https://images.nsplash.com/photo-1532094349884-543bc11b234d?w=400',
    ],
    specifications: {
      'Purity': '37%',
      'Grade': 'Laboratory',
      'Volume': '2.5L',
      'Packaging': 'Amber Glass',
    },
    tags: ['acid', 'chemical', 'hcl'],
  },
  {
    id: 'chem-002',
    sku: 'ETOH-99-1L',
    name: 'Ethanol 99%',
    description: 'Absolute ethanol, molecular biology grade. Denatured, suitable for DNA/RNA work.',
    category: 'Chemicals',
    categorySlug: 'chemicals',
    subcategory: 'Solvents',
    brand: 'VWR',
    price: 1800,
    retailPrice: 1800,
    unit: 'bottle',
    minOrderQuantity: 3,
    stock: 0,
    stockStatus: 'out-of-stock',
    rating: 4.3,
    reviewCount: 112,
    images: [
      'https://images.nsplash.com/photo-1581091226033-d5c48150dbaa?w=400',
    ],
    specifications: {
      'Purity': '99%',
      'Grade': 'Molecular Biology',
      'Volume': '1L',
      'Denatured': 'Yes',
    },
    tags: ['ethanol', 'alcohol', 'solvent'],
  },
  {
    id: 'off-001',
    sku: 'PAP-A4-80',
    name: 'A4 Copy Paper',
    description: '80gsm white copy paper, 500 sheets per ream. Suitable for all printers and copiers.',
    category: 'Office Supplies',
    categorySlug: 'office-supplies',
    subcategory: 'Paper',
    brand: 'Navigator',
    price: 550,
    retailPrice: 550,
    unit: 'ream',
    minOrderQuantity: 5,
    stock: 1250,
    stockStatus: 'in-stock',
    rating: 4.6,
    reviewCount: 234,
    images: [
      'https://images.nsplash.com/photo-1497032628192-86f99bcd76bc?w=400',
    ],
    specifications: {
      'Size': 'A4',
      'Weight': '80gsm',
      'Sheets': '500',
      'Brightness': '92%',
    },
    tags: ['paper', 'office', 'printing'],
    discount: 10,
  },
  {
    id: 'off-002',
    sku: 'PEN-BLUE-10',
    name: 'Ballpoint Pens (Blue)',
    description: 'Smooth writing ballpoint pens with blue ink. Pack of 10.',
    category: 'Office Supplies',
    categorySlug: 'office-supplies',
    subcategory: 'Pens',
    brand: 'Bic',
    price: 250,
    retailPrice: 280,
    unit: 'pack',
    minOrderQuantity: 5,
    stock: 850,
    stockStatus: 'in-stock',
    rating: 4.5,
    reviewCount: 189,
    images: [
      'https://images.nsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
    ],
    specifications: {
      'Type': 'Ballpoint',
      'Ink Color': 'Blue',
      'Pack Size': '10',
      'Retractable': 'No',
    },
    tags: ['pens', 'office', 'stationery'],
    discount: 15,
  },
]

export const brands = [...new Set(products.map(p => p.brand))].sort()
export const categories = [...new Set(products.map(p => p.category))].sort()

export interface FilterState {
  categories: string[]
  brands: string[]
  priceRange: [number, number]
  ratings: number[]
  inStock: boolean
  onSale: boolean
  newArrivals: boolean
}

export const priceRanges = [
  { label: 'Under KES 1,000', min: 0, max: 1000 },
  { label: 'KES 1,000 - 5,000', min: 1000, max: 5000 },
  { label: 'KES 5,000 - 20,000', min: 5000, max: 20000 },
  { label: 'KES 20,000 - 50,000', min: 20000, max: 50000 },
  { label: 'Over KES 50,000', min: 50000, max: Infinity },
]

// Utility functions for extended product data
export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id)
}

// Recently viewed products (localStorage-based utility)
export const RECENTLY_VIEWED_KEY = 'labpro_recently_viewed'
export const MAX_RECENT_ITEMS = 6

export const getRecentlyViewed = (): Product[] => {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
    const ids = stored ? JSON.parse(stored) : []
    return ids
      .map((id: string) => getProductById(id))
      .filter(Boolean)
      .slice(0, MAX_RECENT_ITEMS)
  } catch {
    return []
  }
}

export const addToRecentlyViewed = (productId: string) => {
  if (typeof window === 'undefined') return
  
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY)
    let ids: string[] = stored ? JSON.parse(stored) : []
    
    // Remove if already exists
    ids = ids.filter(id => id !== productId)
    
    // Add to beginning
    ids.unshift(productId)
    
    // Keep only max items
    ids = ids.slice(0, MAX_RECENT_ITEMS)
    
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(ids))
  } catch (error) {
    console.error('Failed to update recently viewed:', error)
  }
}