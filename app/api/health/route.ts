import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const goatId = searchParams.get('goatId');
    const recordType = searchParams.get('recordType');

    const where: any = {};
    if (goatId) where.goatId = goatId;
    if (recordType) where.recordType = recordType;

    const records = await prisma.healthRecord.findMany({
      where,
      include: {
        goat: { select: { tagNo: true, name: true } },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Get health records error:', error);
    return NextResponse.json({ error: 'Failed to fetch health records' }, { status: 500 });
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
    const count = await prisma.healthRecord.count();
    const referenceNo = `HR-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const record = await prisma.healthRecord.create({
      data: {
        ...body,
        referenceNo,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Create health record error:', error);
    return NextResponse.json({ error: 'Failed to create health record' }, { status: 500 });
  }
}
