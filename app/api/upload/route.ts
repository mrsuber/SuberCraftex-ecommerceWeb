import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

/**
 * File upload API for products and service bookings
 *
 * For products: /api/upload
 * For bookings: /api/upload?type=requirement&bookingId=xxx
 *
 * Supported types: requirement, material, progress (for bookings)
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    console.log('📤 Upload request received');
    console.log('File object:', file ? {
      name: file.name,
      type: file.type,
      size: file.size,
    } : 'null');

    if (!file) {
      console.error('❌ No file in formData');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type - be more lenient with type detection
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    let fileType = file.type;

    // If file.type is empty or generic, try to infer from filename
    if (!fileType || fileType === 'application/octet-stream') {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'jpg' || ext === 'jpeg') fileType = 'image/jpeg';
      else if (ext === 'png') fileType = 'image/png';
      else if (ext === 'gif') fileType = 'image/gif';
      else if (ext === 'webp') fileType = 'image/webp';
      console.log(`📝 Inferred file type from extension: ${fileType}`);
    }

    if (!allowedTypes.includes(fileType)) {
      console.error(`❌ Invalid file type: ${fileType}`);
      return NextResponse.json({
        error: `Invalid file type: ${fileType}. Only JPEG, PNG, WebP, and GIF images are allowed`
      }, { status: 400 });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      console.error(`❌ File too large: ${file.size} bytes`);
      return NextResponse.json({
        error: 'File too large. Maximum size is 5MB'
      }, { status: 400 });
    }

    // Get optional parameters for booking uploads
    const type = formData.get('type') as string | null;
    const bookingId = formData.get('bookingId') as string | null;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = crypto.randomUUID();
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${randomId}.${ext}`;

    let uploadsDir: string;
    let url: string;

    // Get delivery-specific parameters
    const deliveryId = formData.get('deliveryId') as string | null;

    // Determine upload path based on type
    // Note: We use /api/uploads/ path to serve files dynamically since
    // Next.js doesn't serve files added to public/ after build time
    if (type && deliveryId) {
      // Delivery-specific upload: /public/uploads/deliveries/{deliveryId}/{type}/
      if (!['photo', 'signature'].includes(type)) {
        return NextResponse.json({
          error: 'Invalid delivery upload type. Must be: photo or signature'
        }, { status: 400 });
      }

      uploadsDir = join(
        process.cwd(),
        'public',
        'uploads',
        'deliveries',
        deliveryId,
        type
      );
      url = `/api/uploads/deliveries/${deliveryId}/${type}/${filename}`;
    } else if (type && bookingId) {
      // Booking-specific upload: /public/uploads/bookings/{bookingId}/{type}/
      if (!['requirement', 'material', 'progress'].includes(type)) {
        return NextResponse.json({
          error: 'Invalid type. Must be: requirement, material, or progress'
        }, { status: 400 });
      }

      uploadsDir = join(
        process.cwd(),
        'public',
        'uploads',
        'bookings',
        bookingId,
        type
      );
      url = `/api/uploads/bookings/${bookingId}/${type}/${filename}`;
    } else {
      // Product upload: /public/uploads/products/
      uploadsDir = join(process.cwd(), 'public', 'uploads', 'products');
      url = `/api/uploads/products/${filename}`;
    }

    // Create uploads directory if it doesn't exist
    await mkdir(uploadsDir, { recursive: true });

    // Save file
    const filepath = join(uploadsDir, filename);
    await writeFile(filepath, buffer);

    console.log(`✅ Image uploaded: ${url}`);

    return NextResponse.json({
      success: true,
      url,
      filename,
      size: file.size,
      type: file.type,
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      error: 'Failed to upload file'
    }, { status: 500 });
  }
}
