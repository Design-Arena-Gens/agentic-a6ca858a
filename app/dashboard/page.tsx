'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  Heart,
  ShoppingCart,
  DollarSign,
  Package,
  Activity,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface DashboardData {
  statistics: {
    totalGoats: number;
    totalMales: number;
    totalFemales: number;
  };
  breedDistribution: Array<{ breed: string; _count: number }>;
  recentBreeding: any[];
  upcomingKidding: any[];
  healthDue: any[];
  financial: {
    monthlyExpenses: number;
    monthlySales: number;
    expenseByCategory: any[];
  };
  lowStockItems: any[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const profit = data.financial.monthlySales - data.financial.monthlyExpenses;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🐐 Goat Farm Management</h1>
              <p className="text-sm text-gray-600">Dharmendra Kumar - Sitamarhi, Bihar</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">Welcome, {session?.user?.name}</span>
              <button
                onClick={() => router.push('/api/auth/signout')}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-3">
            <Link href="/dashboard" className="text-green-600 font-medium border-b-2 border-green-600 pb-3">
              Dashboard
            </Link>
            <Link href="/dashboard/goats" className="text-gray-600 hover:text-gray-900 pb-3">
              Herd Management
            </Link>
            <Link href="/dashboard/breeding" className="text-gray-600 hover:text-gray-900 pb-3">
              Breeding
            </Link>
            <Link href="/dashboard/health" className="text-gray-600 hover:text-gray-900 pb-3">
              Health
            </Link>
            <Link href="/dashboard/sales" className="text-gray-600 hover:text-gray-900 pb-3">
              Sales
            </Link>
            <Link href="/dashboard/expenses" className="text-gray-600 hover:text-gray-900 pb-3">
              Expenses
            </Link>
            <Link href="/dashboard/inventory" className="text-gray-600 hover:text-gray-900 pb-3">
              Inventory
            </Link>
            <Link href="/dashboard/reports" className="text-gray-600 hover:text-gray-900 pb-3">
              Reports
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Goats</p>
                <p className="text-3xl font-bold text-gray-900">{data.statistics.totalGoats}</p>
              </div>
              <Users className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Males / Females</p>
                <p className="text-3xl font-bold text-gray-900">
                  {data.statistics.totalMales} / {data.statistics.totalFemales}
                </p>
              </div>
              <Activity className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Sales</p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{data.financial.monthlySales.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Profit</p>
                <p className={`text-3xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{profit.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Breed Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Breed Distribution</h2>
            <div className="space-y-3">
              {data.breedDistribution.map((item) => (
                <div key={item.breed} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.breed}</span>
                  <span className="font-semibold text-gray-900">{item._count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Kidding */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Kidding (Next 30 Days)
            </h2>
            {data.upcomingKidding.length > 0 ? (
              <div className="space-y-2">
                {data.upcomingKidding.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{record.femaleGoat.tagNo}</span>
                    <span className="text-gray-500">
                      {new Date(record.expectedKidDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No upcoming kidding scheduled</p>
            )}
          </div>
        </div>

        {/* Alerts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Health Due */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Health Records Due (Next 7 Days)
            </h2>
            {data.healthDue.length > 0 ? (
              <div className="space-y-2">
                {data.healthDue.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{record.goat.tagNo} - {record.recordType}</span>
                    <span className="text-gray-500">
                      {new Date(record.nextDueDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No health records due</p>
            )}
          </div>

          {/* Low Stock Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Low Stock Alert
            </h2>
            {data.lowStockItems.length > 0 ? (
              <div className="space-y-2">
                {data.lowStockItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{item.itemName}</span>
                    <span className="text-orange-600 font-medium">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">All inventory items are adequately stocked</p>
            )}
          </div>
        </div>

        {/* Recent Breeding Records */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Breeding Records</h2>
          {data.recentBreeding.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ref No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Male</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Female</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.recentBreeding.map((record) => (
                    <tr key={record.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.referenceNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.maleGoat.tagNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.femaleGoat.tagNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.breedingDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.breedingMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No breeding records yet</p>
          )}
        </div>
      </main>
    </div>
  );
}
