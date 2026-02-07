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
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
    let fileType = file.type;

    // If file.type is empty or generic, try to infer from filename
    if (!fileType || fileType === 'application/octet-stream') {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'jpg' || ext === 'jpeg') fileType = 'image/jpeg';
      else if (ext === 'png') fileType = 'image/png';
      else if (ext === 'gif') fileType = 'image/gif';
      else if (ext === 'webp') fileType = 'image/webp';
      else if (ext === 'mp4') fileType = 'video/mp4';
      else if (ext === 'webm') fileType = 'video/webm';
      else if (ext === 'mov') fileType = 'video/quicktime';
      console.log(`📝 Inferred file type from extension: ${fileType}`);
    }

    const isVideo = allowedVideoTypes.includes(fileType) || fileType.startsWith('video/');
    const isImage = allowedImageTypes.includes(fileType);

    if (!isImage && !isVideo) {
      console.error(`❌ Invalid file type: ${fileType}`);
      return NextResponse.json({
        error: `Invalid file type: ${fileType}. Only images (JPEG, PNG, WebP, GIF) and videos (MP4, WebM, MOV) are allowed`
      }, { status: 400 });
    }

    // Validate file size - 5MB for images, 50MB for videos
    const maxImageSize = 5 * 1024 * 1024;
    const maxVideoSize = 50 * 1024 * 1024;
    const maxSize = isVideo ? maxVideoSize : maxImageSize;

    if (file.size > maxSize) {
      console.error(`❌ File too large: ${file.size} bytes`);
      return NextResponse.json({
        error: `File too large. Maximum size is ${isVideo ? '50MB' : '5MB'}`
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
    } else if (type === 'banner') {
      // Banner upload: /public/uploads/banners/
      uploadsDir = join(process.cwd(), 'public', 'uploads', 'banners');
      url = `/api/uploads/banners/${filename}`;
    } else if (type === 'design-option') {
      // Design option image: /public/uploads/design-options/
      uploadsDir = join(process.cwd(), 'public', 'uploads', 'design-options');
      url = `/api/uploads/design-options/${filename}`;
    } else if (type === 'blog-image') {
      // Blog featured image: /public/uploads/blog/
      uploadsDir = join(process.cwd(), 'public', 'uploads', 'blog');
      url = `/api/uploads/blog/${filename}`;
    } else if (type === 'apprentice-photo') {
      // Apprentice profile photo: /public/uploads/apprentices/
      uploadsDir = join(process.cwd(), 'public', 'uploads', 'apprentices');
      url = `/api/uploads/apprentices/${filename}`;
    } else if (type === 'feedback') {
      // Feedback attachments: /public/uploads/feedback/
      uploadsDir = join(process.cwd(), 'public', 'uploads', 'feedback');
      url = `/api/uploads/feedback/${filename}`;
    } else if (type === 'assignment' || type === 'submission') {
      // Assignment/submission photos
      const apprenticeId = formData.get('apprenticeId') as string | null;
      const assignmentId = formData.get('assignmentId') as string | null;

      if (type === 'assignment' && apprenticeId) {
        // Assignment instruction photos
        uploadsDir = join(process.cwd(), 'public', 'uploads', 'apprentices', apprenticeId, 'assignments');
        url = `/api/uploads/apprentices/${apprenticeId}/assignments/${filename}`;
      } else if (type === 'submission' && assignmentId) {
        // Submission photos for completed work
        uploadsDir = join(process.cwd(), 'public', 'uploads', 'assignments', assignmentId, 'submissions');
        url = `/api/uploads/assignments/${assignmentId}/submissions/${filename}`;
      } else {
        return NextResponse.json({
          error: 'Missing apprenticeId or assignmentId for upload type'
        }, { status: 400 });
      }
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
