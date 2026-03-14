// scripts/seed-products.js
/*import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
    Product,
    Supplier,
    CategorySummary,
    StockAlert,
    RecentPriceChange,
    PricingTiers
} from '../models/product.js';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Dummy products data
const dummyProducts = [
    {
        "_id": "prod_001",
        "sku": "ALB-WED-CLASSIC",
        "name": "Classic Leather Wedding Album",
        "description": "Elegant leather-bound wedding album with 20 premium pages. Acid-free paper for lasting memories.",
        "category": "Wedding Albums",
        "photos": [
            "https://images.unsplash.com/photo-1544984243-ec57ea16fe25",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"
        ],
        
        "pricing": {
            "retail": 299.99,
            "wholesale": 239.99,
            "special": 209.99
        },
        
        "costPrice": 145.00,
        "supplier": "sup_001",
        
        "stockQuantity": 45,
        "reorderLevel": 20,
        
        "priceHistory": [
            {
                "_id": "hist_001",
                "oldPrice": 279.99,
                "newPrice": 299.99,
                "tier": "retail",
                "changedBy": "ST-001",
                "changedAt": new Date("2024-01-15T10:30:00Z"),
                "reason": "Annual price adjustment"
            },
            {
                "_id": "hist_002",
                "oldPrice": 219.99,
                "newPrice": 239.99,
                "tier": "wholesale",
                "changedBy": "ST-001",
                "changedAt": new Date("2024-01-15T10:30:00Z"),
                "reason": "Annual price adjustment"
            }
        ],
        
        "isActive": true,
        "createdAt": new Date("2023-06-01T08:00:00Z"),
        "updatedAt": new Date("2024-01-15T10:30:00Z")
    },
    {
        "_id": "prod_002",
        "sku": "ALB-WED-PREMIUM",
        "name": "Premium Leather Wedding Album",
        "description": "Deluxe leather album with 30 archival pages. Includes custom embossing and presentation box.",
        "category": "Wedding Albums",
        "photos": [
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa"
        ],
        
        "pricing": {
            "retail": 399.99,
            "wholesale": 319.99,
            "special": 279.99
        },
        
        "costPrice": 195.00,
        "supplier": "sup_001",
        
        "stockQuantity": 28,
        "reorderLevel": 15,
        
        "priceHistory": [],
        
        "isActive": true,
        "createdAt": new Date("2023-06-01T08:00:00Z"),
        "updatedAt": new Date("2023-06-01T08:00:00Z")
    },
    {
        "_id": "prod_003",
        "sku": "ALB-WED-DELUXE",
        "name": "Deluxe Metalic Cover Album",
        "description": "Modern album with metalic cover and 40 layflat pages. Perfect for contemporary weddings.",
        "category": "Wedding Albums",
        "photos": [],
        
        "pricing": {
            "retail": 499.99,
            "wholesale": 399.99,
            "special": 349.99
        },
        
        "costPrice": 245.00,
        "supplier": "sup_001",
        
        "stockQuantity": 12,
        "reorderLevel": 10,
        
        "priceHistory": [],
        
        "isActive": true,
        "createdAt": new Date("2023-08-15T10:00:00Z"),
        "updatedAt": new Date("2023-08-15T10:00:00Z")
    },
    {
        "_id": "prod_004",
        "sku": "BOOK-PHOTO-STD",
        "name": "Standard Photo Book",
        "description": "Softcover photo book with 20 pages. Glossy finish, perfect for events and portfolios.",
        "category": "Photo Books",
        "photos": [
            "https://images.unsplash.com/photo-1544984243-ec57ea16fe25"
        ],
        
        "pricing": {
            "retail": 49.99,
            "wholesale": 39.99,
            "special": 34.99
        },
        
        "costPrice": 22.50,
        "supplier": "sup_002",
        
        "stockQuantity": 156,
        "reorderLevel": 50,
        
        "priceHistory": [
            {
                "_id": "hist_003",
                "oldPrice": 44.99,
                "newPrice": 49.99,
                "tier": "retail",
                "changedBy": "ST-003",
                "changedAt": new Date("2024-01-05T14:20:00Z"),
                "reason": "Raw material cost increase"
            }
        ],
        
        "isActive": true,
        "createdAt": new Date("2023-05-10T09:00:00Z"),
        "updatedAt": new Date("2024-01-05T14:20:00Z")
    },
    {
        "_id": "prod_005",
        "sku": "BOOK-PHOTO-HC",
        "name": "Hardcover Photo Book",
        "description": "Premium hardcover book with 30 pages. Archival quality, multiple cover colors available.",
        "category": "Photo Books",
        "photos": [],
        
        "pricing": {
            "retail": 79.99,
            "wholesale": 63.99,
            "special": 55.99
        },
        
        "costPrice": 38.00,
        "supplier": "sup_002",
        
        "stockQuantity": 89,
        "reorderLevel": 40,
        
        "priceHistory": [],
        
        "isActive": true,
        "createdAt": new Date("2023-05-10T09:00:00Z"),
        "updatedAt": new Date("2023-05-10T09:00:00Z")
    },
    {
        "_id": "prod_006",
        "sku": "BOOK-PHOTO-LAYFLAT",
        "name": "Layflat Photo Book",
        "description": "Professional layflat pages with 40 pages. No gutter loss, perfect for panoramas.",
        "category": "Photo Books",
        "photos": [],
        
        "pricing": {
            "retail": 129.99,
            "wholesale": 103.99,
            "special": 90.99
        },
        
        "costPrice": 62.00,
        "supplier": "sup_002",
        
        "stockQuantity": 34,
        "reorderLevel": 25,
        
        "priceHistory": [],
        
        "isActive": true,
        "createdAt": new Date("2023-07-20T11:30:00Z"),
        "updatedAt": new Date("2023-07-20T11:30:00Z")
    },
    {
        "_id": "prod_007",
        "sku": "CANVAS-SM-8X10",
        "name": "Small Canvas Print 8x10",
        "description": "Gallery-wrapped canvas print. 8x10 inches, ready to hang.",
        "category": "Canvas Prints",
        "photos": [
            "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
        ],
        
        "pricing": {
            "retail": 39.99,
            "wholesale": 31.99,
            "special": 27.99
        },
        
        "costPrice": 18.50,
        "supplier": "sup_003",
        
        "stockQuantity": 203,
        "reorderLevel": 50,
        
        "priceHistory": [],
        
        "isActive": true,
        "createdAt": new Date("2023-04-01T08:00:00Z"),
        "updatedAt": new Date("2023-04-01T08:00:00Z")
    },
    {
        "_id": "prod_008",
        "sku": "CANVAS-MED-16X20",
        "name": "Medium Canvas Print 16x20",
        "description": "Gallery-wrapped canvas print. 16x20 inches, ready to hang.",
        "category": "Canvas Prints",
        "photos": [],
        
        "pricing": {
            "retail": 79.99,
            "wholesale": 63.99,
            "special": 55.99
        },
        
        "costPrice": 38.00,
        "supplier": "sup_003",
        
        "stockQuantity": 87,
        "reorderLevel": 30,
        
        "priceHistory": [
            {
                "_id": "hist_004",
                "oldPrice": 69.99,
                "newPrice": 79.99,
                "tier": "retail",
                "changedBy": "ST-002",
                "changedAt": new Date("2023-12-01T09:15:00Z"),
                "reason": "Canvas supplier price increase"
            }
        ],
        
        "isActive": true,
        "createdAt": new Date("2023-04-01T08:00:00Z"),
        "updatedAt": new Date("2023-12-01T09:15:00Z")
    },
    {
        "_id": "prod_009",
        "sku": "CANVAS-LG-24X36",
        "name": "Large Canvas Print 24x36",
        "description": "Gallery-wrapped canvas print. 24x36 inches, ready to hang.",
        "category": "Canvas Prints",
        "photos": [],
        
        "pricing": {
            "retail": 149.99,
            "wholesale": 119.99,
            "special": 104.99
        },
        
        "costPrice": 72.00,
        "supplier": "sup_003",
        
        "stockQuantity": 42,
        "reorderLevel": 20,
        
        "priceHistory": [],
        
        "isActive": true,
        "createdAt": new Date("2023-04-01T08:00:00Z"),
        "updatedAt": new Date("2023-04-01T08:00:00Z")
    },
    {
        "_id": "prod_010",
        "sku": "CANVAS-GW-24X36",
        "name": "Gallery Wrap Canvas 24x36",
        "description": "Premium gallery wrap with mirrored edges. 24x36 inches, ready to hang.",
        "category": "Canvas Prints",
        "photos": [],
        
        "pricing": {
            "retail": 189.99,
            "wholesale": 151.99,
            "special": 132.99
        },
        
        "costPrice": 92.00,
        "supplier": "sup_003",
        
        "stockQuantity": 18,
        "reorderLevel": 15,
        
        "priceHistory": [],
        
        "isActive": true,
        "createdAt": new Date("2023-09-10T13:45:00Z"),
        "updatedAt": new Date("2023-09-10T13:45:00Z")
    },
    {
        "_id": "prod_011",
        "sku": "FRAME-BASIC-8X10",
        "name": "Basic Frame 8x10",
        "description": "Simple black or white frame. 8x10 inches, includes mat board.",
        "category": "Frames",
        "photos": [],
        
        "pricing": {
            "retail": 29.99,
            "wholesale": 23.99,
            "special": 20.99
        },
        
        "costPrice": 14.00,
        "supplier": "sup_004",
        
        "stockQuantity": 312,
        "reorderLevel": 100,
        
        "priceHistory": [],
        
        "isActive": true,
        "createdAt": new Date("2023-03-15T10:00:00Z"),
        "updatedAt": new Date("2023-03-15T10:00:00Z")
    },
    {
        "_id": "prod_012",
        "sku": "FRAME-WOOD-11X14",
        "name": "Premium Wood Frame 11x14",
        "description": "Solid oak or walnut frame. 11x14 inches, archival quality.",
        "category": "Frames",
        "photos": [],
        
        "pricing": {
            "retail": 59.99,
            "wholesale": 47.99,
            "special": 41.99
        },
        
        "costPrice": 28.00,
        "supplier": "sup_004",
        
        "stockQuantity": 67,
        "reorderLevel": 30,
        
        "priceHistory": [],
        
        "isActive": true,
        "createdAt": new Date("2023-03-15T10:00:00Z"),
        "updatedAt": new Date("2023-03-15T10:00:00Z")
    },
    {
        "_id": "prod_013",
        "sku": "FRAME-METAL-16X20",
        "name": "Metal Frame 16x20",
        "description": "Brushed aluminum frame. 16x20 inches, modern look.",
        "category": "Frames",
        "photos": [],
        
        "pricing": {
            "retail": 89.99,
            "wholesale": 71.99,
            "special": 62.99
        },
        
        "costPrice": 43.00,
        "supplier": "sup_004",
        
        "stockQuantity": 24,
        "reorderLevel": 20,
        
        "priceHistory": [],
        
        "isActive": false,
        "createdAt": new Date("2023-05-20T14:30:00Z"),
        "updatedAt": new Date("2024-01-10T11:20:00Z")
    }
];

const dummySuppliers = [
    {
        "_id": "sup_001",
        "name": "Premium Album Supplies Ltd",
        "contactPerson": "John Kamau",
        "email": "john@premiumalbums.co.ke",
        "phone": "+254 722 445566",
        "products": ["ALB-WED-CLASSIC", "ALB-WED-PREMIUM", "ALB-WED-DELUXE"],
        "isActive": true,
        "createdAt": new Date("2023-01-01T00:00:00Z"),
        "updatedAt": new Date("2023-01-01T00:00:00Z")
    },
    {
        "_id": "sup_002",
        "name": "PhotoBook International",
        "contactPerson": "Mary Wanjiku",
        "email": "mary@photobook.co.ke",
        "phone": "+254 733 778899",
        "products": ["BOOK-PHOTO-STD", "BOOK-PHOTO-HC", "BOOK-PHOTO-LAYFLAT"],
        "isActive": true,
        "createdAt": new Date("2023-01-01T00:00:00Z"),
        "updatedAt": new Date("2023-01-01T00:00:00Z")
    },
    {
        "_id": "sup_003",
        "name": "Canvas Art Supplies",
        "contactPerson": "David Ochieng",
        "email": "david@canvasart.co.ke",
        "phone": "+254 711 223344",
        "products": ["CANVAS-SM-8X10", "CANVAS-MED-16X20", "CANVAS-LG-24X36", "CANVAS-GW-24X36"],
        "isActive": true,
        "createdAt": new Date("2023-01-01T00:00:00Z"),
        "updatedAt": new Date("2023-01-01T00:00:00Z")
    },
    {
        "_id": "sup_004",
        "name": "Frame Masters Ltd",
        "contactPerson": "Sarah Muthoni",
        "email": "sarah@framemasters.co.ke",
        "phone": "+254 755 667788",
        "products": ["FRAME-BASIC-8X10", "FRAME-WOOD-11X14", "FRAME-METAL-16X20"],
        "isActive": true,
        "createdAt": new Date("2023-01-01T00:00:00Z"),
        "updatedAt": new Date("2023-01-01T00:00:00Z")
    }
];

// Generate category summary
const categories = [
    "Wedding Albums",
    "Photo Books", 
    "Canvas Prints",
    "Frames"
];

const categorySummary = {
    date: new Date(),
    categories: categories.map(cat => {
        const productsInCat = dummyProducts.filter(p => p.category === cat && p.isActive);
        const totalStock = productsInCat.reduce((sum, p) => sum + p.stockQuantity, 0);
        const totalValue = productsInCat.reduce((sum, p) => sum + (p.pricing.retail * p.stockQuantity), 0);
        const avgMargin = productsInCat.length > 0 
            ? productsInCat.reduce((sum, p) => sum + ((p.pricing.retail - p.costPrice) / p.costPrice * 100), 0) / productsInCat.length
            : 0;
        
        return {
            category: cat,
            count: productsInCat.length,
            totalStock,
            totalValue,
            averageMargin: Math.round(avgMargin * 10) / 10
        };
    }),
    totalProducts: dummyProducts.length,
    activeProducts: dummyProducts.filter(p => p.isActive).length,
    lowStockItems: dummyProducts.filter(p => p.isActive && p.stockQuantity <= p.reorderLevel).length,
    outOfStockItems: dummyProducts.filter(p => p.isActive && p.stockQuantity === 0).length,
    totalInventoryValue: dummyProducts.reduce((sum, p) => sum + (p.pricing.retail * p.stockQuantity), 0),
    averageMargin: dummyProducts.filter(p => p.isActive).reduce((sum, p) => 
        sum + ((p.pricing.retail - p.costPrice) / p.costPrice * 100), 0) / dummyProducts.filter(p => p.isActive).length
};

// Generate stock alerts
const stockAlerts = dummyProducts
    .filter(p => p.isActive && p.stockQuantity <= p.reorderLevel)
    .map(p => {
        let urgency = 'low';
        if (p.stockQuantity === 0) urgency = 'critical';
        else if (p.stockQuantity <= p.reorderLevel / 2) urgency = 'high';
        else if (p.stockQuantity <= p.reorderLevel) urgency = 'medium';
        
        return {
            productId: p._id,
            sku: p.sku,
            name: p.name,
            category: p.category,
            currentStock: p.stockQuantity,
            reorderLevel: p.reorderLevel,
            status: p.stockQuantity === 0 ? 'out-of-stock' : 'low-stock',
            urgency,
            createdAt: new Date(),
            resolved: false
        };
    });

// Generate recent price changes
const recentPriceChanges = [];
dummyProducts.forEach(p => {
    p.priceHistory.forEach(hist => {
        const percentageChange = hist.oldPrice > 0 
            ? ((hist.newPrice - hist.oldPrice) / hist.oldPrice * 100)
            : 0;
        
        recentPriceChanges.push({
            productId: p._id,
            productName: p.name,
            sku: p.sku,
            tier: hist.tier,
            oldPrice: hist.oldPrice,
            newPrice: hist.newPrice,
            changedBy: hist.changedBy,
            changedAt: hist.changedAt,
            reason: hist.reason,
            percentageChange: Math.round(percentageChange * 10) / 10
        });
    });
});

async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            Product.deleteMany({}),
            Supplier.deleteMany({}),
            CategorySummary.deleteMany({}),
            StockAlert.deleteMany({}),
            RecentPriceChange.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Seed Products
        console.log('📦 Seeding products...');
        await Product.insertMany(dummyProducts);
        console.log(`✅ ${dummyProducts.length} products seeded`);

        // Seed Suppliers
        console.log('🏭 Seeding suppliers...');
        await Supplier.insertMany(dummySuppliers);
        console.log(`✅ ${dummySuppliers.length} suppliers seeded`);

        // Seed Category Summary
        console.log('📊 Seeding category summary...');
        await CategorySummary.create(categorySummary);
        console.log('✅ Category summary seeded');

        // Seed Stock Alerts
        console.log('⚠️ Seeding stock alerts...');
        if (stockAlerts.length > 0) {
            await StockAlert.insertMany(stockAlerts);
            console.log(`✅ ${stockAlerts.length} stock alerts seeded`);
        } else {
            console.log('✅ No stock alerts to seed');
        }

        // Seed Recent Price Changes
        console.log('💰 Seeding recent price changes...');
        if (recentPriceChanges.length > 0) {
            await RecentPriceChange.insertMany(recentPriceChanges);
            console.log(`✅ ${recentPriceChanges.length} recent price changes seeded`);
        } else {
            console.log('✅ No recent price changes to seed');
        }

        // Verify counts
        const counts = await Promise.all([
            Product.countDocuments(),
            Supplier.countDocuments(),
            CategorySummary.countDocuments(),
            StockAlert.countDocuments(),
            RecentPriceChange.countDocuments()
        ]);

        console.log('\n📊 Seeding Summary:');
        console.log(`   Products: ${counts[0]}`);
        console.log(`   Suppliers: ${counts[1]}`);
        console.log(`   Category Summary: ${counts[2]}`);
        console.log(`   Stock Alerts: ${counts[3]}`);
        console.log(`   Recent Price Changes: ${counts[4]}`);

        // Category breakdown
        const categoryBreakdown = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    totalStock: { $sum: "$stockQuantity" },
                    avgPrice: { $avg: "$pricing.retail" },
                    avgMargin: { $avg: { 
                        $multiply: [
                            { $divide: [
                                { $subtract: ["$pricing.retail", "$costPrice"] },
                                "$costPrice"
                            ] },
                            100
                        ] 
                    }}
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (categoryBreakdown.length > 0) {
            console.log('\n📈 Category Breakdown:');
            categoryBreakdown.forEach(cat => {
                console.log(`   ${cat._id}: ${cat.count} products, ${cat.totalStock} units, avg margin ${Math.round(cat.avgMargin)}%`);
            });
        }

        // Stock status summary
        const stockStatus = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    inStock: { $sum: { $cond: [{ $gt: ["$stockQuantity", "$reorderLevel"] }, 1, 0] } },
                    lowStock: { $sum: { $cond: [
                        { $and: [
                            { $lte: ["$stockQuantity", "$reorderLevel"] },
                            { $gt: ["$stockQuantity", 0] }
                        ]}, 1, 0
                    ]}},
                    outOfStock: { $sum: { $cond: [{ $eq: ["$stockQuantity", 0] }, 1, 0] } }
                }
            }
        ]);

        if (stockStatus.length > 0) {
            console.log('\n📦 Stock Status:');
            console.log(`   In Stock: ${stockStatus[0].inStock}`);
            console.log(`   Low Stock: ${stockStatus[0].lowStock}`);
            console.log(`   Out of Stock: ${stockStatus[0].outOfStock}`);
        }

        // Inventory value
        const inventoryValue = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalCostValue: { $sum: { $multiply: ["$costPrice", "$stockQuantity"] } },
                    totalRetailValue: { $sum: { $multiply: ["$pricing.retail", "$stockQuantity"] } }
                }
            }
        ]);

        if (inventoryValue.length > 0) {
            console.log('\n💰 Inventory Value:');
            console.log(`   Cost Value: KSh ${inventoryValue[0].totalCostValue.toFixed(2)}`);
            console.log(`   Retail Value: KSh ${inventoryValue[0].totalRetailValue.toFixed(2)}`);
            console.log(`   Potential Profit: KSh ${(inventoryValue[0].totalRetailValue - inventoryValue[0].totalCostValue).toFixed(2)}`);
        }

        console.log('\n✅ Products seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding products:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the seeding function
seedProducts();*/

