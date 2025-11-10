import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profilesError) {
      console.error('Profiles fetch error:', profilesError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    // Get subscription counts
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('user_id')

    // Get payment data
    const { data: payments } = await supabase
      .from('payments')
      .select('user_id, amount, status')

    // Process the data
    const subscriptionCounts: { [key: string]: number } = {}
    const paymentStats: { [key: string]: { count: number; total: number } } = {}

    subscriptions?.forEach(sub => {
      subscriptionCounts[sub.user_id] = (subscriptionCounts[sub.user_id] || 0) + 1
    })

    payments?.forEach(payment => {
      if (!paymentStats[payment.user_id]) {
        paymentStats[payment.user_id] = { count: 0, total: 0 }
      }
      paymentStats[payment.user_id].count += 1
      if (payment.status === 'succeeded') {
        paymentStats[payment.user_id].total += payment.amount
      }
    })

    // Combine data
    const users = profiles?.map(profile => ({
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      pack_id: profile.pack_id,
      pack_expires_at: profile.pack_expires_at,
      is_admin: profile.is_admin,
      created_at: profile.created_at,
      subscription_count: subscriptionCounts[profile.id] || 0,
      payment_count: paymentStats[profile.id]?.count || 0,
      total_spent: paymentStats[profile.id]?.total || 0
    })) || []

    return NextResponse.json(users)
  } catch (error: any) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

