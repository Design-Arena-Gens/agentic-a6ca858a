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

    const records = await prisma.salesRecord.findMany({
      include: {
        goat: { select: { tagNo: true, name: true, breed: true } },
      },
      orderBy: { saleDate: 'desc' },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Get sales records error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales records' }, { status: 500 });
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
    const count = await prisma.salesRecord.count();
    const referenceNo = `SR-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Update goat status to Sold
    await prisma.goat.update({
      where: { id: body.goatId },
      data: { status: 'Sold' },
    });

    const record = await prisma.salesRecord.create({
      data: {
        ...body,
        referenceNo,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error('Create sales record error:', error);
    return NextResponse.json({ error: 'Failed to create sales record' }, { status: 500 });
  }
}
