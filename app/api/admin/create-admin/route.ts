import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

/**
 * Create Admin User Endpoint
 * 
 * POST /api/admin/create-admin
 * Body: { email, password, fullName }
 * 
 * Note: This should be protected or removed after creating admin
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json()

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    let userId

    if (!checkError && existingUsers) {
      // User exists - update to admin
      userId = existingUsers.id

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Update user password
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({
          password_hash: hashedPassword,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (userUpdateError) {
        console.error('User update error:', userUpdateError)
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
      }

      // Update profile to admin
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          is_admin: true,
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (profileUpdateError) {
        console.error('Profile update error:', profileUpdateError)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
      }
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash(password, 10)

      const { data: newUser, error: userCreateError } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: hashedPassword,
          email_verified: true
        })
        .select('id')
        .single()

      if (userCreateError || !newUser) {
        console.error('User creation error:', userCreateError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      userId = newUser.id

      // Create admin profile
      const { error: profileCreateError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email,
          full_name: fullName,
          pack_id: 'free',
          is_admin: true
        })

      if (profileCreateError) {
        console.error('Profile creation error:', profileCreateError)
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
      }

      // Create user limits
      const today = new Date().toISOString().split('T')[0]
      const { error: limitsError } = await supabase
        .from('user_limits')
        .insert({
          user_id: userId,
          messages_today: 0,
          last_reset_date: today
        })

      if (limitsError) {
        console.error('Limits creation error:', limitsError)
      }
    }

    // Verify
    const { data: admin, error: verifyError } = await supabase
      .from('profiles')
      .select('id, email, full_name, is_admin, pack_id')
      .eq('id', userId)
      .single()

    if (verifyError || !admin) {
      console.error('Verification error:', verifyError)
      return NextResponse.json({ error: 'Failed to verify admin creation' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: {
        id: admin.id,
        email: admin.email,
        fullName: admin.full_name,
        isAdmin: admin.is_admin,
        packId: admin.pack_id,
      },
    })
  } catch (error: any) {
    console.error('Admin creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create admin user' },
      { status: 500 }
    )
  }
}

