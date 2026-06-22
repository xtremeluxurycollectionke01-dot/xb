// app/api/products/upload-image/route.ts
/*import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;
        
        if (!file) {
            return NextResponse.json(
                { success: false, error: { message: 'No image file provided' } },
                { status: 400 }
            );
        }
        
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'linkchem/products',
                allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                transformation: [
                    { width: 800, height: 800, crop: 'limit', quality: 'auto' }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result as UploadApiResponse);
            }
        );

        uploadStream.end(buffer);
    });
        
        return NextResponse.json({
            success: true,
            data: {
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                size: result.bytes
            }
        });
        
    } catch (error) {
        console.error('Image upload error:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: { 
                    message: error instanceof Error ? error.message : 'Upload failed' 
                } 
            },
            { status: 500 }
        );
    }
}*/

// app/api/products/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { withCORS } from '@/lib/cors/cors';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Core handler
async function uploadHandler(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: { message: 'No image file provided' } },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'linkchem/items',
                    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
                    transformation: [
                        { width: 800, height: 800, crop: 'limit', quality: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(error || new Error('Upload failed'));
                    }
                    resolve(result);
                }
            );

            uploadStream.end(buffer);
        });

        return NextResponse.json({
            success: true,
            data: {
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                size: result.bytes
            }
        });

    } catch (error) {
        console.error('Image upload error:', error);

        return NextResponse.json(
            {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : 'Upload failed'
                }
            },
            { status: 500 }
        );
    }
}

/**
 * IMPORTANT: Use route-level CORS (same pattern as working APIs)
 */
export const POST = withCORS(uploadHandler, 'http://127.0.0.1:5500');

/**
 * Optional but recommended for preflight safety
 */
export const OPTIONS = withCORS(
    async () => new NextResponse(null, { status: 204 }),
    'http://127.0.0.1:5500'
);