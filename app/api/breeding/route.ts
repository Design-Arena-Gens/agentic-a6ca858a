import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const records = await prisma.breedingRecord.findMany({
      include: {
        maleGoat: { select: { tagNo: true, name: true, breed: true } },
        femaleGoat: { select: { tagNo: true, name: true, breed: true } },
      },
      orderBy: { breedingDate: 'desc' },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Get breeding records error:', error);
    return NextResponse.json({ error: 'Failed to fetch breeding records' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Generate reference number
    const count = await prisma.breedingRecord.count();
    const referenceNo = `BR-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const record = await prisma.breedingRecord.create({
      data: {
        ...body,
        referenceNo,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Create breeding record error:', error);
    return NextResponse.json({ error: 'Failed to create breeding record' }, { status: 500 });
  }
}
