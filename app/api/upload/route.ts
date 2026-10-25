import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { DetectedKind, MB, safeSegment, saveUpload, UploadError } from '@/lib/uploads';

/**
 * File upload API.
 *
 * Booking photos (type=requirement or material) can be sent without logging in, because
 * guests can book; they are images only and rate limited. Every other type needs a
 * logged-in user with the right role. The file's type comes from its bytes.
 */

type Role = string;

interface Target {
  folder: string[];
  allowed: DetectedKind[];
  maxBytes: number;
  private?: boolean;
  roles: Role[] | 'any' | 'public';
}

const IMAGES: DetectedKind[] = ['image'];
const MEDIA: DetectedKind[] = ['image', 'video'];
const RECEIPTS: DetectedKind[] = ['image', 'pdf'];
const STAFF = ['admin', 'tailor', 'technician', 'cashier', 'driver'];
const MENTORS = ['admin', 'tailor', 'technician'];

function maxFor(allowed: DetectedKind[]) {
  return allowed.includes('video') ? 50 * MB : allowed.includes('pdf') ? 10 * MB : 5 * MB;
}

async function resolveTarget(type: string | null, form: FormData, investorIdOf: () => Promise<string | null>): Promise<Target | string> {
  const bookingId = form.get('bookingId');
  const deliveryId = form.get('deliveryId');

  if (type && deliveryId) {
    if (!['photo', 'signature'].includes(type)) return 'Invalid delivery upload type. Must be: photo or signature';
    const id = safeSegment(deliveryId);
    if (!id) return 'Invalid deliveryId';
    return { folder: ['deliveries', id, type], allowed: IMAGES, maxBytes: 5 * MB, roles: ['admin', 'driver'] };
  }

  if (type && bookingId) {
    if (!['requirement', 'material', 'progress'].includes(type)) {
      return 'Invalid type. Must be: requirement, material, or progress';
    }
    const id = safeSegment(bookingId);
    if (!id || !(await db.serviceBooking.findUnique({ where: { id }, select: { id: true } }))) {
      return 'Booking not found';
    }
    const allowed = type === 'progress' ? MEDIA : IMAGES;
    return {
      folder: ['bookings', id, type],
      allowed,
      maxBytes: maxFor(allowed),
      roles: type === 'progress' ? STAFF : 'public',
    };
  }

  switch (type) {
    case 'requirement':
    case 'material':
      // Photos attached while a guest fills in a booking form, before the booking exists
      return { folder: ['intake', type], allowed: IMAGES, maxBytes: 5 * MB, roles: 'public' };
    case 'banner':
      return { folder: ['banners'], allowed: MEDIA, maxBytes: maxFor(MEDIA), roles: ['admin'] };
    case 'design-option':
      return { folder: ['design-options'], allowed: IMAGES, maxBytes: 5 * MB, roles: ['admin'] };
    case 'blog-image':
      return { folder: ['blog'], allowed: MEDIA, maxBytes: maxFor(MEDIA), roles: ['admin'] };
    case 'apprentice-photo':
      return { folder: ['apprentices'], allowed: IMAGES, maxBytes: 5 * MB, roles: ['admin'] };
    case 'feedback':
      return { folder: ['feedback'], allowed: MEDIA, maxBytes: maxFor(MEDIA), roles: 'any' };
    case 'repair-issue-photo':
      return { folder: ['repairs', 'issues'], allowed: IMAGES, maxBytes: 5 * MB, roles: 'any' };
    case 'comment': {
      const apprenticeId = safeSegment(form.get('apprenticeId'));
      if (!apprenticeId) return 'Missing apprenticeId for upload type';
      return {
        folder: ['apprentices', apprenticeId, 'comments'],
        allowed: IMAGES,
        maxBytes: 5 * MB,
        roles: [...MENTORS, 'apprentice'],
      };
    }
    case 'assignment':
    case 'submission': {
      if (type === 'assignment') {
        const apprenticeId = safeSegment(form.get('apprenticeId'));
        if (!apprenticeId) return 'Missing apprenticeId or assignmentId for upload type';
        return {
          folder: ['apprentices', apprenticeId, 'assignments'],
          allowed: MEDIA,
          maxBytes: maxFor(MEDIA),
          roles: MENTORS,
        };
      }
      // The submission form sends apprenticeId; older callers sent assignmentId
      const assignmentId = safeSegment(form.get('assignmentId'));
      const owner = assignmentId ? ['assignments', assignmentId] : null;
      const apprenticeId = safeSegment(form.get('apprenticeId'));
      const folder = owner ?? (apprenticeId ? ['apprentices', apprenticeId] : null);
      if (!folder) return 'Missing apprenticeId or assignmentId for upload type';
      return {
        folder: [...folder, 'submissions'],
        allowed: MEDIA,
        maxBytes: maxFor(MEDIA),
        roles: [...MENTORS, 'apprentice'],
      };
    }
    case 'document': {
      const apprenticeId = safeSegment(form.get('apprenticeId'));
      if (!apprenticeId) return 'Missing apprenticeId for upload type';
      return {
        folder: ['apprentices', apprenticeId, 'documents'],
        allowed: ['pdf', 'docx', 'image'],
        maxBytes: 10 * MB,
        roles: [...MENTORS, 'apprentice'],
      };
    }
    case 'technician-photo':
      return { folder: ['technicians'], allowed: IMAGES, maxBytes: 5 * MB, roles: ['admin'] };
    case 'investor-receipt': {
      const investorId = await investorIdOf();
      if (!investorId) return 'Investor profile not found';
      return {
        folder: ['receipts', investorId],
        allowed: RECEIPTS,
        maxBytes: 10 * MB,
        private: true,
        roles: ['investor'],
      };
    }
    case 'admin-withdrawal-receipt':
      return {
        folder: ['withdrawal-receipts'],
        allowed: RECEIPTS,
        maxBytes: 10 * MB,
        private: true,
        roles: ['admin'],
      };
    case null:
    case '':
    case 'product':
      // Product, category, service and staff photos from the admin dashboard
      return { folder: ['products'], allowed: MEDIA, maxBytes: maxFor(MEDIA), roles: ['admin'] };
    default:
      return `Unknown upload type: ${type}`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const user = await getSession();
    const type = (formData.get('type') as string | null) ?? null;
    const target = await resolveTarget(type, formData, async () => {
      if (!user) return null;
      const investor = await db.investor.findUnique({ where: { userId: user.id }, select: { id: true } });
      return investor?.id ?? null;
    });
    if (typeof target === 'string') {
      return NextResponse.json({ error: target }, { status: 400 });
    }

    if (target.roles === 'public') {
      const key = user ? `upload:user:${user.id}` : `upload:ip:${clientIp(request)}`;
      if (!rateLimit(key, user ? 60 : 20, 10 * 60 * 1000)) {
        return NextResponse.json({ error: 'Too many uploads. Please wait a few minutes.' }, { status: 429 });
      }
    } else {
      if (!user) {
        return NextResponse.json({ error: 'Please log in to upload files' }, { status: 401 });
      }
      if (target.roles !== 'any' && !target.roles.includes(user.role)) {
        return NextResponse.json({ error: 'You are not allowed to upload this kind of file' }, { status: 403 });
      }
      if (!rateLimit(`upload:user:${user.id}`, 120, 10 * 60 * 1000)) {
        return NextResponse.json({ error: 'Too many uploads. Please wait a few minutes.' }, { status: 429 });
      }
    }

    const saved = await saveUpload(file, target);
    return NextResponse.json({ success: true, ...saved }, { status: 201 });
  } catch (error) {
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
