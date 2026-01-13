import { NextRequest, NextResponse } from 'next/server'
import { AdminStorage } from '../../lib/admin-storage'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      username?: string
      password?: string
    }
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    const kv = (globalThis as any).BLOG_KV
    if (!kv) {
      return NextResponse.json(
        { success: false, error: 'KV storage not available' },
        { status: 500 }
      )
    }

    const adminStorage = new AdminStorage(kv)
    const admin = await adminStorage.verifyAdmin(username, password)

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    const token = generateToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    await adminStorage.createSession({
      token,
      adminId: admin.id,
      expiresAt,
    })

    return NextResponse.json({
      success: true,
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role,
        },
      },
    })
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      },
      { status: 500 }
    )
  }
}

function generateToken(): string {
  const array = new Uint32Array(4)
  crypto.getRandomValues(array)
  return Array.from(array, (dec) => ('0' + dec.toString(16)).substr(-2)).join('')
}
