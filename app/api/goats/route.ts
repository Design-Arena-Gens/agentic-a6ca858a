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
    const status = searchParams.get('status');
    const breed = searchParams.get('breed');
    const gender = searchParams.get('gender');

    const where: any = {};
    if (status) where.status = status;
    if (breed) where.breed = breed;
    if (gender) where.gender = gender;

    const goats = await prisma.goat.findMany({
      where,
      include: {
        sire: { select: { tagNo: true, name: true } },
        dam: { select: { tagNo: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(goats);
  } catch (error) {
    console.error('Get goats error:', error);
    return NextResponse.json({ error: 'Failed to fetch goats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const goat = await prisma.goat.create({
      data: {
        ...body,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(goat);
  } catch (error) {
    console.error('Create goat error:', error);
    return NextResponse.json({ error: 'Failed to create goat' }, { status: 500 });
  }
}
