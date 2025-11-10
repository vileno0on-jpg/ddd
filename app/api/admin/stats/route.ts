import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()

    // Get all stats concurrently
    const [
      { count: userCount },
      { count: subCount },
      { count: msgCount },
      { count: totalPurchases },
      { count: recentSignups }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
      supabase.from('payments').select('*', { count: 'exact', head: true }).eq('status', 'succeeded'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ])

    // Get users by pack
    const { data: packData } = await supabase
      .from('profiles')
      .select('pack_id')

    const usersByPack = packData ? packData.reduce((acc: any, profile: any) => {
      const packId = profile.pack_id
      if (!acc[packId]) {
        acc[packId] = 0
      }
      acc[packId] += 1
      return acc
    }, {}) : {}

    // Get total revenue
    const { data: revenueData } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'succeeded')

    const totalRevenue = revenueData ? revenueData.reduce((sum, payment) => sum + payment.amount, 0) / 100 : 0

    // Get monthly revenue
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: monthlyRevenueData } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'succeeded')
      .gte('created_at', startOfMonth.toISOString())

    const monthlyRevenue = monthlyRevenueData ? monthlyRevenueData.reduce((sum, payment) => sum + payment.amount, 0) / 100 : 0

    return NextResponse.json({
      totalUsers: Number(userCount || 0),
      usersByPack: Object.entries(usersByPack).map(([packId, count]) => ({
        packId,
        count: Number(count),
      })),
      totalRevenue: Number(totalRevenue),
      monthlyRevenue: Number(monthlyRevenue),
      activeSubscriptions: Number(subCount || 0),
      messageCount: Number(msgCount || 0),
      totalPurchases: Number(totalPurchases || 0),
      recentSignups: Number(recentSignups || 0),
    })
  } catch (error) {
    console.error('Error loading admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to load stats' },
      { status: 500 }
    )
  }
}

