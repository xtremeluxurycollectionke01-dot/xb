import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Fetch images from Cloudinary with pagination
    const result = await cloudinary.api.resources({
      type: 'upload',
      max_results: limit,
      next_cursor: page === 1 ? undefined : searchParams.get('cursor') || undefined,
    });

    const images = (result.resources || []).map((resource: any) => ({
      id: resource.public_id,
      url: resource.secure_url,
      // Optimized URL with Cloudinary transformations
      optimizedUrl: resource.secure_url.replace(
        '/upload/',
        '/upload/w_400,h_400,c_fill,q_auto,f_auto/'
      ),
      filename: resource.public_id.split('/').pop() || resource.public_id,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      size: resource.bytes,
      createdAt: resource.created_at,
    }));

    // Get total count (approximate for now)
    const totalResult = await cloudinary.api.resources({
      type: 'upload',
      max_results: 1,
    });
    const total = totalResult.total_count || images.length;

    return NextResponse.json({
      success: true,
      images,
      pagination: {
        page,
        limit,
        total,
        hasMore: images.length === limit,
        nextCursor: result.next_cursor || null,
      },
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch images',
        images: [],
        pagination: {
          page: 1,
          limit: 24,
          total: 0,
          hasMore: false,
          nextCursor: null,
        },
      },
      { status: 500 }
    );
  }
}