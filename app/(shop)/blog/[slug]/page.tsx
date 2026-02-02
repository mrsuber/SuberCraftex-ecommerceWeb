import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://subercraftex.com'

function toAbsoluteUrl(url: string | null): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${APP_URL}${url}`
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/
  )
  return match ? match[1] : null
}

async function getPost(slug: string) {
  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, fullName: true, email: true },
      },
    },
  })

  if (!post || post.status !== 'published') return null

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    featured_image: toAbsoluteUrl(post.featuredImage),
    youtube_url: post.youtubeUrl,
    published_at: post.publishedAt?.toISOString() || null,
    author_name: post.author.fullName || post.author.email,
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const youtubeId = post.youtube_url ? extractYouTubeId(post.youtube_url) : null

  return (
    <div className="container max-w-3xl py-12">
      <article className="space-y-8">
        <header className="space-y-4">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{post.author_name}</span>
            {post.published_at && (
              <>
                <span>&middot;</span>
                <time>{format(new Date(post.published_at), 'MMMM d, yyyy')}</time>
              </>
            )}
          </div>
        </header>

        {post.featured_image && (
          <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>
        )}

        {youtubeId && (
          <div className="aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              className="w-full h-full"
              allowFullScreen
              title="Video"
            />
          </div>
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  )
}
