'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, Eye, ChevronDown, ChevronUp } from 'lucide-react'

interface EngagementPost {
  id: string
  title: string
  slug: string
  status: string
  published_at: string | null
  likes_count: number
  comments_count: number
  shares_count: number
  total_engagement: number
}

interface BlogEngagementTableProps {
  posts: EngagementPost[]
}

type SortField = 'title' | 'likes_count' | 'comments_count' | 'shares_count' | 'total_engagement'
type SortOrder = 'asc' | 'desc'

export function BlogEngagementTable({ posts }: BlogEngagementTableProps) {
  const [sortField, setSortField] = useState<SortField>('total_engagement')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const sortedPosts = [...posts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    return sortOrder === 'asc'
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number)
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="default" className="bg-green-600">Published</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      case 'archived':
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No blog posts found
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('title')}
          >
            Post <SortIcon field="title" />
          </TableHead>
          <TableHead>Status</TableHead>
          <TableHead
            className="text-center cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('likes_count')}
          >
            <Heart className="h-4 w-4 inline mr-1 text-red-500" />
            Likes <SortIcon field="likes_count" />
          </TableHead>
          <TableHead
            className="text-center cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('comments_count')}
          >
            <MessageCircle className="h-4 w-4 inline mr-1 text-blue-500" />
            Comments <SortIcon field="comments_count" />
          </TableHead>
          <TableHead
            className="text-center cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('shares_count')}
          >
            <Share2 className="h-4 w-4 inline mr-1 text-green-500" />
            Shares <SortIcon field="shares_count" />
          </TableHead>
          <TableHead
            className="text-center cursor-pointer hover:bg-muted/50"
            onClick={() => handleSort('total_engagement')}
          >
            Total <SortIcon field="total_engagement" />
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedPosts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium max-w-[300px] truncate">
              {post.title}
            </TableCell>
            <TableCell>{getStatusBadge(post.status)}</TableCell>
            <TableCell className="text-center">{post.likes_count}</TableCell>
            <TableCell className="text-center">{post.comments_count}</TableCell>
            <TableCell className="text-center">{post.shares_count}</TableCell>
            <TableCell className="text-center font-semibold">
              {post.total_engagement}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link href={`/dashboard/blog/engagement/${post.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Details
                  </Button>
                </Link>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