// scripts/seed-products.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {
    Product,
    Supplier,
    CategorySummary,
    StockAlert,
    RecentPriceChange,
    PricingTiers,
    StockStatus
} from '../models/product.js';

// Load environment variables
dotenv.config();

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name';

// Helper function to slugify category names
const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// New products data based on the structure provided
const newProducts = [
    {
        // Product 1: Classic Leather Wedding Album
        id: "prod_001",
        _id: "prod_001",
        sku: "ALB-WED-CLASSIC",

        name: "Classic Leather Wedding Album",
        description: "Elegant leather-bound wedding album with 20 premium pages. Acid-free paper for lasting memories.",
        fullDescription: "This classic leather wedding album is handcrafted with the finest materials. Each page is made from acid-free paper to ensure your memories last a lifetime. The leather cover is available in multiple colors and can be personalized with embossing.",

        category: "Wedding Albums",
        categorySlug: "wedding-albums",
        subcategory: "Leather Albums",
        brand: "Memories Forever",

        images: [
            "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800"
        ],
        photos: [
            "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800",
            "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800"
        ],

        price: 299.99,
        retailPrice: 299.99,
        wholesalePrice: 239.99,

        pricing: {
            retail: 299.99,
            wholesale: 239.99,
            special: 209.99
        },

        originalPrice: 279.99,

        unit: "piece",
        minOrderQuantity: 1,

        costPrice: 145.00,

        supplier: "sup_001",
        suppliers: [
            { id: "sup_001", name: "Premium Album Supplies Ltd", leadTime: "5 days", minimumOrder: 10 },
            { id: "sup_002", name: "PhotoBook International", leadTime: "7 days", minimumOrder: 5 }
        ],

        stock: 45,
        stockQuantity: 45,

        stockStatus: "in-stock",
        inStock: true,

        reorderPoint: 20,
        reorderLevel: 20,

        rating: 4.8,
        reviewCount: 24,

        reviews: [
            {
                userId: "user_001",
                userName: "John Doe",
                rating: 5,
                comment: "Beautiful album, excellent quality!",
                createdAt: new Date("2024-01-10T14:30:00Z")
            },
            {
                userId: "user_002",
                userName: "Jane Smith",
                rating: 4.5,
                comment: "Great product, shipping was fast.",
                createdAt: new Date("2024-01-05T09:15:00Z")
            }
        ],

        specifications: {
            Material: "Genuine Leather",
            Pages: "20",
            PaperType: "Acid-free archival paper",
            CoverColor: "Brown, Black, Burgundy",
            Dimensions: "12x12 inches",
            Weight: "2.5 kg"
        },

        tags: ["album", "wedding", "leather", "premium", "photobook"],
        badge: "bestseller",

        downloads: [
            { name: "Product Catalog", url: "/downloads/wedding-albums-2024.pdf", type: "pdf" },
            { name: "Care Instructions", url: "/downloads/leather-care.pdf", type: "pdf" }
        ],

        priceHistory: [
            {
                _id: "hist_001",
                oldPrice: 279.99,
                newPrice: 299.99,
                tier: "retail",
                changedBy: "ST-001",
                changedAt: new Date("2024-01-15T10:30:00Z"),
                reason: "Annual price adjustment"
            }
        ],

        isFeatured: true,
        isActive: true,

        createdAt: new Date("2023-06-01T08:00:00Z"),
        updatedAt: new Date("2024-01-15T10:30:00Z")
    },
    {
        // Product 2: Digital Microscope 2000x
        id: "prod_002",
        _id: "prod_002",
        sku: "MIC-2000X",

        name: "Digital Microscope 2000x",
        description: "High magnification digital microscope ideal for laboratory and educational use.",
        fullDescription: "The MIC-2000X digital microscope offers up to 2000x magnification with high-definition imaging. Perfect for laboratory research, educational settings, and hobbyists. Features USB connectivity for live viewing on your computer.",

        category: "Lab Equipment",
        categorySlug: "lab-equipment",
        subcategory: "Microscopes",
        brand: "SciTech",

        images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=800"
        ],
        photos: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=800"
        ],

        price: 45000,
        retailPrice: 45000,
        wholesalePrice: 40000,

        pricing: {
            retail: 45000,
            wholesale: 40000,
            special: 42000
        },

        originalPrice: 52000,

        unit: "piece",
        minOrderQuantity: 1,

        costPrice: 32000,

        supplier: "sup_002",
        suppliers: [
            { id: "sup_002", name: "Microscope Tech Ltd", leadTime: "5-7 days", minimumOrder: 2 }
        ],

        stock: 35,
        stockQuantity: 35,

        stockStatus: "in-stock",
        inStock: true,

        reorderPoint: 10,
        reorderLevel: 10,

        rating: 4.5,
        reviewCount: 128,

        reviews: [
            {
                userId: "user_003",
                userName: "Dr. Robert Chen",
                rating: 5,
                comment: "Excellent microscope for our lab. Clear imaging and durable construction.",
                createdAt: new Date("2024-02-01T11:20:00Z")
            },
            {
                userId: "user_004",
                userName: "Sarah Johnson",
                rating: 4,
                comment: "Great for home school use. Kids love it!",
                createdAt: new Date("2024-01-28T16:45:00Z")
            }
        ],

        specifications: {
            Magnification: "2000x",
            Connectivity: "USB 3.0",
            Sensor: "HD CMOS 12MP",
            Resolution: "3840x2160",
            Lighting: "Adjustable LED ring light",
            Software: "Windows/Mac compatible",
            Warranty: "2 years"
        },

        tags: ["microscope", "digital", "lab", "science", "education"],
        badge: "new",

        downloads: [
            { name: "User Manual", url: "/downloads/mic-2000x-manual.pdf", type: "pdf" },
            { name: "Software Drivers", url: "/downloads/mic-2000x-drivers.zip", type: "zip" }
        ],

        priceHistory: [],

        isFeatured: true,
        isActive: true,

        createdAt: new Date("2023-11-15T09:00:00Z"),
        updatedAt: new Date("2023-11-15T09:00:00Z")
    },
    {
        // Product 3: Borosilicate Glass Beaker
        id: "gw-001",
        _id: "gw-001",
        sku: "BEAK-100",

        name: "Borosilicate Glass Beaker",
        description: "High-quality borosilicate glass beaker with graduated markings.",
        fullDescription: "These premium borosilicate glass beakers are perfect for laboratory use. Made from high-quality borosilicate glass that resists thermal shock and chemical corrosion. Features clear graduated markings for accurate measurements.",

        category: "Lab Equipment",
        categorySlug: "lab-equipment",
        subcategory: "Glassware",
        brand: "Pyrex",

        images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=800"
        ],
        photos: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
            "https://images.unsplash.com/photo-1576086213360-ff97d0d37d2b?w=800"
        ],

        price: 450,
        retailPrice: 450,
        wholesalePrice: 380,

        pricing: {
            retail: 450,
            wholesale: 380,
            special: 400
        },

        originalPrice: 450,

        unit: "piece",
        minOrderQuantity: 6,

        costPrice: 320,

        supplier: "sup-001",
        suppliers: [
            { id: "sup-001", name: "Pyrex Supplies Ltd", leadTime: "3-5 days", minimumOrder: 12 },
            { id: "sup-002", name: "Local Distributor", leadTime: "1-2 days", minimumOrder: 6 }
        ],

        stock: 245,
        stockQuantity: 245,

        stockStatus: "in-stock",
        inStock: true,

        reorderPoint: 50,
        reorderLevel: 50,

        rating: 4.7,
        reviewCount: 86,

        reviews: [
            {
                userId: "user_005",
                userName: "Lab Manager",
                rating: 5,
                comment: "Excellent quality beakers. Withstand repeated autoclaving.",
                createdAt: new Date("2024-02-10T10:30:00Z")
            },
            {
                userId: "user_006",
                userName: "Chemistry Teacher",
                rating: 4.5,
                comment: "Great for school lab. Clear markings and durable.",
                createdAt: new Date("2024-02-05T14:20:00Z")
            }
        ],

        specifications: {
            Material: "Borosilicate Glass",
            Capacity: "100ml",
            Graduation: "Yes, printed",
            Autoclavable: "Yes",
            TemperatureRange: "-20°C to 150°C",
            ChemicalResistance: "Excellent",
            PackQuantity: "12 pieces per case"
        },

        tags: ["beaker", "glassware", "laboratory", "science", "pyrex"],
        badge: "featured",

        downloads: [
            { name: "Glassware Catalog", url: "/downloads/glassware-2024.pdf", type: "pdf" },
            { name: "Safety Data Sheet", url: "/downloads/borosilicate-sds.pdf", type: "pdf" }
        ],

        priceHistory: [],

        isFeatured: true,
        isActive: true,

        createdAt: new Date("2023-08-20T08:00:00Z"),
        updatedAt: new Date("2023-08-20T08:00:00Z")
    },
    {
        // Additional product: Premium Hardcover Photo Book
        id: "prod_004",
        _id: "prod_004",
        sku: "BOOK-PHOTO-HC-02",

        name: "Premium Hardcover Photo Book",
        description: "Deluxe hardcover photo book with 40 premium pages.",
        fullDescription: "Create lasting memories with our premium hardcover photo book. Features thick, archival-quality pages and a durable hardcover. Perfect for portfolios, family albums, and special occasions.",

        category: "Photo Books",
        categorySlug: "photo-books",
        subcategory: "Hardcover",
        brand: "Memories Forever",

        images: [
            "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800"
        ],
        photos: [
            "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800"
        ],

        price: 89.99,
        retailPrice: 89.99,
        wholesalePrice: 71.99,

        pricing: {
            retail: 89.99,
            wholesale: 71.99,
            special: 62.99
        },

        originalPrice: 99.99,

        unit: "piece",
        minOrderQuantity: 5,

        costPrice: 42.00,

        supplier: "sup_002",
        suppliers: [
            { id: "sup_002", name: "PhotoBook International", leadTime: "3 days", minimumOrder: 10 }
        ],

        stock: 78,
        stockQuantity: 78,

        stockStatus: "in-stock",
        inStock: true,

        reorderPoint: 30,
        reorderLevel: 30,

        rating: 4.6,
        reviewCount: 42,

        reviews: [],

        specifications: {
            Cover: "Hardcover with linen finish",
            Pages: "40",
            PaperType: "Archival quality, 200gsm",
            Size: "8.5x11 inches",
            ColorOptions: "Black, Navy, Burgundy"
        },

        tags: ["photobook", "album", "hardcover", "premium"],
        badge: "",

        downloads: [],

        priceHistory: [],

        isFeatured: false,
        isActive: true,

        createdAt: new Date("2023-09-05T10:00:00Z"),
        updatedAt: new Date("2023-09-05T10:00:00Z")
    }
];

