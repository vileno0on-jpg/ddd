import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get basic stats that work with current Supabase setup
    const [
      { count: totalUsers },
      { count: totalMessages },
      { count: totalPayments }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
      supabase.from('payments').select('*', { count: 'exact', head: true })
    ])

    // Revenue by pack (simplified)
    const { data: paymentsData } = await supabase
      .from('payments')
      .select('pack_id, amount, status')
      .eq('status', 'succeeded')

    const revenueByPack = paymentsData ? paymentsData.reduce((acc: any, payment: any) => {
      const packId = payment.pack_id
      if (!acc[packId]) {
        acc[packId] = { revenue: 0, count: 0 }
      }
      acc[packId].revenue += payment.amount
      acc[packId].count += 1
      return acc
    }, {}) : {}

    // Module completion stats (simplified)
    const { data: progressData } = await supabase
      .from('masterclass_progress')
      .select('module_id, progress_percent')

    const moduleStats = progressData ? progressData.reduce((acc: any, progress: any) => {
      const moduleId = progress.module_id
      if (!acc[moduleId]) {
        acc[moduleId] = {
          total_users: 0,
          completed_users: 0,
          total_progress: 0
        }
      }
      acc[moduleId].total_users += 1
      if (progress.progress_percent === 100) {
        acc[moduleId].completed_users += 1
      }
      acc[moduleId].total_progress += progress.progress_percent
      return acc
    }, {}) : {}

    // Return simplified analytics
    const analytics = {
      totalUsers: totalUsers || 0,
      totalMessages: totalMessages || 0,
      totalPayments: totalPayments || 0,
      revenueByPack: Object.entries(revenueByPack).map(([packId, stats]: [string, any]) => ({
        packId,
        revenue: stats.revenue / 100,
        count: stats.count,
      })),
      moduleStats: Object.entries(moduleStats).map(([moduleId, stats]: [string, any]) => ({
        moduleId,
        totalUsers: stats.total_users,
        completedUsers: stats.completed_users,
        avgProgress: stats.total_users > 0 ? stats.total_progress / stats.total_users : 0,
      })),
      // Placeholder data for complex queries that need RPC functions
      revenueByMonth: [],
      userGrowth: [],
      dailyActiveUsers: [],
      topUsers: []
    }

    return NextResponse.json(analytics)
  } catch (error: any) {
    console.error('Error loading analytics:', error)
    return NextResponse.json(
      { error: 'Failed to load analytics' },
      { status: 500 }
    )
  }
}

