import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/blog/[id]/share - Get share count
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find post by ID or slug
    const post = await db.blogPost.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        status: 'published',
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const shareStats = await db.blogShareStats.findUnique({
      where: { postId: post.id },
    })

    return NextResponse.json({
      shareCount: shareStats?.clickCount || 0,
    })
  } catch (error) {
    console.error('Error getting share count:', error)
    return NextResponse.json(
      { error: 'Failed to get share count' },
      { status: 500 }
    )
  }
}

// POST /api/blog/[id]/share - Increment share click count (no auth required)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find post by ID or slug
    const post = await db.blogPost.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        status: 'published',
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Upsert share stats - create if not exists, increment if exists
    const shareStats = await db.blogShareStats.upsert({
      where: { postId: post.id },
      create: {
        postId: post.id,
        clickCount: 1,
      },
      update: {
        clickCount: { increment: 1 },
      },
    })

    return NextResponse.json({
      message: 'Share recorded',
      shareCount: shareStats.clickCount,
    })
  } catch (error) {
    console.error('Error recording share:', error)
    return NextResponse.json(
      { error: 'Failed to record share' },
      { status: 500 }
    )
  }
}