// Updated suppliers data
const newSuppliers = [
    {
        _id: "sup_001",
        id: "sup_001",
        name: "Premium Album Supplies Ltd",
        contactPerson: "John Kamau",
        email: "john@premiumalbums.co.ke",
        phone: "+254 722 445566",
        products: ["ALB-WED-CLASSIC"],
        leadTime: "5 days",
        minimumOrder: 10,
        isActive: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
    },
    {
        _id: "sup_002",
        id: "sup_002",
        name: "PhotoBook International",
        contactPerson: "Mary Wanjiku",
        email: "mary@photobook.co.ke",
        phone: "+254 733 778899",
        products: ["BOOK-PHOTO-HC-02"],
        leadTime: "3-5 days",
        minimumOrder: 5,
        isActive: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
    },
    {
        _id: "sup-001",
        id: "sup-001",
        name: "Pyrex Supplies Ltd",
        contactPerson: "David Ochieng",
        email: "david@pyrex.co.ke",
        phone: "+254 711 223344",
        products: ["BEAK-100"],
        leadTime: "3-5 days",
        minimumOrder: 12,
        isActive: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
    },
    {
        _id: "sup-002",
        id: "sup-002",
        name: "Local Distributor",
        contactPerson: "Sarah Muthoni",
        email: "sarah@localdist.co.ke",
        phone: "+254 755 667788",
        products: ["BEAK-100"],
        leadTime: "1-2 days",
        minimumOrder: 6,
        isActive: true,
        createdAt: new Date("2023-01-01T00:00:00Z"),
        updatedAt: new Date("2023-01-01T00:00:00Z")
    }
];

