import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth } from '@/lib/auth/verify-auth'

// GET /api/blog/[id]/like - Get like status and count
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await verifyAuth(request)

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

    // Get like count
    const likeCount = await db.blogLike.count({
      where: { postId: post.id },
    })

    // Check if current user has liked
    let hasLiked = false
    if (auth.user) {
      const existingLike = await db.blogLike.findUnique({
        where: {
          postId_userId: {
            postId: post.id,
            userId: auth.user.id,
          },
        },
      })
      hasLiked = !!existingLike
    }

    return NextResponse.json({
      likeCount,
      hasLiked,
      isAuthenticated: auth.isAuthenticated,
    })
  } catch (error) {
    console.error('Error getting like status:', error)
    return NextResponse.json(
      { error: 'Failed to get like status' },
      { status: 500 }
    )
  }
}

// POST /api/blog/[id]/like - Like a post (requires auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth(request)
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

    // Check if already liked
    const existingLike = await db.blogLike.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId: user.id,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json(
        { error: 'Already liked this post' },
        { status: 400 }
      )
    }

    // Create like
    await db.blogLike.create({
      data: {
        postId: post.id,
        userId: user.id,
      },
    })

    const likeCount = await db.blogLike.count({
      where: { postId: post.id },
    })

    return NextResponse.json({
      message: 'Post liked successfully',
      likeCount,
      hasLiked: true,
    })
  } catch (error: any) {
    console.error('Error liking post:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required', requiresAuth: true },
        { status: 401 }
      )
    }

    return NextResponse.json({ error: 'Failed to like post' }, { status: 500 })
  }
}

// DELETE /api/blog/[id]/like - Unlike a post (requires auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth(request)
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

    // Check if liked
    const existingLike = await db.blogLike.findUnique({
      where: {
        postId_userId: {
          postId: post.id,
          userId: user.id,
        },
      },
    })

    if (!existingLike) {
      return NextResponse.json(
        { error: 'You have not liked this post' },
        { status: 400 }
      )
    }

    // Delete like
    await db.blogLike.delete({
      where: { id: existingLike.id },
    })

    const likeCount = await db.blogLike.count({
      where: { postId: post.id },
    })

    return NextResponse.json({
      message: 'Post unliked successfully',
      likeCount,
      hasLiked: false,
    })
  } catch (error: any) {
    console.error('Error unliking post:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required', requiresAuth: true },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to unlike post' },
      { status: 500 }
    )
  }
}
