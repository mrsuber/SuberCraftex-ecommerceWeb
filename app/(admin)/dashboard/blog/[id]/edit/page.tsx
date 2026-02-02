import { db } from '@/lib/db'
import { BlogPostForm } from '@/components/dashboard/BlogPostForm'
import { notFound } from 'next/navigation'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://subercraftex.com'

function toAbsoluteUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${APP_URL}${url}`
}

async function getBlogPost(id: string) {
  const post = await db.blogPost.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, fullName: true, email: true },
      },
    },
  })

  if (!post) return null

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
    author: {
      id: post.author.id,
      full_name: post.author.fullName,
      email: post.author.email,
    },
    created_at: post.createdAt.toISOString(),
    updated_at: post.updatedAt.toISOString(),
  }
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getBlogPost(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Blog Post</h1>
        <p className="text-muted-foreground mt-2">Update post details and content</p>
      </div>

      <BlogPostForm post={post} />
    </div>
  )
}
