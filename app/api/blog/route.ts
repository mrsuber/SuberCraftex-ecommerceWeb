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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// GET /api/blog - List blog posts
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request)
    const isAdmin = auth.user?.role === 'admin'

    const where: any = {}
    if (!isAdmin) {
      where.status = 'published'
    }

    const posts = await db.blogPost.findMany({
      where,
      include: {
        author: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: isAdmin
        ? { createdAt: 'desc' }
        : { publishedAt: 'desc' },
    })

    return NextResponse.json(posts.map(serializePost))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

// POST /api/blog - Create blog post (admin only)
export async function POST(request: NextRequest) {
  try {
    const { user } = await requireAdmin(request)
    const body = await request.json()

    const { title, content, excerpt, featuredImage, youtubeUrl, status, publishedAt } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Generate unique slug
    let slug = slugify(title)
    const existing = await db.blogPost.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now()}`
    }

    const postStatus = status || 'draft'

    const post = await db.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featuredImage: featuredImage || null,
        youtubeUrl: youtubeUrl || null,
        status: postStatus,
        publishedAt: postStatus === 'published'
          ? (publishedAt ? new Date(publishedAt) : new Date())
          : (publishedAt ? new Date(publishedAt) : null),
        authorId: user.id,
      },
      include: {
        author: {
          select: { id: true, fullName: true, email: true },
        },
      },
    })

    return NextResponse.json(serializePost(post), { status: 201 })
  } catch (error: any) {
    console.error('Error creating blog post:', error)

    if (error.message === 'Unauthorized' || error.message.includes('Admin')) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }

    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    )
  }
}
