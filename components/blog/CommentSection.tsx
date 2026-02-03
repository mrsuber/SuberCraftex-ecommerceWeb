'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, Send, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AuthRequiredDialog } from './AuthRequiredDialog'
import { formatDistanceToNow } from 'date-fns'

interface Comment {
  id: string
  content: string
  created_at: string
  user: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  }
}

interface CommentSectionProps {
  postId: string
  initialCommentCount: number
  isAuthenticated: boolean
  currentUserId?: string
}

export function CommentSection({
  postId,
  initialCommentCount,
  isAuthenticated,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isExpanded && comments.length === 0) {
      fetchComments()
    }
  }, [isExpanded])

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/blog/${postId}/comment`)
      const data = await response.json()
      if (response.ok) {
        setComments(data.comments)
        setCommentCount(data.commentCount)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true)
      return
    }

    if (!newComment.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/blog/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newComment }),
      })

      const data = await response.json()

      if (response.ok) {
        setComments([data.comment, ...comments])
        setCommentCount(data.commentCount)
        setNewComment('')
      } else if (data.requiresAuth) {
        setShowAuthDialog(true)
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `/api/blog/${postId}/comment?commentId=${commentId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const data = await response.json()

      if (response.ok) {
        setComments(comments.filter((c) => c.id !== commentId))
        setCommentCount(data.commentCount)
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

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

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2"
      >
        <MessageCircle className="h-5 w-5" />
        <span>{commentCount} Comments</span>
      </Button>

      {isExpanded && (
        <div className="space-y-4 border-t pt-4">
          {/* Comment input */}
          <div className="flex gap-2">
            <Textarea
              placeholder={
                isAuthenticated
                  ? 'Write a comment...'
                  : 'Log in to write a comment'
              }
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] flex-1"
              onClick={() => !isAuthenticated && setShowAuthDialog(true)}
            />
            <Button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !newComment.trim()}
              size="icon"
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Comments list */}
          {isLoading ? (
            <div className="text-center text-muted-foreground py-4">
              Loading comments...
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.user.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {getInitials(comment.user.full_name, comment.user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {comment.user.full_name || comment.user.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      {currentUserId === comment.user.id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="ml-auto text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm mt-1 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <AuthRequiredDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        action="comment on"
      />
    </div>
  )
}
