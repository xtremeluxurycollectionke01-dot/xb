import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Item from '@/models/Item';
import { withCORS } from '@/lib/cors/cors';

// GET single item
async function getItem(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid item ID',
        },
        { status: 400 }
      );
    }

    const item = await Item.findById(id).lean();

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
    console.error('Error fetching item:', error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to fetch item',
      },
      { status: 500 }
    );
  }
}

// DELETE single item
async function deleteItem(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;

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
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete item',
      },
      { status: 500 }
    );
  }
}

// PUT update single item
async function updateItem(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    const item = await Item.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
      }
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
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update item',
      },
      { status: 500 }
    );
  }
}

export const GET = withCORS(getItem);
export const PUT = withCORS(updateItem);
export const DELETE = withCORS(deleteItem);