import { NextRequest, NextResponse } from 'next/server'
import { EdgeStorage } from '../../../lib/storage'
import type { BlogPost } from '../../../lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const kv = (globalThis as any).BLOG_KV
    if (!kv) {
      return NextResponse.json(
        { success: false, error: 'KV storage not available' },
        { status: 500 }
      )
    }

    const storage = new EdgeStorage(kv)
    const result = await storage.getPost(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 404 })
    }

    await storage.incrementPostViews(id)

    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch post',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = (await request.json()) as Partial<BlogPost>
    const kv = (globalThis as any).BLOG_KV

    if (!kv) {
      return NextResponse.json(
        { success: false, error: 'KV storage not available' },
        { status: 500 }
      )
    }

    const storage = new EdgeStorage(kv)

    const existingPostResult = await storage.getPost(id)
    if (!existingPostResult.success || !existingPostResult.data) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      )
    }

    const updatedPost = {
      ...existingPostResult.data,
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    }

    const result = await storage.savePost(updatedPost)

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: 'Post updated successfully',
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update post',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const kv = (globalThis as any).BLOG_KV

    if (!kv) {
      return NextResponse.json(
        { success: false, error: 'KV storage not available' },
        { status: 500 }
      )
    }

    const storage = new EdgeStorage(kv)
    const result = await storage.deletePost(id)

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete post',
      },
      { status: 500 }
    )
  }
}
