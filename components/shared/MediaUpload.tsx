'use client'

import { useState, useCallback, useId } from 'react'
import { Upload, X, Image as ImageIcon, Video, Loader2, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MediaUploadProps {
  images: string[]
  videos: string[]
  onImagesChange: (urls: string[]) => void
  onVideosChange: (urls: string[]) => void
  maxImages?: number
  maxVideos?: number
  maxImageSizeInMB?: number
  maxVideoSizeInMB?: number
  disabled?: boolean
  className?: string
}

interface UploadingFile {
  file: File
  progress: number
  preview: string
  error?: string
  type: 'image' | 'video'
}

export function MediaUpload({
  images = [],
  videos = [],
  onImagesChange,
  onVideosChange,
  maxImages = 5,
  maxVideos = 2,
  maxImageSizeInMB = 5,
  maxVideoSizeInMB = 50,
  disabled = false,
  className,
}: MediaUploadProps) {
  const uploadId = useId()
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'feedback')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Upload failed')
    }

    const data = await response.json()
    return data.url
  }

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const filesArray = Array.from(files)

      const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/mov']
      const maxImageSizeInBytes = maxImageSizeInMB * 1024 * 1024
      const maxVideoSizeInBytes = maxVideoSizeInMB * 1024 * 1024

      const validFiles: UploadingFile[] = []

      for (const file of filesArray) {
        const isImage = imageTypes.includes(file.type)
        const isVideo = videoTypes.includes(file.type) || file.type.startsWith('video/')

        if (!isImage && !isVideo) {
          alert(`${file.name} is not a valid image or video file`)
          continue
        }

        if (isImage) {
          if (images.length + validFiles.filter(f => f.type === 'image').length >= maxImages) {
            alert(`Maximum ${maxImages} images allowed`)
            continue
          }
          if (file.size > maxImageSizeInBytes) {
            alert(`${file.name} exceeds ${maxImageSizeInMB}MB limit for images`)
            continue
          }
        }

        if (isVideo) {
          if (videos.length + validFiles.filter(f => f.type === 'video').length >= maxVideos) {
            alert(`Maximum ${maxVideos} videos allowed`)
            continue
          }
          if (file.size > maxVideoSizeInBytes) {
            alert(`${file.name} exceeds ${maxVideoSizeInMB}MB limit for videos`)
            continue
          }
        }

        const preview = URL.createObjectURL(file)
        validFiles.push({
          file,
          progress: 0,
          preview,
          type: isImage ? 'image' : 'video',
        })
      }

      if (validFiles.length === 0) return

      setUploadingFiles((prev) => [...prev, ...validFiles])

      const uploadPromises = validFiles.map(async (uploadingFile) => {
        try {
          const url = await uploadFile(uploadingFile.file)

          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.file === uploadingFile.file ? { ...f, progress: 100 } : f
            )
          )

          return { url, type: uploadingFile.type }
        } catch (error) {
          console.error('Upload error:', error)

          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.file === uploadingFile.file
                ? { ...f, error: error instanceof Error ? error.message : 'Upload failed' }
                : f
            )
          )

          return null
        }
      })

      const results = (await Promise.all(uploadPromises)).filter(
        (result): result is { url: string; type: 'image' | 'video' } => result !== null
      )

      const newImages = results.filter(r => r.type === 'image').map(r => r.url)
      const newVideos = results.filter(r => r.type === 'video').map(r => r.url)

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages])
      }
      if (newVideos.length > 0) {
        onVideosChange([...videos, ...newVideos])
      }

      setTimeout(() => {
        setUploadingFiles([])
      }, 1000)
    },
    [images, videos, maxImages, maxVideos, maxImageSizeInMB, maxVideoSizeInMB, onImagesChange, onVideosChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      if (!disabled) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [disabled, handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onImagesChange(newImages)
  }

  const removeVideo = (index: number) => {
    const newVideos = [...videos]
    newVideos.splice(index, 1)
    onVideosChange(newVideos)
  }

  const removeUploadingFile = (file: File) => {
    setUploadingFiles((prev) => prev.filter((f) => f.file !== file))
  }

  const canUploadMoreImages = images.length + uploadingFiles.filter(f => f.type === 'image').length < maxImages
  const canUploadMoreVideos = videos.length + uploadingFiles.filter(f => f.type === 'video').length < maxVideos
  const canUploadMore = canUploadMoreImages || canUploadMoreVideos

  return (
    <div className={cn('space-y-4', className)}>
      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Screenshots ({images.length}/{maxImages})</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((url, index) => (
              <div key={`img-${index}`} className="relative group aspect-square">
                <img
                  src={url}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Videos Grid */}
      {videos.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Videos ({videos.length}/{maxVideos})</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {videos.map((url, index) => (
              <div key={`vid-${index}`} className="relative group">
                <video
                  src={url}
                  className="w-full aspect-video object-cover rounded-lg border border-gray-200"
                  controls
                />
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeVideo(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="relative aspect-square">
              {uploadingFile.type === 'image' ? (
                <img
                  src={uploadingFile.preview}
                  alt="Uploading"
                  className="w-full h-full object-cover rounded-lg border border-gray-200"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                {uploadingFile.error ? (
                  <div className="text-center p-2">
                    <p className="text-white text-xs mb-2">{uploadingFile.error}</p>
                    <button
                      type="button"
                      onClick={() => removeUploadingFile(uploadingFile.file)}
                      className="text-white text-xs underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : uploadingFile.progress === 100 ? (
                  <div className="text-white text-sm">✓</div>
                ) : (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {canUploadMore && !disabled && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <input
            type="file"
            id={uploadId}
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            disabled={disabled}
          />
          <label htmlFor={uploadId} className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-2">
                {isDragging ? (
                  <Upload className="w-10 h-10 text-primary" />
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <Video className="w-8 h-8 text-gray-400" />
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {isDragging ? (
                  'Drop files here'
                ) : (
                  <>
                    <span className="font-medium text-primary">Click to upload</span> or
                    drag and drop
                  </>
                )}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Images: PNG, JPG, WEBP up to {maxImageSizeInMB}MB ({maxImages - images.length} remaining)</p>
                <p>Videos: MP4, WebM up to {maxVideoSizeInMB}MB ({maxVideos - videos.length} remaining)</p>
              </div>
            </div>
          </label>
        </div>
      )}
    </div>
  )
}
