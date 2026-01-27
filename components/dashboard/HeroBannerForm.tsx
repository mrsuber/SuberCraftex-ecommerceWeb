'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { HeroBanner, BannerType } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Loader2, Upload, X, ImageIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface HeroBannerFormProps {
  banner?: HeroBanner
}

export function HeroBannerForm({ banner }: HeroBannerFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [uploadingDesktop, setUploadingDesktop] = useState(false)
  const [uploadingMobile, setUploadingMobile] = useState(false)
  const desktopFileRef = useRef<HTMLInputElement>(null)
  const mobileFileRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: banner?.title || '',
    subtitle: banner?.subtitle || '',
    description: banner?.description || '',
    type: (banner?.type || 'announcement') as BannerType,
    imageUrl: banner?.image_url || '',
    mobileImageUrl: banner?.mobile_image_url || '',
    ctaText: banner?.cta_text || '',
    ctaLink: banner?.cta_link || '',
    ctaStyle: banner?.cta_style || 'primary',
    backgroundColor: banner?.background_color || '#000000',
    textColor: banner?.text_color || '#ffffff',
    order: banner?.order || 0,
    isActive: banner?.is_active ?? true,
    startDate: banner?.start_date ? banner.start_date.split('T')[0] : '',
    endDate: banner?.end_date ? banner.end_date.split('T')[0] : '',
  })

  const handleImageUpload = async (file: File, type: 'desktop' | 'mobile') => {
    const setUploading = type === 'desktop' ? setUploadingDesktop : setUploadingMobile

    try {
      setUploading(true)

      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('type', 'banner')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload image')
      }

      const data = await response.json()

      if (type === 'desktop') {
        setFormData(prev => ({ ...prev, imageUrl: data.url }))
      } else {
        setFormData(prev => ({ ...prev, mobileImageUrl: data.url }))
      }

      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file, type)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = banner
        ? `/api/hero-banners/${banner.id}`
        : '/api/hero-banners'

      const method = banner ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save banner')
      }

      toast({
        title: 'Success',
        description: `Banner ${banner ? 'updated' : 'created'} successfully`,
      })

      router.push('/dashboard/hero-banners')
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save banner',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Banner Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter banner title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Enter banner subtitle"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter banner description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Banner Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as BannerType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advertisement">Advertisement</SelectItem>
                  <SelectItem value="new_product">New Product</SelectItem>
                  <SelectItem value="new_service">New Service</SelectItem>
                  <SelectItem value="promotion">Promotion</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Desktop Image */}
          <div className="space-y-3">
            <Label>Desktop Image *</Label>
            <div className="flex gap-3">
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/banner.jpg or upload below"
                className="flex-1"
              />
              <input
                ref={desktopFileRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'desktop')}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => desktopFileRef.current?.click()}
                disabled={uploadingDesktop}
              >
                {uploadingDesktop ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span className="ml-2">Upload</span>
              </Button>
            </div>
            {formData.imageUrl && (
              <div className="relative w-full max-w-md rounded-lg overflow-hidden border bg-muted">
                <div className="aspect-[16/9] relative">
                  <Image
                    src={formData.imageUrl}
                    alt="Desktop banner preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => setFormData({ ...formData, imageUrl: '' })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {!formData.imageUrl && (
              <div
                className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => desktopFileRef.current?.click()}
              >
                <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload desktop image</p>
                <p className="text-xs text-muted-foreground">Recommended: 1920x600 or 16:5 ratio</p>
              </div>
            )}
          </div>

          {/* Mobile Image */}
          <div className="space-y-3">
            <Label>Mobile Image (Optional)</Label>
            <div className="flex gap-3">
              <Input
                id="mobileImageUrl"
                value={formData.mobileImageUrl}
                onChange={(e) => setFormData({ ...formData, mobileImageUrl: e.target.value })}
                placeholder="https://example.com/banner-mobile.jpg or upload below"
                className="flex-1"
              />
              <input
                ref={mobileFileRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'mobile')}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => mobileFileRef.current?.click()}
                disabled={uploadingMobile}
              >
                {uploadingMobile ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                <span className="ml-2">Upload</span>
              </Button>
            </div>
            {formData.mobileImageUrl && (
              <div className="relative w-full max-w-xs rounded-lg overflow-hidden border bg-muted">
                <div className="aspect-[9/16] relative">
                  <Image
                    src={formData.mobileImageUrl}
                    alt="Mobile banner preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => setFormData({ ...formData, mobileImageUrl: '' })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              If not provided, desktop image will be used. Recommended: 640x800 or 4:5 ratio
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ctaText">Button Text</Label>
              <Input
                id="ctaText"
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                placeholder="Shop Now"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaLink">Button Link</Label>
              <Input
                id="ctaLink"
                value={formData.ctaLink}
                onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                placeholder="/products"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaStyle">Button Style</Label>
            <Select
              value={formData.ctaStyle}
              onValueChange={(value) => setFormData({ ...formData, ctaStyle: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary</SelectItem>
                <SelectItem value="secondary">Secondary</SelectItem>
                <SelectItem value="outline">Outline</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Styling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.backgroundColor}
                  onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textColor">Text Color</Label>
              <div className="flex gap-2">
                <Input
                  id="textColor"
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={formData.textColor}
                  onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scheduling & Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isActive">Active</Label>
              <p className="text-sm text-muted-foreground">Display this banner on the website</p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date (Optional)</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Leave dates empty for always active. Banner will only show between these dates when set.
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {banner ? 'Update' : 'Create'} Banner
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
