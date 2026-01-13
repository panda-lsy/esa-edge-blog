import { NextRequest, NextResponse } from 'next/server'

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

    const fileKey = `image:${id}`
    const data = await kv.get(fileKey, 'arrayBuffer')
    const metadata = await kv.get(fileKey, { type: 'json' })

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      )
    }

    const contentType = metadata?.contentType || 'image/jpeg'

    return new NextResponse(new Uint8Array(data as ArrayBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to serve image',
      },
      { status: 500 }
    )
  }
}
