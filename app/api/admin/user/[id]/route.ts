import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { id: userId } = await params

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    // Get user's payments
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    // Get user's chat messages count
    const { count: messageCount, error: countError } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    // Get user limits
    const { data: limits, error: limitsError } = await supabase
      .from('user_limits')
      .select('*')
      .eq('user_id', userId)
      .single()

    return NextResponse.json({
      profile,
      subscriptions,
      payments,
      messageCount,
      limits,
    })
  } catch (error: any) {
    console.error('Error fetching user details:', error)
    return NextResponse.json({ error: 'Failed to fetch user details' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { id: userId } = await params
    const { packId, isAdmin, fullName, packExpiresAt } = await req.json()

    // Prepare update object
    const updates: any = {}
    updates.updated_at = new Date().toISOString()

    if (packId !== undefined) {
      updates.pack_id = packId
      if (packExpiresAt !== undefined) {
        updates.pack_expires_at = packExpiresAt
      }
    }

    // Update profile fields
    if (Object.keys(updates).length > 1) { // More than just updated_at
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)

      if (updateError) {
        console.error('Profile update error:', updateError)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
      }
    }

    // Update admin status separately if provided
    if (isAdmin !== undefined) {
      const { error: adminError } = await supabase
        .from('profiles')
        .update({
          is_admin: isAdmin,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (adminError) {
        console.error('Admin status update error:', adminError)
        return NextResponse.json({ error: 'Failed to update admin status' }, { status: 500 })
      }
    }

    // Update full name separately if provided
    if (fullName !== undefined) {
      const { error: nameError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (nameError) {
        console.error('Full name update error:', nameError)
        return NextResponse.json({ error: 'Failed to update full name' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: 'User updated successfully' })
  } catch (error: any) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

