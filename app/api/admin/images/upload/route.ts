import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authorization required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const kv = (globalThis as any).BLOG_KV
    if (!kv) {
      return NextResponse.json(
        { success: false, error: 'KV storage not available' },
        { status: 500 }
      )
    }

    const fileId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const fileKey = `image:${fileId}`

    await kv.put(fileKey, buffer, {
      metadata: {
        filename: file.name,
        contentType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
    })

    const imageUrl = `/api/images/${fileId}`

    return NextResponse.json({
      success: true,
      data: {
        id: fileId,
        url: imageUrl,
        filename: file.name,
        size: file.size,
        contentType: file.type,
      },
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to upload image',
      },
      { status: 500 }
    )
  }
}
