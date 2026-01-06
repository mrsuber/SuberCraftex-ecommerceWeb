'use client'

import { useState, useCallback, useId } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  value: string[] // Array of photo URLs
  onChange: (urls: string[]) => void
  maxFiles?: number
  maxSizeInMB?: number
  bookingId?: string
  type?: 'requirement' | 'material' | 'progress'
  disabled?: boolean
  className?: string
}

interface UploadingFile {
  file: File
  progress: number
  preview: string
  error?: string
}

export function PhotoUpload({
  value = [],
  onChange,
  maxFiles = 5,
  maxSizeInMB = 5,
  bookingId,
  type = 'requirement',
  disabled = false,
  className,
}: PhotoUploadProps) {
  const uploadId = useId()
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    if (bookingId) {
      formData.append('bookingId', bookingId)
      formData.append('type', type)
    }

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

      // Check total file count
      if (value.length + uploadingFiles.length + filesArray.length > maxFiles) {
        alert(`Maximum ${maxFiles} photos allowed`)
        return
      }

      // Validate file types and sizes
      const validFiles: UploadingFile[] = []
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024

      for (const file of filesArray) {
        if (!allowedTypes.includes(file.type)) {
          alert(`${file.name} is not a valid image type`)
          continue
        }

        if (file.size > maxSizeInBytes) {
          alert(`${file.name} exceeds ${maxSizeInMB}MB limit`)
          continue
        }

        // Create preview
        const preview = URL.createObjectURL(file)
        validFiles.push({
          file,
          progress: 0,
          preview,
        })
      }

      if (validFiles.length === 0) return

      // Add to uploading state
      setUploadingFiles((prev) => [...prev, ...validFiles])

      // Upload files
      const uploadPromises = validFiles.map(async (uploadingFile, index) => {
        try {
          const url = await uploadFile(uploadingFile.file)

          // Update progress
          setUploadingFiles((prev) =>
            prev.map((f) =>
              f.file === uploadingFile.file ? { ...f, progress: 100 } : f
            )
          )

          return url
        } catch (error) {
          console.error('Upload error:', error)

          // Update error state
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

      const uploadedUrls = (await Promise.all(uploadPromises)).filter(
        (url): url is string => url !== null
      )

      // Update value with successful uploads
      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls])
      }

      // Clear uploading state after a brief delay
      setTimeout(() => {
        setUploadingFiles([])
      }, 1000)
    },
    [value, uploadingFiles, maxFiles, maxSizeInMB, bookingId, type, onChange]
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

  const removePhoto = (index: number) => {
    const newValue = [...value]
    newValue.splice(index, 1)
    onChange(newValue)
  }

  const removeUploadingFile = (file: File) => {
    setUploadingFiles((prev) => prev.filter((f) => f.file !== file))
  }

  const canUploadMore = value.length + uploadingFiles.length < maxFiles

  return (
    <div className={cn('space-y-4', className)}>
      {/* Uploaded Photos Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadingFiles.map((uploadingFile, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={uploadingFile.preview}
                alt="Uploading"
                className="w-full h-full object-cover rounded-lg border border-gray-200"
              />
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
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          )}
        >
          <input
            type="file"
            id={uploadId}
            multiple
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
            disabled={disabled}
          />
          <label htmlFor={uploadId} className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              {isDragging ? (
                <Upload className="w-12 h-12 text-primary" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-400" />
              )}
              <p className="text-sm text-gray-600">
                {isDragging ? (
                  'Drop photos here'
                ) : (
                  <>
                    <span className="font-medium text-primary">Click to upload</span> or
                    drag and drop
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, WEBP up to {maxSizeInMB}MB ({maxFiles - value.length} remaining)
              </p>
            </div>
          </label>
        </div>
      )}

      {/* Info text */}
      {value.length > 0 && (
        <p className="text-sm text-gray-500">
          {value.length} of {maxFiles} photos uploaded
        </p>
      )}
    </div>
  )
}
