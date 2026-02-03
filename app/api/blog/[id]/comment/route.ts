import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAuth } from '@/lib/auth/verify-auth'

// GET /api/blog/[id]/comment - Get comments for a post
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

    const comments = await db.blogComment.findMany({
      where: { postId: post.id },
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

    const serializedComments = comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.createdAt.toISOString(),
      updated_at: comment.updatedAt.toISOString(),
      user: {
        id: comment.user.id,
        full_name: comment.user.fullName,
        email: comment.user.email,
        avatar_url: comment.user.avatarUrl,
      },
    }))

    return NextResponse.json({
      comments: serializedComments,
      commentCount: comments.length,
    })
  } catch (error) {
    console.error('Error getting comments:', error)
    return NextResponse.json(
      { error: 'Failed to get comments' },
      { status: 500 }
    )
  }
}

// POST /api/blog/[id]/comment - Add a comment (requires auth)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth(request)
    const { id } = await params
    const body = await request.json()

    const { content } = body

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Comment is too long (max 2000 characters)' },
        { status: 400 }
      )
    }

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

    // Create comment
    const comment = await db.blogComment.create({
      data: {
        postId: post.id,
        userId: user.id,
        content: content.trim(),
      },
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
    })

    const commentCount = await db.blogComment.count({
      where: { postId: post.id },
    })

    return NextResponse.json({
      message: 'Comment added successfully',
      comment: {
        id: comment.id,
        content: comment.content,
        created_at: comment.createdAt.toISOString(),
        updated_at: comment.updatedAt.toISOString(),
        user: {
          id: comment.user.id,
          full_name: comment.user.fullName,
          email: comment.user.email,
          avatar_url: comment.user.avatarUrl,
        },
      },
      commentCount,
    })
  } catch (error: any) {
    console.error('Error adding comment:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required', requiresAuth: true },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add comment' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[id]/comment?commentId=xxx - Delete own comment (requires auth)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth(request)
    const { searchParams } = new URL(request.url)
    const commentId = searchParams.get('commentId')

    if (!commentId) {
      return NextResponse.json(
        { error: 'Comment ID is required' },
        { status: 400 }
      )
    }

    const comment = await db.blogComment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Only allow deleting own comments (or admin)
    if (comment.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { error: 'You can only delete your own comments' },
        { status: 403 }
      )
    }

    await db.blogComment.delete({
      where: { id: commentId },
    })

    const commentCount = await db.blogComment.count({
      where: { postId: comment.postId },
    })

    return NextResponse.json({
      message: 'Comment deleted successfully',
      commentCount,
    })
  } catch (error: any) {
    console.error('Error deleting comment:', error)

    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Authentication required', requiresAuth: true },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    )
  }
}
