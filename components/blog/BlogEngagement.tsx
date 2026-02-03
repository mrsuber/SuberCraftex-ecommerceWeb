'use client'

import { useEffect, useState } from 'react'
import { LikeButton } from './LikeButton'
import { CommentSection } from './CommentSection'
import { ShareButton } from './ShareButton'
import { Separator } from '@/components/ui/separator'

interface BlogEngagementProps {
  postId: string
  postTitle: string
  postSlug: string
}

interface EngagementData {
  likes: {
    count: number
    hasLiked: boolean
  }
  comments: {
    count: number
  }
  shares: {
    count: number
  }
  isAuthenticated: boolean
  currentUserId?: string
}

export function BlogEngagement({
  postId,
  postTitle,
  postSlug,
}: BlogEngagementProps) {
  const [engagement, setEngagement] = useState<EngagementData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEngagement = async () => {
      try {
        const response = await fetch(`/api/blog/${postId}/engagement`, {
          credentials: 'include',
        })
        const data = await response.json()
        if (response.ok) {
          setEngagement(data)
        }
      } catch (error) {
        console.error('Error fetching engagement:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEngagement()
  }, [postId])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Separator />
        <div className="flex items-center gap-4 animate-pulse">
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!engagement) {
    return null
  }

  return (
    <div className="space-y-4">
      <Separator />
      <div className="flex items-center gap-4 flex-wrap">
        <LikeButton
          postId={postId}
          initialLikeCount={engagement.likes.count}
          initialHasLiked={engagement.likes.hasLiked}
          isAuthenticated={engagement.isAuthenticated}
        />
        <ShareButton
          postId={postId}
          postTitle={postTitle}
          postSlug={postSlug}
          initialShareCount={engagement.shares.count}
        />
      </div>
      <CommentSection
        postId={postId}
        initialCommentCount={engagement.comments.count}
        isAuthenticated={engagement.isAuthenticated}
        currentUserId={engagement.currentUserId}
      />
    </div>
  )
}
