import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { locateUpload, MIME_BY_EXT, readUpload } from '@/lib/uploads';

type SessionUser = NonNullable<Awaited<ReturnType<typeof getSession>>>;

/** May this user see a private file? Admins always; otherwise only the file's owner. */
async function canRead(user: SessionUser, parts: string[], url: string): Promise<boolean> {
  if (user.role === 'admin') return true;
  const [folder, ownerId] = parts;
  if (folder === 'kyc' || folder === 'receipts') {
    const investor = await db.investor.findUnique({ where: { userId: user.id }, select: { id: true } });
    return investor?.id === ownerId;
  }
  if (folder === 'withdrawal-receipts') {
    const match = await db.withdrawalRequest.findFirst({
      where: { adminReceiptUrl: url, investor: { userId: user.id } },
      select: { id: true },
    });
    return !!match;
  }
  if (folder === 'purchase-receipts') {
    const match = await db.stockPurchase.findFirst({
      where: { receiptUrls: { has: url }, fundings: { some: { investorId: (await db.investor.findUnique({ where: { userId: user.id }, select: { id: true } }))?.id ?? '-' } } },
      select: { id: true },
    });
    return !!match;
  }
  if (folder === 'free-periods') {
    const match = await db.freePeriodRequest.findFirst({
      where: { attachments: { has: url }, apprentice: { userId: user.id } },
      select: { id: true },
    });
    return !!match;
  }
  return false;
}

// Serve uploaded files. Next.js doesn't serve files added to public/ after build time,
// and private files (KYC, receipts) live outside public/ altogether.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const found = await locateUpload(path);
    if (!found) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    if (found.isPrivate) {
      const user = await getSession();
      const url = `/api/uploads/${path.join('/')}`;
      if (!user || !(await canRead(user, path, url))) {
        // Same answer as a missing file, so private file names cannot be probed
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
      }
    }

    const file = await readUpload(found.path);
    const ext = path[path.length - 1].split('.').pop()?.toLowerCase() || '';
    const contentType = MIME_BY_EXT[ext] || 'application/octet-stream';

    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': contentType,
        'X-Content-Type-Options': 'nosniff',
        // Old uploads could carry any extension; never let one run as a page
        'Content-Security-Policy': "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'",
        'Cache-Control': found.isPrivate ? 'private, no-store' : 'public, max-age=31536000, immutable',
        ...(contentType === 'application/octet-stream' ? { 'Content-Disposition': 'attachment' } : {}),
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
