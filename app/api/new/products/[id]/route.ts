import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongoose";
import Prroduct from "@/models/Prroduct";
import { errorResponse, successResponse } from "@/src/utils/response";


// GET SINGLE PRODUCT
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Prroduct.findById(id);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(product);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

// UPDATE PRODUCT
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const body = await req.json();

    const product = await Prroduct.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(product);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

// DELETE PRODUCT
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const product = await Prroduct.findByIdAndDelete(id);

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    return errorResponse(error.message);
  }
}