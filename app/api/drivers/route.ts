import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/auth/api-auth';
import { db } from '@/lib/db';

// GET - List all drivers
export async function GET() {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const drivers = await db.driver.findMany({
      include: {
        user: {
          select: { email: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(drivers);
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 });
  }
}

// POST - Create new driver
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth();

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, fullName, phone, email, vehicleType, vehicleNumber, licenseNumber } = body;

    // Validate required fields
    if (!userId || !fullName || !phone || !email || !vehicleType || !vehicleNumber || !licenseNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if driver already exists for this user
    const existingDriver = await db.driver.findUnique({
      where: { userId },
    });

    if (existingDriver) {
      return NextResponse.json({ error: 'Driver already exists for this user' }, { status: 400 });
    }

    // Create driver
    const driver = await db.driver.create({
      data: {
        userId,
        fullName,
        phone,
        email,
        vehicleType,
        vehicleNumber,
        licenseNumber,
        isActive: true,
        isAvailable: true,
      },
    });

    console.log(`✅ Driver created: ${fullName} (${driver.id})`);

    return NextResponse.json(driver, { status: 201 });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 });
  }
}