// Generate category summary
const generateCategorySummary = (products) => {
    const categories = {};
    const categorySlugs = {};
    
    products.forEach(p => {
        if (!categories[p.category]) {
            categories[p.category] = [];
            categorySlugs[p.category] = p.categorySlug;
        }
        categories[p.category].push(p);
    });

    const categorySummaries = Object.keys(categories).map(cat => {
        const catProducts = categories[cat];
        const activeProducts = catProducts.filter(p => p.isActive);
        const totalStock = activeProducts.reduce((sum, p) => sum + p.stockQuantity, 0);
        const totalValue = activeProducts.reduce((sum, p) => sum + (p.pricing.retail * p.stockQuantity), 0);
        const avgMargin = activeProducts.length > 0 
            ? activeProducts.reduce((sum, p) => sum + ((p.pricing.retail - p.costPrice) / p.costPrice * 100), 0) / activeProducts.length
            : 0;
        const avgRating = activeProducts.length > 0
            ? activeProducts.reduce((sum, p) => sum + p.rating, 0) / activeProducts.length
            : 0;
        
        return {
            category: cat,
            categorySlug: categorySlugs[cat],
            count: activeProducts.length,
            totalStock,
            totalValue,
            averageMargin: Math.round(avgMargin * 10) / 10,
            averageRating: Math.round(avgRating * 10) / 10
        };
    });

    const activeProducts = products.filter(p => p.isActive);
    
    return {
        date: new Date(),
        categories: categorySummaries,
        totalProducts: products.length,
        activeProducts: activeProducts.length,
        featuredProducts: products.filter(p => p.isFeatured && p.isActive).length,
        lowStockItems: activeProducts.filter(p => p.stockQuantity <= p.reorderLevel).length,
        outOfStockItems: activeProducts.filter(p => p.stockQuantity === 0).length,
        totalInventoryValue: activeProducts.reduce((sum, p) => sum + (p.pricing.retail * p.stockQuantity), 0),
        averageMargin: activeProducts.length > 0 
            ? Math.round(activeProducts.reduce((sum, p) => sum + ((p.pricing.retail - p.costPrice) / p.costPrice * 100), 0) / activeProducts.length * 10) / 10
            : 0,
        averageRating: activeProducts.length > 0
            ? Math.round(activeProducts.reduce((sum, p) => sum + p.rating, 0) / activeProducts.length * 10) / 10
            : 0
    };
};

