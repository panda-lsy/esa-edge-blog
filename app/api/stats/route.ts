import { NextRequest, NextResponse } from 'next/server'
import { EdgeStorage } from '../../lib/storage'

export async function GET(request: NextRequest) {
  try {
    const kv = (globalThis as any).BLOG_KV
    if (!kv) {
      return NextResponse.json(
        { success: false, error: 'KV storage not available' },
        { status: 500 }
      )
    }

    const storage = new EdgeStorage(kv)
    const result = await storage.getSiteStats()

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { type?: string }
    const { type } = body

    const kv = (globalThis as any).BLOG_KV
    if (!kv) {
      return NextResponse.json(
        { success: false, error: 'KV storage not available' },
        { status: 500 }
      )
    }

    const storage = new EdgeStorage(kv)

    let updates: Record<string, number> = {}

    if (type === 'view') {
      updates.totalViews = 1
    } else if (type === 'post') {
      updates.totalPosts = 1
    } else if (type === 'comment') {
      updates.totalComments = 1
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid type' },
        { status: 400 }
      )
    }

    const result = await storage.updateSiteStats(updates)

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Error updating stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update stats',
      },
      { status: 500 }
    )
  }
}
