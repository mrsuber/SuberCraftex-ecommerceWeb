'use client'

import { useState } from 'react'
import { HeroBanner } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Edit, MoreHorizontal, Trash, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'

interface HeroBannersTableProps {
  banners: HeroBanner[]
}

export function HeroBannersTable({ banners: initialBanners }: HeroBannersTableProps) {
  const [banners, setBanners] = useState(initialBanners)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const filteredBanners = banners.filter(
    (banner) =>
      banner.title.toLowerCase().includes(search.toLowerCase()) ||
      banner.type.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/hero-banners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })

      if (response.ok) {
        const updated = await response.json()
        setBanners(banners.map((b) => (b.id === id ? updated : b)))
        toast({
          title: 'Success',
          description: `Banner ${!isActive ? 'activated' : 'deactivated'} successfully`,
        })
      } else {
        throw new Error('Failed to update banner')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update banner status',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const response = await fetch(`/api/hero-banners/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setBanners(banners.filter((b) => b.id !== id))
        toast({
          title: 'Success',
          description: 'Banner deleted successfully',
        })
      } else {
        throw new Error('Failed to delete banner')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete banner',
        variant: 'destructive',
      })
    }
  }

  const getBannerTypeColor = (type: string) => {
    switch (type) {
      case 'advertisement':
        return 'bg-purple-500/10 text-purple-500'
      case 'new_product':
        return 'bg-blue-500/10 text-blue-500'
      case 'new_service':
        return 'bg-green-500/10 text-green-500'
      case 'promotion':
        return 'bg-orange-500/10 text-orange-500'
      case 'announcement':
        return 'bg-yellow-500/10 text-yellow-500'
      case 'upcoming':
        return 'bg-pink-500/10 text-pink-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search banners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {filteredBanners.length} banner{filteredBanners.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBanners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No banners found
                </TableCell>
              </TableRow>
            ) : (
              filteredBanners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="font-medium">{banner.order}</TableCell>
                  <TableCell>
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="h-12 w-20 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{banner.title}</div>
                      {banner.subtitle && (
                        <div className="text-sm text-muted-foreground">{banner.subtitle}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getBannerTypeColor(banner.type)}>
                      {banner.type.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                      {banner.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {banner.start_date && (
                        <div>From: {format(new Date(banner.start_date), 'MMM d, yyyy')}</div>
                      )}
                      {banner.end_date && (
                        <div>To: {format(new Date(banner.end_date), 'MMM d, yyyy')}</div>
                      )}
                      {!banner.start_date && !banner.end_date && (
                        <div className="text-muted-foreground">Always</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(banner.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/hero-banners/${banner.id}/edit`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleActive(banner.id, banner.is_active)}>
                          {banner.is_active ? (
                            <>
                              <EyeOff className="mr-2 h-4 w-4" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <Eye className="mr-2 h-4 w-4" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(banner.id)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
