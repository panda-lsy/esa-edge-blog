import { NextRequest, NextResponse } from 'next/server'
import { AdminStorage } from '../../../lib/admin-storage'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authorization token required' },
        { status: 401 }
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

    // 删除会话
    await adminStorage.deleteSession(token)

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Error logging out:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to logout',
      },
      { status: 500 }
    )
  }
}
