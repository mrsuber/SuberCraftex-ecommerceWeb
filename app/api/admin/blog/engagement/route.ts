import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdmin } from '@/lib/auth/verify-auth'

// GET /api/admin/blog/engagement - Get all blog engagement data for dashboard
export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request)

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    // If postId provided, get detailed engagement for that post
    if (postId) {
      const post = await db.blogPost.findUnique({
        where: { id: postId },
        select: {
          id: true,
          title: true,
          slug: true,
        },
      })

      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 })
      }

      // Get all likes with user info
      const likes = await db.blogLike.findMany({
        where: { postId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      // Get all comments with user info
      const comments = await db.blogComment.findMany({
        where: { postId },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      // Get share stats
      const shareStats = await db.blogShareStats.findUnique({
        where: { postId },
      })

      return NextResponse.json({
        post: {
          id: post.id,
          title: post.title,
          slug: post.slug,
        },
        likes: {
          count: likes.length,
          users: likes.map((like) => ({
            id: like.user.id,
            full_name: like.user.fullName,
            email: like.user.email,
            avatar_url: like.user.avatarUrl,
            liked_at: like.createdAt.toISOString(),
          })),
        },
        comments: {
          count: comments.length,
          items: comments.map((comment) => ({
            id: comment.id,
            content: comment.content,
            created_at: comment.createdAt.toISOString(),
            user: {
              id: comment.user.id,
              full_name: comment.user.fullName,
              email: comment.user.email,
              avatar_url: comment.user.avatarUrl,
            },
          })),
        },
        shares: {
          count: shareStats?.clickCount || 0,
        },
      })
    }

    // Get engagement summary for all posts
    const posts = await db.blogPost.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        publishedAt: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        shareStats: {
          select: {
            clickCount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const engagementSummary = posts.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      published_at: post.publishedAt?.toISOString() || null,
      likes_count: post._count.likes,
      comments_count: post._count.comments,
      shares_count: post.shareStats?.clickCount || 0,
      total_engagement:
        post._count.likes +
        post._count.comments +
        (post.shareStats?.clickCount || 0),
    }))

    // Get overall stats
    const totalLikes = await db.blogLike.count()
    const totalComments = await db.blogComment.count()
    const totalShares = await db.blogShareStats.aggregate({
      _sum: { clickCount: true },
    })

    // Get recent activity
    const recentLikes = await db.blogLike.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    const recentComments = await db.blogComment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json({
      summary: {
        total_likes: totalLikes,
        total_comments: totalComments,
        total_shares: totalShares._sum.clickCount || 0,
        total_posts: posts.length,
      },
      posts: engagementSummary,
      recent_activity: {
        likes: recentLikes.map((like) => ({
          type: 'like',
          user: {
            id: like.user.id,
            full_name: like.user.fullName,
            email: like.user.email,
          },
          post: {
            id: like.post.id,
            title: like.post.title,
            slug: like.post.slug,
          },
          created_at: like.createdAt.toISOString(),
        })),
        comments: recentComments.map((comment) => ({
          type: 'comment',
          id: comment.id,
          content: comment.content,
          user: {
            id: comment.user.id,
            full_name: comment.user.fullName,
            email: comment.user.email,
          },
          post: {
            id: comment.post.id,
            title: comment.post.title,
            slug: comment.post.slug,
          },
          created_at: comment.createdAt.toISOString(),
        })),
      },
    })
  } catch (error: any) {
    console.error('Error getting blog engagement:', error)

    if (
      error.message === 'Unauthorized' ||
      error.message.includes('Admin') ||
      error.message.includes('Forbidden')
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to get blog engagement data' },
      { status: 500 }
    )
  }
}
