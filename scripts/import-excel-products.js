import mongoose from 'mongoose';
import xlsx from 'xlsx';
import dotenv from 'dotenv';
import { Product } from '../models/product.js';

dotenv.config();
const XLSX = xlsx;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env");
  process.exit(1);
}

mongoose.set('strictQuery', false);

// -------------------- HELPERS --------------------
function normalizeRow(row) {
  const newRow = {};
  for (let key in row) {
    const cleanKey = key.trim().toLowerCase();
    newRow[cleanKey] = row[key];
  }
  return newRow;
}

function cleanPrice(priceStr) {
  if (priceStr === null || priceStr === undefined) return 0;
  const cleaned = String(priceStr).replace(/,/g, '').trim();
  const price = parseFloat(cleaned);
  if (isNaN(price)) {
    console.warn(`⚠️ Invalid price: ${priceStr}, defaulting to 0`);
    return 0;
  }
  return price;
}

function roundToNearestTens(price) {
  return Math.round(price / 10) * 10;
}

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateSKU(description) {
  const words = description
    .toUpperCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3);
  return words.join('-');
}

// CRITICAL FIX: Generate unique ID for _id and id fields
function generateUniqueId() {
  return new mongoose.Types.ObjectId().toString();
}

function mapToProduct(row, index) {
  const description = row.description?.trim();
  const rawPrice = cleanPrice(row.price);
  const roundedPrice = roundToNearestTens(rawPrice);
  const sku = generateSKU(description);
  const slug = generateSlug(description);
  
  // CRITICAL FIX: Generate _id and id
  const uniqueId = generateUniqueId();

  return {
    _id: uniqueId,           // Required by schema
    id: uniqueId,            // Required by schema (will be synced in pre-save)
    sku: `${sku}-${Date.now()}-${index}`,
    name: description,
    description,
    fullDescription: `Professional laboratory equipment: ${description}`,
    category: "Lab Equipment",
    categorySlug: "lab-equipment",
    subcategory: "General Lab Equipment",
    brand: "LINKCHEM",
    images: [],
    photos: [],
    price: roundedPrice,
    retailPrice: roundedPrice,
    wholesalePrice: Math.round(roundedPrice * 0.8),
    pricing: {
      retail: roundedPrice,
      wholesale: Math.round(roundedPrice * 0.8),
      special: Math.round(roundedPrice * 0.75)
    },
    originalPrice: roundedPrice,
    unit: "piece",
    minOrderQuantity: 1,
    costPrice: Math.round(roundedPrice * 0.65),
    supplier: null,
    suppliers: [],
    stock: 0,
    stockQuantity: 0,
    stockStatus: "out-of-stock",
    inStock: false,
    reorderPoint: 10,
    reorderLevel: 10,
    rating: 0,
    reviewCount: 0,
    reviews: [],
    specifications: {
      Type: description,
      Category: "Laboratory Equipment"
    },
    tags: ["laboratory", "equipment", slug.split('-')[0]],
    badge: "",
    downloads: [],
    priceHistory: [],
    isFeatured: false,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// -------------------- MAIN IMPORT --------------------
async function importExcelProducts() {
  try {
    await mongoose.connect(MONGODB_URI, {
      writeConcern: { w: 'majority', j: true },
      readPreference: 'primary'
    });
    
    console.log(`✅ Connected to MongoDB Atlas`);
    console.log(`   Database: ${mongoose.connection.name}`);

    const filePath = 'C:\\Users\\Administrator\\Downloads\\LINKCHEM LTD PRICE LIST 2026.xlsx';
    console.log('📖 Reading Excel file:', filePath);

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rawData = XLSX.utils.sheet_to_json(worksheet);
    const data = rawData.map(normalizeRow);

    console.log(`📊 Found ${data.length} products in Excel file`);

    const validProducts = data.filter((row) => {
      const description = row.description?.trim();
      const price = cleanPrice(row.price);
      return description && price > 0;
    });

    console.log(`✅ ${validProducts.length} valid products after filtering`);

    const products = validProducts.map((row, idx) => mapToProduct(row, idx));

    // Clear existing
    await Product.deleteMany({});
    console.log('🧹 Cleared existing products');

    // Test first product
    console.log('\n🔍 Testing first product...');
    try {
      const testDoc = new Product(products[0]);
      await testDoc.validate();
      console.log('✅ First product validation passed');
    } catch (err) {
      console.error('❌ Validation failed:', err.message);
      throw err;
    }

    // Insert in batches
    const BATCH_SIZE = 100;
    let inserted = 0;
    let errors = 0;

    for (let i = 0; i < products.length; i += BATCH_SIZE) {
      const batch = products.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(products.length / BATCH_SIZE);

      try {
        console.log(`📝 Inserting batch ${batchNum}/${totalBatches} (${batch.length} products)...`);
        
        const result = await Product.insertMany(batch, { 
          ordered: false,
          rawResult: true
        });
        
        inserted += result.insertedCount || batch.length;
        console.log(`✅ Batch ${batchNum} completed. Total: ${inserted}/${products.length}`);
        
      } catch (error) {
        console.error(`❌ Batch ${batchNum} error:`, error.message);
        
        // Retry individually
        for (const [idx, product] of batch.entries()) {
          try {
            await Product.create(product);
            inserted++;
          } catch (err) {
            console.error(`❌ Failed: ${product.name}`, err.message);
            errors++;
          }
        }
      }
    }

    // Verify
    const count = await Product.countDocuments();
    console.log(`\n📊 Import Summary:`);
    console.log(`   Total processed: ${products.length}`);
    console.log(`   Successfully inserted: ${inserted}`);
    console.log(`   Actual DB count: ${count}`);
    console.log(`   Failed: ${errors}`);

    const sample = await Product.find().limit(3).select('name price sku _id');
    console.log('\n📦 Sample products:');
    console.log(sample);

  } catch (err) {
    console.error('❌ Import failed:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

importExcelProducts();