// Generate stock alerts
const generateStockAlerts = (products) => {
    return products
        .filter(p => p.isActive && p.stockQuantity <= p.reorderLevel)
        .map(p => {
            let urgency = 'low';
            if (p.stockQuantity === 0) urgency = 'critical';
            else if (p.stockQuantity <= p.reorderLevel / 2) urgency = 'high';
            else if (p.stockQuantity <= p.reorderLevel) urgency = 'medium';
            
            return {
                productId: p._id,
                sku: p.sku,
                name: p.name,
                category: p.category,
                currentStock: p.stockQuantity,
                reorderPoint: p.reorderLevel,
                status: p.stockQuantity === 0 ? 'out-of-stock' : 'low-stock',
                urgency,
                createdAt: new Date(),
                resolved: false
            };
        });
};

// Generate recent price changes
const generateRecentPriceChanges = (products) => {
    const changes = [];
    products.forEach(p => {
        p.priceHistory.forEach(hist => {
            const percentageChange = hist.oldPrice > 0 
                ? ((hist.newPrice - hist.oldPrice) / hist.oldPrice * 100)
                : 0;
            
            changes.push({
                productId: p._id,
                productName: p.name,
                sku: p.sku,
                tier: hist.tier,
                oldPrice: hist.oldPrice,
                newPrice: hist.newPrice,
                changedBy: hist.changedBy,
                changedAt: hist.changedAt,
                reason: hist.reason,
                percentageChange: Math.round(percentageChange * 10) / 10
            });
        });
    });
    return changes;
};

