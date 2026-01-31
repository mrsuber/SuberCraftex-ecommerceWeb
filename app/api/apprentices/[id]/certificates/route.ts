import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin, requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createCertificateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  skills: z.array(z.string()).optional().default([]),
});

// Helper to generate certificate number
async function generateCertificateNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.apprenticeCertificate.count();
  return `CERT-${year}-${String(count + 1).padStart(3, '0')}`;
}

// GET - Get apprentice's certificates
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiAuth();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if apprentice exists
    const apprentice = await db.apprentice.findUnique({
      where: { id },
      select: { id: true, userId: true, mentorId: true },
    });

    if (!apprentice) {
      return NextResponse.json({ error: 'Apprentice not found' }, { status: 404 });
    }

    // Non-admins can only view their own certificates or their mentees' certificates
    if (user.role !== 'admin') {
      if (apprentice.userId !== user.id && apprentice.mentorId !== user.id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }
    }

    const certificates = await db.apprenticeCertificate.findMany({
      where: { apprenticeId: id },
      orderBy: { issuedDate: 'desc' },
    });

    // Get issuer info for each certificate
    const certificatesWithIssuers = await Promise.all(
      certificates.map(async (cert) => {
        const issuedByUser = await db.user.findUnique({
          where: { id: cert.issuedBy },
          select: { id: true, fullName: true, email: true },
        });
        return { ...cert, issuedByUser };
      })
    );

    return NextResponse.json(certificatesWithIssuers);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 });
  }
}

// POST - Issue certificate
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireApiAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 });
    }

    const { id } = await params;

    // Check if apprentice exists
    const apprentice = await db.apprentice.findUnique({
      where: { id },
      select: { id: true, fullName: true, status: true },
    });

    if (!apprentice) {
      return NextResponse.json({ error: 'Apprentice not found' }, { status: 404 });
    }

    const body = await request.json();
    const data = createCertificateSchema.parse(body);

    // Generate certificate number
    const certificateNumber = await generateCertificateNumber();

    const certificate = await db.apprenticeCertificate.create({
      data: {
        apprenticeId: id,
        certificateNumber,
        title: data.title,
        description: data.description,
        skills: data.skills,
        issuedBy: admin.id,
      },
    });

    console.log(`Issued certificate ${certificateNumber} to apprentice ${apprentice.fullName}`);

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error issuing certificate:', error);
    return NextResponse.json({ error: 'Failed to issue certificate' }, { status: 500 });
  }
}
