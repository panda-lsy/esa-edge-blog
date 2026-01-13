import { NextRequest, NextResponse } from 'next/server'
import { EdgeStorage } from '../../../../lib/storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authorization required' },
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

    const storage = new EdgeStorage(kv)
    const result = await storage.getComment(id)

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    const updatedComment = {
      ...result.data,
      status: 'approved' as const,
    }

    const updateResult = await storage.saveComment(updatedComment)

    if (!updateResult.success) {
      return NextResponse.json(updateResult, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Comment approved successfully',
      data: updatedComment,
    })
  } catch (error) {
    console.error('Error approving comment:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to approve comment',
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
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authorization required' },
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

    const storage = new EdgeStorage(kv)
    const result = await storage.getComment(id)

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    const commentIds = await storage.getCommentsByPost(result.data.postId, 'approved')
    if (commentIds.success && commentIds.data) {
      const ids: string[] = commentIds.data.map(c => c.id)
      await kv.delete(`comment:${id}`)
      
      await storage.updateSiteStats({
        totalComments: -1,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete comment',
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
    const body = (await request.json()) as { status?: string }
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authorization required' },
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

    const storage = new EdgeStorage(kv)
    const result = await storage.getComment(id)

    if (!result.success || !result.data) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      )
    }

    const updatedComment = {
      ...result.data,
      status: (body.status as 'pending' | 'approved' | 'spam') || 'spam',
    }

    const updateResult = await storage.saveComment(updatedComment)

    if (!updateResult.success) {
      return NextResponse.json(updateResult, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Comment status updated successfully',
      data: updatedComment,
    })
  } catch (error) {
    console.error('Error updating comment status:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update comment status',
      },
      { status: 500 }
    )
  }
}
