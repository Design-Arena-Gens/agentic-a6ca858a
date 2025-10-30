import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const goat = await prisma.goat.findUnique({
      where: { id },
      include: {
        sire: true,
        dam: true,
        offspring: true,
        healthRecords: { orderBy: { date: 'desc' } },
        weightRecords: { orderBy: { date: 'desc' } },
        breedingAsMale: { include: { femaleGoat: true } },
        breedingAsFemale: { include: { maleGoat: true } },
      },
    });

    if (!goat) {
      return NextResponse.json({ error: 'Goat not found' }, { status: 404 });
    }

    return NextResponse.json(goat);
  } catch (error) {
    console.error('Get goat error:', error);
    return NextResponse.json({ error: 'Failed to fetch goat' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const goat = await prisma.goat.update({
      where: { id },
      data: {
        ...body,
        updatedBy: session.user.id,
      },
    });

    return NextResponse.json(goat);
  } catch (error) {
    console.error('Update goat error:', error);
    return NextResponse.json({ error: 'Failed to update goat' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role === 'VIEWER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.goat.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Goat deleted successfully' });
  } catch (error) {
    console.error('Delete goat error:', error);
    return NextResponse.json({ error: 'Failed to delete goat' }, { status: 500 });
  }
}
