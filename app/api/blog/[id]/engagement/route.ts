import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth } from '@/lib/auth/verify-auth'

// GET /api/blog/[id]/engagement - Get all engagement data for a post
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

    // Get like count and user's like status
    const likeCount = await db.blogLike.count({
      where: { postId: post.id },
    })

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

    // Get comment count
    const commentCount = await db.blogComment.count({
      where: { postId: post.id },
    })

    // Get share count
    const shareStats = await db.blogShareStats.findUnique({
      where: { postId: post.id },
    })

    return NextResponse.json({
      postId: post.id,
      likes: {
        count: likeCount,
        hasLiked,
      },
      comments: {
        count: commentCount,
      },
      shares: {
        count: shareStats?.clickCount || 0,
      },
      isAuthenticated: auth.isAuthenticated,
      currentUserId: auth.user?.id,
    })
  } catch (error) {
    console.error('Error getting engagement data:', error)
    return NextResponse.json(
      { error: 'Failed to get engagement data' },
      { status: 500 }
    )
  }
}
