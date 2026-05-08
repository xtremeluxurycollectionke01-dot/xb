import dbConnect from "@/lib/db/mongoose";
import Prroduct from "@/models/Prroduct";
import { errorResponse, successResponse } from "@/src/utils/response";


// GET SINGLE PRODUCT
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Prroduct.findById(params.id);

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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const body = await req.json();

    const product = await Prroduct.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
      }
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const product = await Prroduct.findByIdAndDelete(params.id);

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