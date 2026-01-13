import { NextRequest, NextResponse } from 'next/server'
import { AdminStorage } from '../../../lib/admin-storage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body as { username: string; password: string }

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

    // 确保默认管理员存在
    await adminStorage.createDefaultAdmin()

    // 验证管理员凭据
    const admin = await adminStorage.verifyAdmin(username, password)

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      )
    }

    // 生成token
    const token = Buffer.from(`${admin.id}:${Date.now()}`).toString('base64')

    // 创建会话（7天过期）
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const session = {
      token,
      adminId: admin.id,
      expiresAt: expiresAt.toISOString(),
    }

    await adminStorage.createSession(session)

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
        error: error instanceof Error ? error.message : 'Failed to login',
      },
      { status: 500 }
    )
  }
}
