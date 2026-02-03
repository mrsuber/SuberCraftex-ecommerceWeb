'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Heart, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface User {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
}

interface Post {
  id: string
  title: string
  slug: string
}

interface LikeActivity {
  type: 'like'
  user: User
  post: Post
  created_at: string
}

interface CommentActivity {
  type: 'comment'
  id: string
  content: string
  user: User
  post: Post
  created_at: string
}

interface RecentActivityProps {
  activity: {
    likes: LikeActivity[]
    comments: CommentActivity[]
  }
}

export function RecentActivity({ activity }: RecentActivityProps) {
  const getInitials = (name: string | null, email: string) => {
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

  const allActivity = [
    ...activity.likes.map((like) => ({ ...like, sortDate: new Date(like.created_at) })),
    ...activity.comments.map((comment) => ({ ...comment, sortDate: new Date(comment.created_at) })),
  ].sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime())

  const ActivityItem = ({ item }: { item: LikeActivity | CommentActivity }) => (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <Avatar className="h-8 w-8">
        <AvatarImage src={item.user.avatar_url || undefined} />
        <AvatarFallback className="text-xs">
          {getInitials(item.user.full_name, item.user.email)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">
            {item.user.full_name || item.user.email}
          </span>
          {item.type === 'like' ? (
            <Badge variant="outline" className="text-red-500 border-red-200">
              <Heart className="h-3 w-3 mr-1 fill-current" />
              Liked
            </Badge>
          ) : (
            <Badge variant="outline" className="text-blue-500 border-blue-200">
              <MessageCircle className="h-3 w-3 mr-1" />
              Commented
            </Badge>
          )}
        </div>
        <Link
          href={`/blog/${item.post.slug}`}
          className="text-sm text-muted-foreground hover:text-primary truncate block"
        >
          {item.post.title}
        </Link>
        {item.type === 'comment' && (
          <p className="text-sm mt-1 text-gray-600 line-clamp-2">
            "{(item as CommentActivity).content}"
          </p>
        )}
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  )

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList>
        <TabsTrigger value="all">All Activity</TabsTrigger>
        <TabsTrigger value="likes">
          <Heart className="h-4 w-4 mr-1" />
          Likes ({activity.likes.length})
        </TabsTrigger>
        <TabsTrigger value="comments">
          <MessageCircle className="h-4 w-4 mr-1" />
          Comments ({activity.comments.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-4">
        {allActivity.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="divide-y">
            {allActivity.slice(0, 20).map((item, index) => (
              <ActivityItem key={`${item.type}-${index}`} item={item} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="likes" className="mt-4">
        {activity.likes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent likes
          </div>
        ) : (
          <div className="divide-y">
            {activity.likes.map((like, index) => (
              <ActivityItem key={`like-${index}`} item={like} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="comments" className="mt-4">
        {activity.comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent comments
          </div>
        ) : (
          <div className="divide-y">
            {activity.comments.map((comment, index) => (
              <ActivityItem key={`comment-${index}`} item={comment} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
