import { NextRequest, NextResponse } from 'next/server'
import { EdgeStorage } from '../../lib/storage'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') as 'draft' | 'published' | null
    const category = searchParams.get('category') || undefined
    const tag = searchParams.get('tag') || undefined

    const kv = (globalThis as any).BLOG_KV
    if (!kv) {
      return NextResponse.json(
        { success: false, error: 'KV storage not available' },
        { status: 500 }
      )
    }

    const storage = new EdgeStorage(kv)

    const filter: any = {}
    if (status) filter.status = status
    if (category) filter.category = category
    if (tag) filter.tag = tag

    const result = await storage.getAllPosts(
      Object.keys(filter).length > 0 ? filter : undefined
    )

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      total: result.data?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch posts',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      title?: string
      slug?: string
      content?: string
      excerpt?: string
      author?: string
      tags?: string[]
      category?: string
      coverImage?: string
    }
    const { title, slug, content, excerpt, author, tags, category, coverImage } =
      body

    if (!title || !content || !author) {
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

    const newPost = {
      id: Date.now().toString(),
      title,
      slug: slug || generateSlug(title),
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      author,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags || [],
      category: category || 'Uncategorized',
      coverImage,
      views: 0,
      status: 'published' as const,
    }

    const result = await storage.savePost(newPost)

    if (!result.success) {
      return NextResponse.json(result, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: 'Post created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create post',
      },
      { status: 500 }
    )
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
