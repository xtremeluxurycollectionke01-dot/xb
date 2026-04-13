// app/api/products/[id]/restock/route.ts
/*import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { PricingTier, Product, StockStatus } from '@/models/Products';
import dbConnect from '@/lib/db/mongoose';

const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://localhost:3000'
];

function getCorsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    await dbConnect();
    
    //const { id } = params;
    const { id } = await context.params;
    const body = await request.json();
    const { quantity, supplier, notes } = body;
    // Validate
    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be a positive number' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    //const product = await Product.findById(id);
    const product = await Product.findOne({ id: id });

    if (!product) {
    return new Response(JSON.stringify({ error: "Product not found" }), { status: 404 });
    }
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Update stock
    const oldStock = product.stockQuantity;
    product.stockQuantity += quantity;
    product.stock = product.stockQuantity;
    
    // Update status
    const threshold = product.reorderLevel || product.reorderPoint || 0;
    if (product.stockQuantity === 0) {
      product.stockStatus = StockStatus.OUT_OF_STOCK;
      product.inStock = false;
    } else if (product.stockQuantity <= threshold) {
      product.stockStatus = StockStatus.LOW_STOCK;
      product.inStock = true;
    } else {
      product.stockStatus = StockStatus.IN_STOCK;
      product.inStock = true;
    }
    
    // Add to price history as a stock change record
    product.priceHistory.push({
      _id: new mongoose.Types.ObjectId().toString(),
      oldPrice: product.price,
      newPrice: product.price,
      //tier: product.pricing?.retail ? 'retail' : 'special',
      tier: product.pricing?.retail 
      ? PricingTier.RETAIL 
      : PricingTier.SPECIAL,
      changedBy: 'system',
      changedAt: new Date(),
      reason: `Restocked: +${quantity} units (Old: ${oldStock}, New: ${product.stockQuantity})`
    });
    
    await product.save();
    
    return NextResponse.json({
      success: true,
      data: {
        id: product._id,
        name: product.name,
        sku: product.sku,
        oldStock,
        newStock: product.stockQuantity,
        added: quantity,
        status: product.stockStatus
      },
      message: `Successfully added ${quantity} units to ${product.name}`
    }, { status: 200, headers: corsHeaders });
    
  } catch (error) {
    console.error('Restock error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to restock product' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}*/

// app/api/products/[id]/restock/route.ts
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

import { PricingTier, Product, StockStatus } from '@/models/Products';
import dbConnect from '@/lib/db/mongoose';

const ALLOWED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://localhost:3000'
];

function getCorsHeaders(origin: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) 
    ? origin 
    : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  };
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  try {
    await dbConnect();
    
    const { id } = await context.params;
    const body = await request.json();
    const { quantity, supplier, notes } = body;

    // Validate
    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be a positive number' },
        { status: 400, headers: corsHeaders }
      );
    }
    
    // Find product by custom id field (not _id)
    const product = await Product.findOne({ id: id });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404, headers: corsHeaders }
      );
    }
    
    // Calculate new stock values
    const oldStock = product.stockQuantity;
    const newStock = oldStock + quantity;
    
    // Determine new status
    const threshold = product.reorderLevel || product.reorderPoint || 0;
    let newStatus: StockStatus;
    let newInStock: boolean;
    
    if (newStock === 0) {
      newStatus = StockStatus.OUT_OF_STOCK;
      newInStock = false;
    } else if (newStock <= threshold) {
      newStatus = StockStatus.LOW_STOCK;
      newInStock = true;
    } else {
      newStatus = StockStatus.IN_STOCK;
      newInStock = true;
    }

    // Create stock history entry
    const stockHistoryEntry = {
      _id: new mongoose.Types.ObjectId().toString(),
      quantity: quantity,
      type: 'restock' as const,
      oldQuantity: oldStock,
      newQuantity: newStock,
      supplier: supplier || product.supplier || 'system',
      notes: notes || `Restocked: +${quantity} units`,
      reference: `RESTOCK-${Date.now()}`,
      adjustedBy: 'system',
      timestamp: new Date()
    };

    // Create price history entry (for audit trail)
    const priceHistoryEntry = {
      _id: new mongoose.Types.ObjectId().toString(),
      oldPrice: product.price,
      newPrice: product.price,
      tier: product.pricing?.retail ? PricingTier.RETAIL : PricingTier.SPECIAL,
      changedBy: 'system',
      changedAt: new Date(),
      reason: `Restocked: +${quantity} units (Old: ${oldStock}, New: ${newStock})`
    };

    // Use findOneAndUpdate to avoid VersionError - atomic update
    const updatedProduct = await Product.findOneAndUpdate(
      { id: id },
      {
        $set: {
          stockQuantity: newStock,
          stock: newStock,
          stockStatus: newStatus,
          inStock: newInStock,
          updatedAt: new Date()
        },
        $push: {
          stockHistory: stockHistoryEntry,
          priceHistory: priceHistoryEntry
        }
      },
      { 
        new: true,  // Return updated document
        runValidators: true 
      }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product update failed - document may have been modified' },
        { status: 409, headers: corsHeaders }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: updatedProduct._id,
        name: updatedProduct.name,
        sku: updatedProduct.sku,
        oldStock,
        newStock: updatedProduct.stockQuantity,
        added: quantity,
        status: updatedProduct.stockStatus
      },
      message: `Successfully added ${quantity} units to ${updatedProduct.name}`
    }, { status: 200, headers: corsHeaders });
    
  } catch (error: any) {
    console.error('Restock error:', error);
    
    // Handle specific Mongoose errors
    if (error.name === 'VersionError') {
      return NextResponse.json(
        { success: false, error: 'Product was modified by another process. Please retry.' },
        { status: 409, headers: corsHeaders }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to restock product' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);
  
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}