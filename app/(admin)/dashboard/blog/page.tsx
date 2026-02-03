import { Suspense } from 'react'
import { db } from '@/lib/db'
import { BlogPostsTable } from '@/components/dashboard/BlogPostsTable'
import { Button } from '@/components/ui/button'
import { Plus, BarChart2 } from 'lucide-react'
import Link from 'next/link'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://subercraftex.com'

function toAbsoluteUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${APP_URL}${url}`
}

async function getBlogPosts() {
  const posts = await db.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { id: true, fullName: true, email: true },
      },
    },
  })

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    featured_image: toAbsoluteUrl(post.featuredImage),
    images: (post.images || []).map((img: string) => toAbsoluteUrl(img) as string),
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
  }))
}

export default async function BlogPostsPage() {
  const posts = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage blog posts and articles
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/blog/engagement">
            <Button variant="outline">
              <BarChart2 className="mr-2 h-4 w-4" />
              Engagement
            </Button>
          </Link>
          <Link href="/dashboard/blog/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Post
            </Button>
          </Link>
        </div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <BlogPostsTable posts={posts} />
      </Suspense>
    </div>
  )
}
