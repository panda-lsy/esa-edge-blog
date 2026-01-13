import { NextRequest, NextResponse } from 'next/server'
import { EdgeStorage } from '../../lib/storage'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const postId = searchParams.get('postId')
    const status = searchParams.get('status') as
      | 'pending'
      | 'approved'
      | 'spam'
      | null

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'postId is required' },
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

    const storage = new EdgeStorage(kv)
    const result = await storage.getCommentsByPost(postId, status || undefined)

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.data?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch comments',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      postId?: string
      author?: string
      email?: string
      content?: string
    }
    const { postId, author, email, content } = body

    if (!postId || !author || !email || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
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

    const storage = new EdgeStorage(kv)

    const newComment = {
      id: Date.now().toString(),
      postId,
      author,
      email,
      content,
      createdAt: new Date().toISOString(),
      status: 'approved' as const,
    }

    const result = await storage.saveComment(newComment)

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: 'Comment submitted successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create comment',
      },
      { status: 500 }
    )
  }
}
