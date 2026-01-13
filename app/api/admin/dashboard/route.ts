import { NextRequest, NextResponse } from 'next/server'
import { AdminStorage } from '../../../lib/admin-storage'
import { EdgeStorage } from '../../../lib/storage'

export async function GET(request: NextRequest) {
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
    const session = await adminStorage.getSession(token)

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const storage = new EdgeStorage(kv)
    const postsResult = await storage.getAllPosts({ status: 'published' })
    const commentsResult = await storage.getAllComments({ status: 'approved' })
    const statsResult = await storage.getSiteStats()

    const posts = postsResult.success ? (postsResult.data || []) : []
    const comments = commentsResult.success ? (commentsResult.data || []) : []
    const stats = statsResult.success ? statsResult.data : {
      totalViews: 0,
      totalPosts: 0,
      totalComments: 0,
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: {
        posts: {
          total: posts.length,
          published: posts.length,
          draft: 0,
        },
        comments: {
          total: comments.length,
          pending: 0,
          approved: comments.length,
          spam: 0,
        },
        stats,
        recentPosts: posts.slice(0, 5),
        recentComments: comments.slice(0, 5),
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
      },
      { status: 500 }
    )
  }
}
