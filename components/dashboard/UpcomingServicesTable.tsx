'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UpcomingService } from '@/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Pencil, Trash2, Search, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDistanceToNow, format, isPast } from 'date-fns'

interface UpcomingServicesTableProps {
  upcomingServices: UpcomingService[]
}

export function UpcomingServicesTable({ upcomingServices }: UpcomingServicesTableProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = upcomingServices.filter((service) =>
    service.title.toLowerCase().includes(search.toLowerCase()) ||
    service.location?.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)

    try {
      const response = await fetch(`/api/upcoming-services/${deleteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete')
      }

      toast({
        title: 'Deleted',
        description: 'Upcoming service deleted successfully',
      })
      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to delete upcoming service',
        variant: 'destructive',
      })
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const handleToggleActive = async (service: UpcomingService) => {
    try {
      const response = await fetch(`/api/upcoming-services/${service.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !service.is_active }),
      })

      if (!response.ok) {
        throw new Error('Failed to update')
      }

      toast({
        title: 'Updated',
        description: `Service ${service.is_active ? 'deactivated' : 'activated'}`,
      })
      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update service',
        variant: 'destructive',
      })
    }
  }

  const getCountdownText = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isPast(date)) {
      return 'Launched'
    }
    return formatDistanceToNow(date, { addSuffix: false })
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search upcoming services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Service Date</TableHead>
              <TableHead>Countdown</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No upcoming services found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {service.image_url && (
                        <img
                          src={service.image_url}
                          alt={service.title}
                          className="h-10 w-10 rounded object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium">{service.title}</div>
                        {service.short_description && (
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {service.short_description}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(service.service_date), 'MMM d, yyyy h:mm a')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className={isPast(new Date(service.service_date)) ? 'text-green-600' : 'text-orange-600'}>
                        {getCountdownText(service.service_date)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{service.location || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={service.is_active ? 'default' : 'secondary'}
                      className="cursor-pointer"
                      onClick={() => handleToggleActive(service)}
                    >
                      {service.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/upcoming-services/${service.id}/edit`)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(service.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
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

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Upcoming Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this upcoming service? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
