'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Download } from 'lucide-react';

export default function ReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const reports = [
    {
      category: 'Herd & Animal Reports',
      items: [
        'Goat Master List',
        'Breed-wise Goat Population',
        'Gender Distribution Report',
        'Age Group Distribution',
        'Mortality Report',
        'Birth & Death Register',
        'Herd Growth Trend',
        'Weight Gain Report',
      ],
    },
    {
      category: 'Breeding & Reproduction Reports',
      items: [
        'Breeding Performance Report',
        'Kidding Outcome Report',
        'Fertility Index Report',
        'Service Record Report',
        'Pregnancy Diagnosis Report',
        'Buck Performance Report',
      ],
    },
    {
      category: 'Feed & Nutrition Reports',
      items: [
        'Feed Consumption Summary',
        'Feed Cost Analysis',
        'Feed Conversion Ratio (FCR)',
        'Feed Inventory Report',
        'Feed Purchase Ledger',
      ],
    },
    {
      category: 'Health & Medical Reports',
      items: [
        'Vaccination Schedule Report',
        'Disease Incident Report',
        'Deworming Record',
        'Mortality Analysis',
        'Veterinary Expense Report',
      ],
    },
    {
      category: 'Financial Reports',
      items: [
        'Income & Expense Summary',
        'Profit & Loss Statement',
        'Monthly Cash Flow',
        'Sales Revenue Report',
        'Expense by Category',
        'ROI Analysis',
      ],
    },
    {
      category: 'Sales & Marketing Reports',
      items: [
        'Sales Transaction Report',
        'Customer Purchase History',
        'Revenue by Product',
        'Sales Performance Trend',
      ],
    },
    {
      category: 'Inventory Reports',
      items: [
        'Stock Level Report',
        'Low Stock Alert',
        'Inventory Purchase Report',
        'Feed & Medicine Usage',
      ],
    },
  ];

  const handleGenerateReport = (reportName: string) => {
    setLoading(true);
    // Simulate report generation
    setTimeout(() => {
      alert(`Generating ${reportName}... This feature will be fully implemented soon!`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-3">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 pb-3">
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
            <Link href="/dashboard/reports" className="text-green-600 font-medium border-b-2 border-green-600 pb-3">
              Reports
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">Generate comprehensive reports for all aspects of your farm</p>
        </div>

        <div className="space-y-6">
          {reports.map((category, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  {category.category}
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((report, reportIdx) => (
                    <button
                      key={reportIdx}
                      onClick={() => handleGenerateReport(report)}
                      disabled={loading}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-left disabled:opacity-50"
                    >
                      <span className="text-sm font-medium text-gray-700">{report}</span>
                      <Download className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Export Options</h3>
          <p className="text-sm text-blue-800 mb-4">
            All reports can be exported in the following formats:
          </p>
          <div className="flex gap-4">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
              📄 PDF
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
              📊 Excel
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
              📋 CSV
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
