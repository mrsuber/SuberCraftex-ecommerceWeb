import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'

async function getPostEngagement(id: string) {
  const post = await db.blogPost.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      publishedAt: true,
    },
  })

  if (!post) return null

  // Get all likes with user info
  const likes = await db.blogLike.findMany({
    where: { postId: id },
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
    where: { postId: id },
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
    where: { postId: id },
  })

  return {
    post: {
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      published_at: post.publishedAt?.toISOString() || null,
    },
    likes: likes.map((like) => ({
      id: like.id,
      user: {
        id: like.user.id,
        full_name: like.user.fullName,
        email: like.user.email,
        avatar_url: like.user.avatarUrl,
      },
      created_at: like.createdAt.toISOString(),
    })),
    comments: comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      user: {
        id: comment.user.id,
        full_name: comment.user.fullName,
        email: comment.user.email,
        avatar_url: comment.user.avatarUrl,
      },
      created_at: comment.createdAt.toISOString(),
    })),
    shares: {
      count: shareStats?.clickCount || 0,
    },
  }
}

function getInitials(name: string | null, email: string) {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return email[0].toUpperCase()
}

export default async function PostEngagementPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getPostEngagement(id)

  if (!data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/blog/engagement">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{data.post.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge
              variant={data.post.status === 'published' ? 'default' : 'secondary'}
              className={data.post.status === 'published' ? 'bg-green-600' : ''}
            >
              {data.post.status}
            </Badge>
            {data.post.published_at && (
              <span className="text-sm text-muted-foreground">
                Published {format(new Date(data.post.published_at), 'MMMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
        <Link href={`/blog/${data.post.slug}`} target="_blank">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Post
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.likes.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.comments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Share Clicks</CardTitle>
            <Share2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.shares.count}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Users Who Liked */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Users Who Liked ({data.likes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.likes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No likes yet
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {data.likes.map((like) => (
                  <div key={like.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={like.user.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(like.user.full_name, like.user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {like.user.full_name || like.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(like.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-500" />
              Comments ({data.comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.comments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No comments yet
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {data.comments.map((comment) => (
                  <div key={comment.id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.user.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(comment.user.full_name, comment.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {comment.user.full_name || comment.user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap pl-11">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
