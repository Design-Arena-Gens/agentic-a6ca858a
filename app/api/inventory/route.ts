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
    const category = searchParams.get('category');

    const where: any = {};
    if (category) where.category = category;

    const items = await prisma.inventory.findMany({
      where,
      orderBy: { itemName: 'asc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Get inventory error:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const item = await prisma.inventory.create({
      data: {
        ...body,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Create inventory item error:', error);
    return NextResponse.json({ error: 'Failed to create inventory item' }, { status: 500 });
  }
}
