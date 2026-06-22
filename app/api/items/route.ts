// C:\Users\Administrator\Desktop\linkchemtwo\app\api\items\route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Item from '@/models/Item';
import { withCORS } from '@/lib/cors/cors';

// GET: Fetch all items with pagination
async function getItems(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Item.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Item.countDocuments({}),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch items',
      },
      { status: 500 }
    );
  }
}

// POST: Create a new item
async function createItem(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { name, description, images } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and description are required',
        },
        { status: 400 }
      );
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'At least one image is required',
        },
        { status: 400 }
      );
    }

    const item = await Item.create({
      name,
      description,
      images,
    });

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create item',
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete an item
async function deleteItem(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item ID is required',
        },
        { status: 400 }
      );
    }

    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete item',
      },
      { status: 500 }
    );
  }
}

// PUT: Update an item
async function updateItem(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item ID is required',
        },
        { status: 400 }
      );
    }

    const item = await Item.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update item',
      },
      { status: 500 }
    );
  }
}

// Route handlers with CORS
export const GET = withCORS(getItems);
export const POST = withCORS(createItem);
export const DELETE = withCORS(deleteItem);
export const PUT = withCORS(updateItem);