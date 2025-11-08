'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { 
  Users, DollarSign, TrendingUp, Settings, Crown, Shield, Activity, 
  Search, Edit, Eye, Package, BarChart3, FileText, Download, 
  Calendar, CreditCard, MessageSquare, UserCheck, UserX, RefreshCw, Clock,
  ArrowUpDown, Filter, TrendingDown, Sparkles, Zap, Target
} from 'lucide-react'
import Link from 'next/link'
import { getModulesForPack } from '@/lib/content/pack-content'
import { PRICING_PACKS } from '@/lib/stripe'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import UserUpgradeModal from '@/components/admin/UserUpgradeModal'

interface User {
  id: string
  email: string
  full_name: string
  pack_id: string
  pack_expires_at: string | null
  is_admin: boolean
  created_at: string
  subscription_count: number
  payment_count: number
  total_spent: number
}

interface PackStats {
  pack_id: string
  user_count: number
  active_count: number
  expired_count: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'stats' | 'content'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    messageCount: 0,
    totalPurchases: 0,
    recentSignups: 0,
    usersByPack: [] as { packId: string; count: number }[],
  })

  const [users, setUsers] = useState<User[]>([])
  const [packStats, setPackStats] = useState<PackStats[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [upgradeUser, setUpgradeUser] = useState<User | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'pack' | 'spent' | 'date'>('date')
  const [filterPack, setFilterPack] = useState<string>('all')

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session) {
      router.push('/auth/login')
      return
    }

    if (!session.user.isAdmin) {
      router.push('/dashboard')
      return
    }

    const userData = {
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.name,
      pack_id: session.user.packId || 'free',
      is_admin: session.user.isAdmin || false,
    }

    setUser(userData)
    loadData()
    setLoading(false)
  }, [session, status, router])

  const loadData = async () => {
    await Promise.all([
      loadStats(),
      loadUsers(),
      loadPackStats(),
      loadAnalytics(),
    ])
  }

  const loadAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics', {
        cache: 'no-store',
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  const loadStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        cache: 'no-store',
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        cache: 'no-store',
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadPackStats = async () => {
    try {
      const res = await fetch('/api/admin/pack-stats', {
        cache: 'no-store',
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setPackStats(data.packStats || [])
      }
    } catch (error) {
      console.error('Error loading pack stats:', error)
    }
  }

  const handleUpdateUserPack = async (userId: string, newPackId: string, expiresAt: string | null = null) => {
    try {
      const res = await fetch(`/api/admin/user/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          packId: newPackId,
          packExpiresAt: expiresAt
        }),
      })

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => ({}))
        const message = errorPayload?.error || 'Failed to update user pack'
        throw new Error(message)
      }

      await Promise.all([loadUsers(), loadStats()])
      setUpgradeUser(null)
    } catch (error) {
      console.error('Error updating user pack:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to update user pack. Please try again.'
      )
    }
  }

  const filteredUsers = users
    .filter(u => 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(u => filterPack === 'all' || u.pack_id === filterPack)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.full_name || '').localeCompare(b.full_name || '')
        case 'email':
          return a.email.localeCompare(b.email)
        case 'pack':
          return a.pack_id.localeCompare(b.pack_id)
        case 'spent':
          return b.total_spent - a.total_spent
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

      const allPackContent = ['free', 'immigration', 'advanced', 'citizenship'].map(packId => ({
      packId,
      packName: PRICING_PACKS[packId as keyof typeof PRICING_PACKS]?.name || packId,
      modules: getModulesForPack(packId),
    }))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              <Shield className="inline-block w-10 h-10 mr-3 text-purple-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Full control panel - Manage users, content, and statistics
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/admin/settings"
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-sm"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
            <button
              onClick={loadData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Clients', icon: Users },
              { id: 'stats', label: 'Statistics', icon: TrendingUp },
              { id: 'content', label: 'Content', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 pb-4 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-600 dark:border-purple-400 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  title: 'Total Users',
                  value: stats.totalUsers,
                  icon: Users,
                  color: 'text-blue-600 dark:text-blue-400',
                  bg: 'bg-blue-50 dark:bg-blue-900',
                  subtitle: `${stats.recentSignups} new this week`,
                },
                {
                  title: 'Total Revenue',
                  value: `CHF ${stats.totalRevenue.toFixed(2)}`,
                  icon: DollarSign,
                  color: 'text-green-600 dark:text-green-400',
                  bg: 'bg-green-50 dark:bg-green-900',
                  subtitle: `CHF ${stats.monthlyRevenue.toFixed(2)} this month`,
                },
                {
                  title: 'Active Subscriptions',
                  value: stats.activeSubscriptions,
                  icon: Crown,
                  color: 'text-purple-600 dark:text-purple-400',
                  bg: 'bg-purple-50 dark:bg-purple-900',
                  subtitle: `${stats.totalPurchases} total purchases`,
                },
                {
                  title: 'AI Messages',
                  value: stats.messageCount,
                  icon: Activity,
                  color: 'text-orange-600 dark:text-orange-400',
                  bg: 'bg-orange-50 dark:bg-orange-900',
                  subtitle: 'All time messages',
                },
              ].map((stat) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {stat.subtitle}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Users by Pack */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.usersByPack.map((pack) => (
                <div key={pack.packId} className="card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Crown className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900 px-2 py-1 rounded">
                      {pack.packId.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {pack.count}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Users
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="card p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterPack}
                    onChange={(e) => setFilterPack(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Packs</option>
                    <option value="free">Free</option>
                    <option value="immigration">Immigration</option>
                    <option value="advanced">Advanced</option>
                    <option value="citizenship">Citizenship Pro</option>
                  </select>
                </div>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="pack">Sort by Pack</option>
                    <option value="spent">Sort by Spent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  All Clients ({filteredUsers.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Email</th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Name</th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Pack</th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Purchases</th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Spent</th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Joined</th>
                      <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 text-gray-900 dark:text-white">
                          <div className="flex items-center space-x-2">
                            {user.is_admin && <Shield className="w-4 h-4 text-purple-600" />}
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {user.full_name || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={user.pack_id}
                            onChange={(e) => handleUpdateUserPack(user.id, e.target.value)}
                            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          >
                            <option value="free">Free</option>
                            <option value="immigration">Immigration</option>
                            <option value="advanced">Advanced</option>
                            <option value="citizenship">Citizenship Pro</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {user.payment_count || 0}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          CHF {(user.total_spent / 100).toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setUpgradeUser(user)}
                              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-md flex items-center space-x-1"
                            >
                              <Crown className="w-3 h-3" />
                              <span>Upgrade</span>
                            </button>
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Pack Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packStats.map((pack) => (
                <motion.div
                  key={pack.pack_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="card p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {pack.pack_id.toUpperCase()} Pack
                    </h3>
                    <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Users:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{pack.user_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Active:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">{pack.active_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Expired:</span>
                      <span className="font-semibold text-red-600 dark:text-red-400">{pack.expired_count}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                <span>Purchase Statistics</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalPurchases}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Purchases</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    CHF {stats.totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    CHF {stats.monthlyRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">This Month</div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {stats.activeSubscriptions}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Subs</div>
                </div>
              </div>
            </motion.div>

            {/* Revenue & Growth Charts */}
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                {analytics.revenueByMonth && analytics.revenueByMonth.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span>Revenue Trend (12 Months)</span>
                      </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={analytics.revenueByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                          stroke="#6b7280"
                        />
                        <YAxis 
                          tickFormatter={(value) => `CHF ${value}`}
                          stroke="#6b7280"
                        />
                        <Tooltip 
                          formatter={(value: number) => [`CHF ${value.toFixed(2)}`, 'Revenue']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981', r: 4 }}
                          name="Revenue"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* User Growth Chart */}
                {analytics.userGrowth && analytics.userGrowth.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>User Growth (12 Months)</span>
                      </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={analytics.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                          stroke="#6b7280"
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value: number) => [value, 'New Users']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" name="New Users" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </div>
            )}

            {/* Revenue by Pack Pie Chart */}
            {analytics && analytics.revenueByPack && analytics.revenueByPack.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  <span>Revenue by Pack</span>
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.revenueByPack}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ packId, revenue }) => `${packId}: CHF ${(revenue as number).toFixed(2)}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {analytics.revenueByPack.map((entry: any, index: number) => {
                        const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      })}
                    </Pie>
                    <Tooltip formatter={(value: number) => `CHF ${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Daily Active Users Chart */}
            {analytics && analytics.dailyActiveUsers && analytics.dailyActiveUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <span>Daily Active Users (Last 30 Days)</span>
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailyActiveUsers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      stroke="#6b7280"
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Active Users']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={{ fill: '#f97316', r: 3 }}
                      name="Active Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Top Users */}
            {analytics && analytics.topUsers && analytics.topUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <span>Top Active Users</span>
                </h3>
                <div className="space-y-3">
                  {analytics.topUsers.slice(0, 10).map((user: any, idx: number) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center font-bold text-purple-600 dark:text-purple-400">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {user.fullName || user.email}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {user.messageCount} messages • CHF {user.totalSpent.toFixed(2)} spent
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const foundUser = users.find(u => u.id === user.id)
                          if (foundUser) setUpgradeUser(foundUser)
                        }}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Module Completion Stats */}
            {analytics && analytics.moduleStats && analytics.moduleStats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Module Completion Statistics</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Module</th>
                        <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Total Users</th>
                        <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Completed</th>
                        <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Avg Progress</th>
                        <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-300 font-semibold">Completion Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {analytics.moduleStats.map((module: any) => {
                        const completionRate = module.totalUsers > 0 
                          ? Math.round((module.completedUsers / module.totalUsers) * 100) 
                          : 0
                        return (
                          <tr key={module.moduleId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                              {module.moduleId}
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              {module.totalUsers}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                {module.completedUsers}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                              {module.avgProgress.toFixed(1)}%
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full transition-all"
                                    style={{ width: `${completionRate}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-900 dark:text-white w-12 text-right">
                                  {completionRate}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Content Tab - Full Access to All Packs */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  All Pack Content
                </h2>
                <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                  Admin Full Access
                </span>
              </div>

      <div className="space-y-8">
        {allPackContent.map((pack) => (
          <div key={pack.packId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {pack.packName}
              </h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {pack.modules.length} modules
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pack.modules.map((module) => (
                <Link
                  key={module.id}
                  href={`/admin/module/${module.id}`}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {module.title}
                    </h4>
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {module.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                      {module.type}
                    </span>
                    {module.duration && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{module.duration}</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                      Open admin view →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
            </div>
          </div>
        )}

        {/* User Upgrade Modal */}
        {upgradeUser && (
          <UserUpgradeModal
            user={upgradeUser}
            onClose={() => setUpgradeUser(null)}
            onUpgrade={handleUpdateUserPack}
          />
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  User Details
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <div className="text-gray-900 dark:text-white">{selectedUser.email}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <div className="text-gray-900 dark:text-white">{selectedUser.full_name || '—'}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Pack</label>
                  <div className="text-gray-900 dark:text-white">{selectedUser.pack_id.toUpperCase()}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Spent</label>
                  <div className="text-gray-900 dark:text-white">CHF {(selectedUser.total_spent / 100).toFixed(2)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Purchases</label>
                  <div className="text-gray-900 dark:text-white">{selectedUser.payment_count}</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
