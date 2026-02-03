'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AuthRequiredDialog } from './AuthRequiredDialog'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  postId: string
  initialLikeCount: number
  initialHasLiked: boolean
  isAuthenticated: boolean
}

export function LikeButton({
  postId,
  initialLikeCount,
  initialHasLiked,
  isAuthenticated,
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [hasLiked, setHasLiked] = useState(initialHasLiked)
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/blog/${postId}/like`, {
        method: hasLiked ? 'DELETE' : 'POST',
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        setLikeCount(data.likeCount)
        setHasLiked(data.hasLiked)
      } else if (data.requiresAuth) {
        setShowAuthDialog(true)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLoading}
        className={cn(
          'flex items-center gap-2 transition-colors',
          hasLiked && 'text-red-500 hover:text-red-600'
        )}
      >
        <Heart
          className={cn('h-5 w-5', hasLiked && 'fill-current')}
        />
        <span>{likeCount}</span>
      </Button>

      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        action="like"
      />
    </>
  )
}
