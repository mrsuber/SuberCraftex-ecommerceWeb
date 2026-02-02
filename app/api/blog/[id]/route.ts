import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAuth, requireAdmin } from '@/lib/auth/verify-auth'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://subercraftex.com'

function toAbsoluteUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${APP_URL}${url}`
}

function serializePost(post: any) {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featured_image: toAbsoluteUrl(post.featuredImage),
    youtube_url: post.youtubeUrl,
    status: post.status,
    published_at: post.publishedAt?.toISOString() || null,
    author_id: post.authorId,
    author: post.author
      ? {
          id: post.author.id,
          full_name: post.author.fullName,
          email: post.author.email,
        }
      : undefined,
    created_at: post.createdAt.toISOString(),
    updated_at: post.updatedAt.toISOString(),
  }
}

// GET /api/blog/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const auth = await verifyAuth(request)
    const isAdmin = auth.user?.role === 'admin'

    const post = await db.blogPost.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, fullName: true, email: true },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (!isAdmin && post.status !== 'published') {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(serializePost(post))
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    )
  }
}

// PATCH /api/blog/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params
    const body = await request.json()

    const existing = await db.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const { title, slug, content, excerpt, featuredImage, youtubeUrl, status, publishedAt } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (content !== undefined) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt || null
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage || null
    if (youtubeUrl !== undefined) updateData.youtubeUrl = youtubeUrl || null
    if (status !== undefined) {
      updateData.status = status
      // Auto-set publishedAt when publishing for the first time
      if (status === 'published' && !existing.publishedAt && publishedAt === undefined) {
        updateData.publishedAt = new Date()
      }
    }
    if (publishedAt !== undefined) {
      updateData.publishedAt = publishedAt ? new Date(publishedAt) : null
    }

    const post = await db.blogPost.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: { id: true, fullName: true, email: true },
        },
      },
    })

    return NextResponse.json(serializePost(post))
  } catch (error: any) {
    console.error('Error updating blog post:', error)

    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

// DELETE /api/blog/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(request)
    const { id } = await params

    const existing = await db.blogPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await db.blogPost.delete({ where: { id } })

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting blog post:', error)

    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
