import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get statistics
    const totalGoats = await prisma.goat.count({ where: { status: 'Active' } });
    const totalMales = await prisma.goat.count({ where: { status: 'Active', gender: 'Male' } });
    const totalFemales = await prisma.goat.count({ where: { status: 'Active', gender: 'Female' } });

    // Get breed distribution
    const breedDistribution = await prisma.goat.groupBy({
      by: ['breed'],
      where: { status: 'Active' },
      _count: true,
    });

    // Get recent breeding records
    const recentBreeding = await prisma.breedingRecord.findMany({
      take: 5,
      include: {
        maleGoat: { select: { tagNo: true, name: true } },
        femaleGoat: { select: { tagNo: true, name: true } },
      },
      orderBy: { breedingDate: 'desc' },
    });

    // Get upcoming kidding
    const upcomingKidding = await prisma.breedingRecord.findMany({
      where: {
        expectedKidDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Next 30 days
        },
        actualKidDate: null,
      },
      include: {
        femaleGoat: { select: { tagNo: true, name: true } },
      },
      orderBy: { expectedKidDate: 'asc' },
    });

    // Get health records due
    const healthDue = await prisma.healthRecord.findMany({
      where: {
        nextDueDate: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
        },
      },
      include: {
        goat: { select: { tagNo: true, name: true } },
      },
      orderBy: { nextDueDate: 'asc' },
    });

    // Get financial summary (current month)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const monthlyExpenses = await prisma.expense.aggregate({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { amount: true },
    });

    const monthlySales = await prisma.salesRecord.aggregate({
      where: {
        saleDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { salePrice: true },
    });

    // Get expense breakdown by category
    const expenseByCategory = await prisma.expense.groupBy({
      by: ['category'],
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { amount: true },
    });

    // Get low stock items
    const lowStockItems = await prisma.inventory.findMany({
      where: {
        quantity: {
          lte: prisma.inventory.fields.minStock,
        },
      },
      orderBy: { quantity: 'asc' },
    });

    return NextResponse.json({
      statistics: {
        totalGoats,
        totalMales,
        totalFemales,
      },
      breedDistribution,
      recentBreeding,
      upcomingKidding,
      healthDue,
      financial: {
        monthlyExpenses: monthlyExpenses._sum.amount || 0,
        monthlySales: monthlySales._sum.salePrice || 0,
        expenseByCategory,
      },
      lowStockItems,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
