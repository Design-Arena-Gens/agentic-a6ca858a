'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Goat {
  id: string;
  tagNo: string;
  name: string | null;
  breed: string;
  gender: string;
  dateOfBirth: string;
  status: string;
  weight: number | null;
  purpose: string;
}

export default function GoatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [goats, setGoats] = useState<Goat[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', breed: '', gender: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    tagNo: '',
    name: '',
    breed: 'Barbari',
    gender: 'Female',
    dateOfBirth: '',
    weight: '',
    purpose: 'Breeding',
    source: 'Purchased',
    purchasePrice: '',
    purchaseDate: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchGoats();
    }
  }, [status, router, filter]);

  const fetchGoats = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.status) params.append('status', filter.status);
      if (filter.breed) params.append('breed', filter.breed);
      if (filter.gender) params.append('gender', filter.gender);

      const response = await fetch(`/api/goats?${params}`);
      const data = await response.json();
      setGoats(data);
    } catch (error) {
      console.error('Failed to fetch goats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/goats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
          purchaseDate: formData.purchaseDate || null,
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setFormData({
          tagNo: '',
          name: '',
          breed: 'Barbari',
          gender: 'Female',
          dateOfBirth: '',
          weight: '',
          purpose: 'Breeding',
          source: 'Purchased',
          purchasePrice: '',
          purchaseDate: '',
        });
        fetchGoats();
      }
    } catch (error) {
      console.error('Failed to add goat:', error);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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
            <Link href="/dashboard/goats" className="text-green-600 font-medium border-b-2 border-green-600 pb-3">
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
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Herd Management</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {showAddForm ? 'Cancel' : '+ Add Goat'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Add New Goat</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag Number *</label>
                <input
                  type="text"
                  required
                  value={formData.tagNo}
                  onChange={(e) => setFormData({ ...formData, tagNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Breed *</label>
                <select
                  required
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Barbari">Barbari</option>
                  <option value="Boer">Boer</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                <select
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Breeding">Breeding</option>
                  <option value="Meat">Meat</option>
                  <option value="Sale">Sale</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source *</label>
                <select
                  required
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Born">Born</option>
                  <option value="Purchased">Purchased</option>
                </select>
              </div>

              {formData.source === 'Purchased' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price (₹)</label>
                    <input
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Goat
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Sold">Sold</option>
              <option value="Dead">Dead</option>
              <option value="Culled">Culled</option>
            </select>

            <select
              value={filter.breed}
              onChange={(e) => setFilter({ ...filter, breed: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Breeds</option>
              <option value="Barbari">Barbari</option>
              <option value="Boer">Boer</option>
              <option value="Mixed">Mixed</option>
            </select>

            <select
              value={filter.gender}
              onChange={(e) => setFilter({ ...filter, gender: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tag No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breed</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {goats.map((goat) => {
                  const age = Math.floor(
                    (new Date().getTime() - new Date(goat.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 30)
                  );
                  return (
                    <tr key={goat.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {goat.tagNo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {goat.name || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{goat.breed}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{goat.gender}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{age} months</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {goat.weight ? `${goat.weight} kg` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{goat.purpose}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            goat.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : goat.status === 'Sold'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {goat.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {goats.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No goats found. Add your first goat to get started!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
