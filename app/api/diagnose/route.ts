import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const results: any = {};

    // 1. Get all folders recursively
    console.log('Getting all folders...');
    const allFolders: any[] = [];
    
    async function getFolders(path = '') {
      const result = await cloudinary.api.sub_folders(path);
      for (const folder of result.folders || []) {
        allFolders.push({ 
          name: folder.name, 
          path: folder.path,
          fullPath: path + folder.name + '/'
        });
        await getFolders(folder.path);
      }
    }
    await getFolders('');
    results.allFolders = allFolders;

    // 2. Check specific paths
    const pathsToCheck = [
      'home/linkchem/products',
      'linkchem/products',
      'home/linkchem',
      'linkchem',
      'products',
      'home',
      'home/linkchem/products/',
      '/home/linkchem/products',
      'linkchem/products/',
    ];

    results.pathChecks = {};
    for (const path of pathsToCheck) {
      try {
        const result = await cloudinary.api.resources({
          type: 'upload',
          prefix: path,
          max_results: 10,
        });
        results.pathChecks[path] = {
          count: result.resources?.length || 0,
          sample: result.resources?.slice(0, 3).map((r: any) => ({
            public_id: r.public_id,
            url: r.secure_url,
          })),
        };
      } catch (e) {
        results.pathChecks[path] = {
          error: e instanceof Error ? e.message : 'Unknown error',
        };
      }
    }

    // 3. Get all images with their full paths
    const allImages = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
    });
    
    results.allImagePaths = (allImages.resources || []).map((r: any) => ({
      public_id: r.public_id,
      path: r.public_id.split('/'),
      url: r.secure_url,
    }));

    return NextResponse.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Diagnostic error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}