async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🧹 Clearing existing data...');
        await Promise.all([
            Product.deleteMany({}),
            Supplier.deleteMany({}),
            CategorySummary.deleteMany({}),
            StockAlert.deleteMany({}),
            RecentPriceChange.deleteMany({})
        ]);
        console.log('✅ Existing data cleared');

        // Seed Products
        console.log('📦 Seeding products...');
        await Product.insertMany(newProducts);
        console.log(`✅ ${newProducts.length} products seeded`);

        // Seed Suppliers
        console.log('🏭 Seeding suppliers...');
        await Supplier.insertMany(newSuppliers);
        console.log(`✅ ${newSuppliers.length} suppliers seeded`);

        // Generate and seed Category Summary
        console.log('📊 Generating category summary...');
        const categorySummary = generateCategorySummary(newProducts);
        await CategorySummary.create(categorySummary);
        console.log('✅ Category summary seeded');

        // Generate and seed Stock Alerts
        console.log('⚠️ Generating stock alerts...');
        const stockAlerts = generateStockAlerts(newProducts);
        if (stockAlerts.length > 0) {
            await StockAlert.insertMany(stockAlerts);
            console.log(`✅ ${stockAlerts.length} stock alerts seeded`);
        } else {
            console.log('✅ No stock alerts to seed');
        }

        // Generate and seed Recent Price Changes
        console.log('💰 Generating recent price changes...');
        const recentPriceChanges = generateRecentPriceChanges(newProducts);
        if (recentPriceChanges.length > 0) {
            await RecentPriceChange.insertMany(recentPriceChanges);
            console.log(`✅ ${recentPriceChanges.length} recent price changes seeded`);
        } else {
            console.log('✅ No recent price changes to seed');
        }

        // Verify counts
        const counts = await Promise.all([
            Product.countDocuments(),
            Supplier.countDocuments(),
            CategorySummary.countDocuments(),
            StockAlert.countDocuments(),
            RecentPriceChange.countDocuments()
        ]);

        console.log('\n📊 Seeding Summary:');
        console.log(`   Products: ${counts[0]}`);
        console.log(`   Suppliers: ${counts[1]}`);
        console.log(`   Category Summary: ${counts[2]}`);
        console.log(`   Stock Alerts: ${counts[3]}`);
        console.log(`   Recent Price Changes: ${counts[4]}`);

        // Category breakdown
        const categoryBreakdown = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                    totalStock: { $sum: "$stockQuantity" },
                    avgPrice: { $avg: "$pricing.retail" },
                    avgRating: { $avg: "$rating" },
                    avgMargin: { $avg: { 
                        $multiply: [
                            { $divide: [
                                { $subtract: ["$pricing.retail", "$costPrice"] },
                                "$costPrice"
                            ] },
                            100
                        ] 
                    }}
                }
            },
            { $sort: { count: -1 } }
        ]);

        if (categoryBreakdown.length > 0) {
            console.log('\n📈 Category Breakdown:');
            categoryBreakdown.forEach(cat => {
                console.log(`   ${cat._id}: ${cat.count} products, ${cat.totalStock} units, avg rating ${Math.round(cat.avgRating * 10) / 10}⭐, avg margin ${Math.round(cat.avgMargin)}%`);
            });
        }

        // Stock status summary
        const stockStatus = await Product.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: null,
                    inStock: { $sum: { $cond: [{ $gt: ["$stockQuantity", "$reorderLevel"] }, 1, 0] } },
                    lowStock: { $sum: { $cond: [
                        { $and: [
                            { $lte: ["$stockQuantity", "$reorderLevel"] },
                            { $gt: ["$stockQuantity", 0] }
                        ]}, 1, 0
                    ]}},
                    outOfStock: { $sum: { $cond: [{ $eq: ["$stockQuantity", 0] }, 1, 0] } }
                }
            }
        ]);

        if (stockStatus.length > 0) {
            console.log('\n📦 Stock Status:');
            console.log(`   In Stock: ${stockStatus[0].inStock}`);
            console.log(`   Low Stock: ${stockStatus[0].lowStock}`);
            console.log(`   Out of Stock: ${stockStatus[0].outOfStock}`);
        }

        // Featured products
        const featuredCount = await Product.countDocuments({ isFeatured: true, isActive: true });
        console.log(`\n⭐ Featured Products: ${featuredCount}`);

        // Inventory value
        const inventoryValue = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalCostValue: { $sum: { $multiply: ["$costPrice", "$stockQuantity"] } },
                    totalRetailValue: { $sum: { $multiply: ["$pricing.retail", "$stockQuantity"] } }
                }
            }
        ]);

        if (inventoryValue.length > 0) {
            console.log('\n💰 Inventory Value:');
            console.log(`   Cost Value: KSh ${inventoryValue[0].totalCostValue.toFixed(2)}`);
            console.log(`   Retail Value: KSh ${inventoryValue[0].totalRetailValue.toFixed(2)}`);
            console.log(`   Potential Profit: KSh ${(inventoryValue[0].totalRetailValue - inventoryValue[0].totalCostValue).toFixed(2)}`);
        }

        console.log('\n✅ Products seeding completed successfully!');

    } catch (error) {
        console.error('❌ Error seeding products:', error);
    } finally {
        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
    }
}

// Run the seeding function
seedProducts();