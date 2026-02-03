import { db } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://subercraftex.com'

function toAbsoluteUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${APP_URL}${url}`
}

async function getPublishedPosts() {
  const posts = await db.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
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
    featured_image: toAbsoluteUrl(post.featuredImage),
    published_at: post.publishedAt?.toISOString() || null,
    author_name: post.author.fullName || post.author.email,
  }))
}

export default async function BlogPage() {
  const posts = await getPublishedPosts()

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Blog</h1>
        <p className="text-muted-foreground mt-2">
          Latest news, updates, and stories
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">
          No posts yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[16/9] relative bg-muted">
                {post.featured_image ? (
                  <Image
                    src={post.featured_image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{post.author_name}</span>
                  {post.published_at && (
                    <>
                      <span>&middot;</span>
                      <span>{format(new Date(post.published_at), 'MMM d, yyyy')}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
