'use client'

import { useState } from 'react'
import { Share2, Check, Copy, Facebook, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ShareButtonProps {
  postId: string
  postTitle: string
  postSlug: string
  initialShareCount: number
}

export function ShareButton({
  postId,
  postTitle,
  postSlug,
  initialShareCount,
}: ShareButtonProps) {
  const [shareCount, setShareCount] = useState(initialShareCount)
  const [copied, setCopied] = useState(false)

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/blog/${postSlug}`
      : `/blog/${postSlug}`

  const recordShare = async () => {
    try {
      const response = await fetch(`/api/blog/${postId}/share`, {
        method: 'POST',
      })
      const data = await response.json()
      if (response.ok) {
        setShareCount(data.shareCount)
      }
    } catch (error) {
      console.error('Error recording share:', error)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      await recordShare()
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Error copying link:', error)
    }
  }

  const handleShareFacebook = () => {
    recordShare()
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const handleShareTwitter = () => {
    recordShare()
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(postTitle)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const handleShareLinkedIn = () => {
    recordShare()
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    )
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          url: shareUrl,
        })
        await recordShare()
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error)
        }
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          <span>{shareCount}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          {copied ? (
            <Check className="mr-2 h-4 w-4 text-green-500" />
          ) : (
            <Copy className="mr-2 h-4 w-4" />
          )}
          {copied ? 'Copied!' : 'Copy Link'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareFacebook}>
          <Facebook className="mr-2 h-4 w-4 text-blue-600" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareTwitter}>
          <Twitter className="mr-2 h-4 w-4 text-sky-500" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShareLinkedIn}>
          <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
          LinkedIn
        </DropdownMenuItem>
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share...
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
