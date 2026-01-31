'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Upload,
  GripVertical,
  Image as ImageIcon,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react'

interface DesignOption {
  id: string
  categoryId: string
  name: string
  imageUrl: string
  description: string | null
  sortOrder: number
  isActive: boolean
  createdAt: string
}

interface DesignCategory {
  id: string
  serviceId: string
  name: string
  description: string | null
  sortOrder: number
  isRequired: boolean
  createdAt: string
  updatedAt: string
  options: DesignOption[]
}

interface ServiceDesignGalleryProps {
  serviceId: string
  serviceName: string
}

export function ServiceDesignGallery({ serviceId, serviceName }: ServiceDesignGalleryProps) {
  const [categories, setCategories] = useState<DesignCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // New category form
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDescription, setNewCategoryDescription] = useState('')
  const [newCategoryRequired, setNewCategoryRequired] = useState(true)
  const [savingCategory, setSavingCategory] = useState(false)

  // Edit category
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editCategoryName, setEditCategoryName] = useState('')
  const [editCategoryDescription, setEditCategoryDescription] = useState('')
  const [editCategoryRequired, setEditCategoryRequired] = useState(true)

  // New option form
  const [addingOptionToCategoryId, setAddingOptionToCategoryId] = useState<string | null>(null)
  const [newOptionName, setNewOptionName] = useState('')
  const [newOptionDescription, setNewOptionDescription] = useState('')
  const [newOptionImageUrl, setNewOptionImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [savingOption, setSavingOption] = useState(false)

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`/api/services/${serviceId}/design-categories`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setCategories(data)
    } catch (err) {
      setError('Failed to load design categories')
    } finally {
      setLoading(false)
    }
  }, [serviceId])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return
    setSavingCategory(true)

    try {
      const response = await fetch(`/api/services/${serviceId}/design-categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription || null,
          isRequired: newCategoryRequired,
          sortOrder: categories.length,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error)
      }

      setNewCategoryName('')
      setNewCategoryDescription('')
      setNewCategoryRequired(true)
      setShowNewCategory(false)
      await fetchCategories()
    } catch (err: any) {
      setError(err.message || 'Failed to create category')
    } finally {
      setSavingCategory(false)
    }
  }

  const handleUpdateCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `/api/services/${serviceId}/design-categories/${categoryId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: editCategoryName,
            description: editCategoryDescription || null,
            isRequired: editCategoryRequired,
          }),
        }
      )

      if (!response.ok) throw new Error('Failed to update')
      setEditingCategoryId(null)
      await fetchCategories()
    } catch (err) {
      setError('Failed to update category')
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Delete this category and all its options?')) return

    try {
      const response = await fetch(
        `/api/services/${serviceId}/design-categories/${categoryId}`,
        { method: 'DELETE' }
      )
      if (!response.ok) throw new Error('Failed to delete')
      await fetchCategories()
    } catch (err) {
      setError('Failed to delete category')
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'design-option')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      setNewOptionImageUrl(data.url)
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleCreateOption = async (categoryId: string) => {
    if (!newOptionName.trim() || !newOptionImageUrl) return
    setSavingOption(true)

    try {
      const category = categories.find((c) => c.id === categoryId)
      const response = await fetch(
        `/api/services/${serviceId}/design-categories/${categoryId}/options`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newOptionName,
            imageUrl: newOptionImageUrl,
            description: newOptionDescription || null,
            sortOrder: category?.options.length ?? 0,
          }),
        }
      )

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.error)
      }

      setNewOptionName('')
      setNewOptionDescription('')
      setNewOptionImageUrl('')
      setAddingOptionToCategoryId(null)
      await fetchCategories()
    } catch (err: any) {
      setError(err.message || 'Failed to create option')
    } finally {
      setSavingOption(false)
    }
  }

  const handleToggleOption = async (categoryId: string, option: DesignOption) => {
    try {
      await fetch(
        `/api/services/${serviceId}/design-categories/${categoryId}/options/${option.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !option.isActive }),
        }
      )
      await fetchCategories()
    } catch (err) {
      setError('Failed to toggle option')
    }
  }

  const handleDeleteOption = async (categoryId: string, optionId: string) => {
    if (!confirm('Delete this design option?')) return

    try {
      await fetch(
        `/api/services/${serviceId}/design-categories/${categoryId}/options/${optionId}`,
        { method: 'DELETE' }
      )
      await fetchCategories()
    } catch (err) {
      setError('Failed to delete option')
    }
  }

  const startEditCategory = (cat: DesignCategory) => {
    setEditingCategoryId(cat.id)
    setEditCategoryName(cat.name)
    setEditCategoryDescription(cat.description || '')
    setEditCategoryRequired(cat.isRequired)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Design Options</h2>
          <p className="text-muted-foreground">
            Manage design categories and options for {serviceName}
          </p>
        </div>
        <Button onClick={() => setShowNewCategory(true)} disabled={showNewCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => setError(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </Alert>
      )}

      {/* New Category Form */}
      {showNewCategory && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle>New Design Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Collar Type, Pocket Style"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Optional description for customers"
                rows={2}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="newCatRequired"
                checked={newCategoryRequired}
                onChange={(e) => setNewCategoryRequired(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="newCatRequired">
                Required (customer must select at least one option)
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim() || savingCategory}>
                {savingCategory ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create Category
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewCategory(false)
                  setNewCategoryName('')
                  setNewCategoryDescription('')
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      {categories.length === 0 && !showNewCategory && (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No design categories yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Add categories like "Collar Type" or "Pocket Style" with visual options
            </p>
          </CardContent>
        </Card>
      )}

      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              {editingCategoryId === category.id ? (
                <div className="flex-1 space-y-3">
                  <Input
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                  <Textarea
                    value={editCategoryDescription}
                    onChange={(e) => setEditCategoryDescription(e.target.value)}
                    placeholder="Description"
                    rows={2}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editCategoryRequired}
                      onChange={(e) => setEditCategoryRequired(e.target.checked)}
                      className="rounded"
                    />
                    <Label>Required</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleUpdateCategory(category.id)}>
                      <Check className="w-4 h-4 mr-1" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingCategoryId(null)}>
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {category.name}
                      {category.isRequired && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                    </CardTitle>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {category.options.length} option{category.options.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => startEditCategory(category)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {category.options.map((option) => (
                <div
                  key={option.id}
                  className={`relative group border rounded-lg overflow-hidden ${
                    !option.isActive ? 'opacity-50' : ''
                  }`}
                >
                  <div className="aspect-square bg-muted">
                    <img
                      src={option.imageUrl}
                      alt={option.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{option.name}</p>
                    {option.description && (
                      <p className="text-xs text-muted-foreground truncate">{option.description}</p>
                    )}
                  </div>
                  {/* Hover actions */}
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 w-7 p-0"
                      onClick={() => handleToggleOption(category.id, option)}
                      title={option.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {option.isActive ? (
                        <EyeOff className="w-3 h-3" />
                      ) : (
                        <Eye className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-7 w-7 p-0 text-destructive"
                      onClick={() => handleDeleteOption(category.id, option.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  {!option.isActive && (
                    <Badge variant="secondary" className="absolute top-1 left-1 text-xs">
                      Hidden
                    </Badge>
                  )}
                </div>
              ))}

              {/* Add Option Button */}
              {addingOptionToCategoryId !== category.id && (
                <button
                  onClick={() => {
                    setAddingOptionToCategoryId(category.id)
                    setNewOptionName('')
                    setNewOptionDescription('')
                    setNewOptionImageUrl('')
                  }}
                  className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-xs">Add Option</span>
                </button>
              )}
            </div>

            {/* Add Option Form */}
            {addingOptionToCategoryId === category.id && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50 space-y-4">
                <h4 className="font-medium">Add New Option</h4>

                <div className="space-y-2">
                  <Label>Image *</Label>
                  {newOptionImageUrl ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                      <img
                        src={newOptionImageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => setNewOptionImageUrl('')}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                      {uploadingImage ? (
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground mt-1">Upload</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file)
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Option Name *</Label>
                  <Input
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    placeholder="e.g., Mandarin Collar"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description (optional)</Label>
                  <Input
                    value={newOptionDescription}
                    onChange={(e) => setNewOptionDescription(e.target.value)}
                    placeholder="Brief description"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleCreateOption(category.id)}
                    disabled={!newOptionName.trim() || !newOptionImageUrl || savingOption}
                  >
                    {savingOption ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Add Option
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAddingOptionToCategoryId(null)
                      setNewOptionName('')
                      setNewOptionDescription('')
                      setNewOptionImageUrl('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
