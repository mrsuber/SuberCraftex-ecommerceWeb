"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { ServiceCategory } from "@/types";

interface ServiceFormProps {
  categories: ServiceCategory[];
  service?: any;
}

export function ServiceForm({ categories, service }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>(service?.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [tags, setTags] = useState<string[]>(service?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [durationType, setDurationType] = useState(service?.duration || "one_hour");

  const isEdit = !!service;

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImages([...images, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const { url } = await response.json();
      setImages([...images, url]);

      e.target.value = '';
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const categoryId = formData.get("categoryId") as string;
    const duration = formData.get("duration") as string;

    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      sku: formData.get("sku") as string,
      description: formData.get("description") as string || null,
      shortDescription: formData.get("shortDescription") as string || null,
      price: parseFloat(formData.get("price") as string),
      compareAtPrice: formData.get("compareAtPrice")
        ? parseFloat(formData.get("compareAtPrice") as string)
        : null,
      categoryId: categoryId,
      duration: duration,
      customDuration: duration === "custom"
        ? parseInt(formData.get("customDuration") as string) || null
        : null,
      bufferTime: parseInt(formData.get("bufferTime") as string) || 0,
      maxBookingsPerDay: formData.get("maxBookingsPerDay")
        ? parseInt(formData.get("maxBookingsPerDay") as string)
        : null,
      isActive: formData.get("isActive") === "on",
      isFeatured: formData.get("isFeatured") === "on",
      images: images,
      featuredImage: images[0] || null,
      tags: tags,
      seoTitle: formData.get("seoTitle") as string || null,
      seoDescription: formData.get("seoDescription") as string || null,
    };

    try {
      const url = isEdit ? `/api/services/${service.id}` : "/api/services";
      const method = isEdit ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save service");
      }

      router.push("/dashboard/services");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={service?.name}
                placeholder="Enter service name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                defaultValue={service?.sku}
                placeholder="SRV-001"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={service?.slug}
              placeholder="service-name-slug"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short Description</Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              defaultValue={service?.shortDescription}
              placeholder="Brief description for listings..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={service?.description}
              placeholder="Detailed service description..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category *</Label>
            <Select name="categoryId" defaultValue={service?.categoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                defaultValue={service?.price}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="compareAtPrice">Compare at Price</Label>
              <Input
                id="compareAtPrice"
                name="compareAtPrice"
                type="number"
                step="0.01"
                defaultValue={service?.compareAtPrice}
                placeholder="0.00"
              />
              <p className="text-xs text-muted-foreground">
                Show a discount by setting this higher than the price
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duration & Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle>Duration & Scheduling</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Select
                name="duration"
                defaultValue={service?.duration || "one_hour"}
                onValueChange={(value) => setDurationType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="half_hour">30 minutes</SelectItem>
                  <SelectItem value="one_hour">1 hour</SelectItem>
                  <SelectItem value="two_hours">2 hours</SelectItem>
                  <SelectItem value="half_day">Half day (4 hours)</SelectItem>
                  <SelectItem value="full_day">Full day (8 hours)</SelectItem>
                  <SelectItem value="custom">Custom duration</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {durationType === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customDuration">Custom Duration (minutes) *</Label>
                <Input
                  id="customDuration"
                  name="customDuration"
                  type="number"
                  defaultValue={service?.customDuration}
                  placeholder="90"
                  required={durationType === "custom"}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bufferTime">Buffer Time (minutes)</Label>
              <Input
                id="bufferTime"
                name="bufferTime"
                type="number"
                defaultValue={service?.bufferTime || 0}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Time between bookings for preparation/cleanup
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxBookingsPerDay">Max Bookings Per Day</Label>
              <Input
                id="maxBookingsPerDay"
                name="maxBookingsPerDay"
                type="number"
                defaultValue={service?.maxBookingsPerDay}
                placeholder="No limit"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty for unlimited bookings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* File Upload */}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading || loading}
                className="cursor-pointer"
              />
              {uploading && (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <Input
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste image URL: https://example.com/image.jpg"
                disabled={uploading || loading}
              />
              <Button
                type="button"
                onClick={handleAddImage}
                variant="outline"
                disabled={uploading || loading}
              >
                <Upload className="h-4 w-4 mr-2" />
                Add URL
              </Button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square relative border rounded-lg overflow-hidden">
                    <Image
                      src={url}
                      alt={`Service image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag (e.g., custom, repair, installation)"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              variant="outline"
              disabled={loading}
            >
              Add Tag
            </Button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive ml-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              name="seoTitle"
              defaultValue={service?.seoTitle}
              placeholder="Service Name | SuberCraftex Services"
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 50-60 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              defaultValue={service?.seoDescription}
              placeholder="Brief description for search engines..."
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Recommended: 150-160 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              name="isActive"
              defaultChecked={service?.isActive ?? true}
            />
            <Label htmlFor="isActive">Active (visible to customers)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isFeatured"
              name="isFeatured"
              defaultChecked={service?.isFeatured ?? false}
            />
            <Label htmlFor="isFeatured">Featured service</Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Update Service" : "Create Service"}
        </Button>
      </div>
    </form>
  );
}
