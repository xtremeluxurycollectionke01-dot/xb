import dbConnect from "@/lib/db/mongoose";
import Prroduct from "@/models/Prroduct";
import { errorResponse, successResponse } from "@/src/utils/response";


// CREATE PRODUCT
export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();

    const product = await Prroduct.create(body);

    return successResponse(product, 201);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}

// GET ALL PRODUCTS
export async function GET() {
  try {
    await dbConnect();

    const products = await Prroduct.find().sort({
      createdAt: -1,
    });

    return successResponse(products);
  } catch (error: any) {
    return errorResponse(error.message);
  }
}