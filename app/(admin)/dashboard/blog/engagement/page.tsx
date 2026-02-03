import { db } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, MessageCircle, Share2, TrendingUp } from 'lucide-react'
import { BlogEngagementTable } from '@/components/dashboard/BlogEngagementTable'
import { RecentActivity } from '@/components/dashboard/RecentActivity'

async function getEngagementData() {
  // Get overall stats
  const totalLikes = await db.blogLike.count()
  const totalComments = await db.blogComment.count()
  const totalShares = await db.blogShareStats.aggregate({
    _sum: { clickCount: true },
  })

  // Get posts with engagement counts
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

  const engagementPosts = posts.map((post) => ({
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

  // Get recent likes
  const recentLikes = await db.blogLike.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
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

  // Get recent comments
  const recentComments = await db.blogComment.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
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

  return {
    summary: {
      totalLikes,
      totalComments,
      totalShares: totalShares._sum.clickCount || 0,
      totalPosts: posts.length,
    },
    posts: engagementPosts,
    recentActivity: {
      likes: recentLikes.map((like) => ({
        type: 'like' as const,
        user: {
          id: like.user.id,
          full_name: like.user.fullName,
          email: like.user.email,
          avatar_url: like.user.avatarUrl,
        },
        post: {
          id: like.post.id,
          title: like.post.title,
          slug: like.post.slug,
        },
        created_at: like.createdAt.toISOString(),
      })),
      comments: recentComments.map((comment) => ({
        type: 'comment' as const,
        id: comment.id,
        content: comment.content,
        user: {
          id: comment.user.id,
          full_name: comment.user.fullName,
          email: comment.user.email,
          avatar_url: comment.user.avatarUrl,
        },
        post: {
          id: comment.post.id,
          title: comment.post.title,
          slug: comment.post.slug,
        },
        created_at: comment.createdAt.toISOString(),
      })),
    },
  }
}

export default async function BlogEngagementPage() {
  const data = await getEngagementData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Blog Engagement</h1>
        <p className="text-muted-foreground mt-2">
          Track likes, comments, and shares across your blog posts
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalLikes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalComments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Share Clicks</CardTitle>
            <Share2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalShares}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.summary.totalLikes +
                data.summary.totalComments +
                data.summary.totalShares}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Engagement Table */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement by Post</CardTitle>
        </CardHeader>
        <CardContent>
          <BlogEngagementTable posts={data.posts} />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity activity={data.recentActivity} />
        </CardContent>
      </Card>
    </div>
  )
}
