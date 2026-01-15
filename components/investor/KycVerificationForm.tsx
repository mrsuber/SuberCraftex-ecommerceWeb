'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  Upload,
  Camera,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  User,
  CreditCard,
  Shield,
  Loader2,
  RefreshCw,
  FileImage,
  Trash2,
  Smartphone,
  Info,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'

interface KycVerificationFormProps {
  investor: {
    id: string
    investorNumber: string
    fullName: string
    email: string
    phone: string
    idType: string | null
    idNumber: string | null
    idDocumentUrl: string | null
    idDocumentBackUrl: string | null
    selfieUrl: string | null
    kycStatus: string
    kycSubmittedAt: string | null
    kycRejectionReason: string | null
    isVerified: boolean
  }
}

type IdType = 'national_id' | 'passport' | 'driver_license'

export default function KycVerificationForm({ investor }: KycVerificationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState<string | null>(null)

  // Form state
  const [idType, setIdType] = useState<IdType | ''>(investor.idType as IdType || '')
  const [idNumber, setIdNumber] = useState(investor.idNumber || '')
  const [idDocumentUrl, setIdDocumentUrl] = useState(investor.idDocumentUrl || '')
  const [idDocumentBackUrl, setIdDocumentBackUrl] = useState(investor.idDocumentBackUrl || '')
  const [selfieUrl, setSelfieUrl] = useState(investor.selfieUrl || '')

  // File input refs
  const idFrontInputRef = useRef<HTMLInputElement>(null)
  const idBackInputRef = useRef<HTMLInputElement>(null)
  const selfieInputRef = useRef<HTMLInputElement>(null)

  // Camera state for selfie
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraReady, setCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [selfieMode, setSelfieMode] = useState<'choose' | 'camera' | 'phone'>('choose')

  // KYC status polling state
  const [kycStatus, setKycStatus] = useState(investor.kycStatus)
  const [kycRejectionReason, setKycRejectionReason] = useState(investor.kycRejectionReason)
  const [isVerified, setIsVerified] = useState(investor.isVerified)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  // Poll for KYC status updates when pending
  useEffect(() => {
    if (kycStatus !== 'pending') return

    const pollStatus = async () => {
      try {
        const response = await fetch('/api/investors/kyc')
        if (response.ok) {
          const data = await response.json()
          setKycStatus(data.kycStatus)
          setKycRejectionReason(data.kycRejectionReason)
          setIsVerified(data.isVerified)
          setLastChecked(new Date())

          // If approved, show success and redirect to dashboard
          if (data.kycStatus === 'approved' && data.isVerified) {
            toast.success('Your verification has been approved!')
            setTimeout(() => {
              router.push('/investor/dashboard')
            }, 2000)
          }

          // If rejected, show the reason
          if (data.kycStatus === 'rejected') {
            toast.error('Your verification was rejected. Please review and resubmit.')
          }
        }
      } catch (error) {
        console.error('Error polling KYC status:', error)
      }
    }

    // Initial check
    pollStatus()

    // Poll every 5 seconds
    const interval = setInterval(pollStatus, 5000)

    return () => clearInterval(interval)
  }, [kycStatus, router])

  const idTypeLabels: Record<IdType, string> = {
    national_id: 'National ID Card',
    passport: 'Passport',
    driver_license: "Driver's License",
  }

  const idNumberLabels: Record<IdType, { label: string; placeholder: string }> = {
    national_id: { label: 'ID Number', placeholder: 'Enter your national ID number' },
    passport: { label: 'Passport Number', placeholder: 'Enter your passport number' },
    driver_license: { label: 'License Number', placeholder: 'Enter your driver\'s license number' },
  }

  // Documents that have both front and back
  const hasBackSide: Record<IdType, boolean> = {
    national_id: true,
    passport: false, // Passport only has bio-data page
    driver_license: true,
  }

  const documentLabels: Record<IdType, { front: string; back: string }> = {
    national_id: { front: 'Front of ID Card', back: 'Back of ID Card' },
    passport: { front: 'Bio-data Page (with photo)', back: '' },
    driver_license: { front: 'Front of License', back: 'Back of License' },
  }

  const uploadFile = async (file: File, type: 'id_front' | 'id_back' | 'selfie'): Promise<string> => {
    setIsUploading(type)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/investors/kyc/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      return data.url
    } finally {
      setIsUploading(null)
    }
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'id_front' | 'id_back' | 'selfie',
    setUrl: (url: string) => void
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    try {
      const url = await uploadFile(file, type)
      setUrl(url)
      toast.success('File uploaded successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload file')
    }
  }

  const openCamera = async () => {
    setCameraError(null)
    setCameraReady(false)
    setSelfieMode('camera')

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      })
      setStream(mediaStream)
      setIsCameraOpen(true)
    } catch (error) {
      console.error('Camera error:', error)
      setCameraError('Could not access camera. Please check permissions or use the phone option instead.')
      toast.error('Could not access camera. Please allow camera permissions or use phone option.')
      setSelfieMode('choose')
    }
  }

  // Effect to handle video stream setup when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      const video = videoRef.current
      video.srcObject = stream

      // Handle when video metadata is loaded
      const handleLoadedMetadata = () => {
        video.play()
          .then(() => {
            setCameraReady(true)
          })
          .catch((err) => {
            console.error('Error playing video:', err)
            setCameraError('Failed to start video playback')
          })
      }

      video.addEventListener('loadedmetadata', handleLoadedMetadata)

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }
  }, [stream])

  const closeCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraOpen(false)
    setCameraReady(false)
    setCameraError(null)
    setSelfieMode('choose')
  }, [stream])

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to video dimensions
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return

      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })

      try {
        const url = await uploadFile(file, 'selfie')
        setSelfieUrl(url)
        closeCamera()
        toast.success('Selfie captured and uploaded')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Failed to upload selfie')
      }
    }, 'image/jpeg', 0.9)
  }

  const handleSubmit = async () => {
    // Validation
    if (!idType) {
      toast.error('Please select your ID type')
      return
    }
    if (!idNumber.trim()) {
      toast.error('Please enter your ID number')
      return
    }
    if (!idDocumentUrl) {
      toast.error('Please upload the front of your ID document')
      return
    }
    if (!selfieUrl) {
      toast.error('Please take or upload a selfie')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/investors/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idType,
          idNumber: idNumber.trim(),
          idDocumentUrl,
          idDocumentBackUrl: idDocumentBackUrl || null,
          selfieUrl,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to submit verification')
      }

      toast.success('Verification documents submitted successfully! Please wait while we review your documents.')
      setKycStatus('pending')
      setKycRejectionReason(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit verification')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canEdit = kycStatus === 'not_started' || kycStatus === 'rejected'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Identity Verification</h1>
              <p className="text-gray-600 mt-1">
                Complete KYC verification to access your investor dashboard
              </p>
            </div>
            <Badge
              variant={kycStatus === 'pending' ? 'secondary' : kycStatus === 'approved' ? 'default' : 'outline'}
              className={kycStatus === 'approved' ? 'bg-green-600' : kycStatus === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' : ''}
            >
              {kycStatus === 'not_started' && 'Not Started'}
              {kycStatus === 'pending' && 'Under Review'}
              {kycStatus === 'approved' && 'Approved'}
              {kycStatus === 'rejected' && 'Rejected'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Approved Status - Show success and redirect info */}
        {kycStatus === 'approved' && isVerified && (
          <div className="mb-6">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Verification Approved!</AlertTitle>
              <AlertDescription className="text-green-700">
                Your identity has been verified successfully. Redirecting to your dashboard...
              </AlertDescription>
            </Alert>
            <div className="mt-4 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
            </div>
          </div>
        )}

        {/* Pending Status - Show waiting UI with live updates */}
        {kycStatus === 'pending' && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-blue-900">Verification In Progress</h3>
                  <p className="text-blue-700 mt-2">
                    Your documents have been submitted and are being reviewed by our team.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-500">Submitted</p>
                      <p className="font-medium text-gray-900">
                        {investor.kycSubmittedAt
                          ? new Date(investor.kycSubmittedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Just now'}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium text-blue-600">Under Review</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Est. Time</p>
                      <p className="font-medium text-gray-900">24-48 hours</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-checking for updates</span>
                  {lastChecked && (
                    <span className="text-gray-400">
                      • Last checked: {lastChecked.toLocaleTimeString()}
                    </span>
                  )}
                </div>

                <p className="text-sm text-blue-600">
                  Stay on this page - you&apos;ll be redirected automatically once approved.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rejected Status - Show reason and allow resubmission */}
        {kycStatus === 'rejected' && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">Verification Rejected</AlertTitle>
            <AlertDescription className="text-red-700 space-y-2">
              <p className="font-medium">Reason: {kycRejectionReason || 'Documents did not meet our requirements.'}</p>
              <p>Please review your documents and resubmit. Make sure:</p>
              <ul className="list-disc list-inside ml-2 text-sm">
                <li>Your ID is clear and readable</li>
                <li>All information matches your profile</li>
                <li>Your selfie clearly shows your face</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Only show form section when user can edit (not_started or rejected) */}
        {canEdit && (
          <>
            {/* Information Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Why We Need This
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-2">
                <p>
                  As an investment platform handling financial transactions, we are required to verify the identity of all investors to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Comply with anti-money laundering (AML) regulations</li>
                  <li>Protect your investment account from unauthorized access</li>
                  <li>Ensure the security of all transactions</li>
                  <li>Prevent fraud and identity theft</li>
                </ul>
                <p className="font-medium text-gray-700 mt-4">
                  Your documents are encrypted and stored securely. We never share your information with third parties.
                </p>
              </CardContent>
            </Card>

            {/* Verification Form */}
            <Card>
          <CardHeader>
            <CardTitle>Verification Documents</CardTitle>
            <CardDescription>
              Please provide a valid government-issued ID and a clear selfie
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: ID Type Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">1</span>
                Select ID Type
              </Label>
              <Select
                value={idType}
                onValueChange={(value) => setIdType(value as IdType)}
                disabled={!canEdit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your ID type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national_id">National ID Card</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="driver_license">Driver&apos;s License</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Step 2: ID Number / License Number / Passport Number */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">2</span>
                {idType ? idNumberLabels[idType].label : 'ID / License / Passport Number'}
              </Label>
              <Input
                placeholder={idType ? idNumberLabels[idType].placeholder : 'Select ID type first'}
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                disabled={!canEdit || !idType}
              />
            </div>

            {/* Step 3: ID Document Upload */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">3</span>
                Upload {idType ? idTypeLabels[idType] : 'Document'}
              </Label>

              <div className={`grid grid-cols-1 ${idType && hasBackSide[idType] ? 'md:grid-cols-2' : ''} gap-4`}>
                {/* Front of ID / Main Document */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {idType ? documentLabels[idType].front : 'Document Photo'} <span className="text-red-500">*</span>
                  </p>
                  <input
                    ref={idFrontInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'id_front', setIdDocumentUrl)}
                    disabled={!canEdit}
                  />

                  {idDocumentUrl ? (
                    <div className="relative border-2 border-green-200 bg-green-50 rounded-lg p-2">
                      <img
                        src={idDocumentUrl}
                        alt="ID Document"
                        className="w-full h-40 object-contain rounded"
                      />
                      {canEdit && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setIdDocumentUrl('')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <div className="flex items-center gap-1 mt-2 text-green-700 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Uploaded
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => idFrontInputRef.current?.click()}
                      disabled={!canEdit || isUploading === 'id_front'}
                      className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading === 'id_front' ? (
                        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-600">Click to upload</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Back of ID - Only show for documents with back side */}
                {idType && hasBackSide[idType] && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {documentLabels[idType].back} <span className="text-gray-400">(Recommended)</span>
                    </p>
                    <input
                      ref={idBackInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'id_back', setIdDocumentBackUrl)}
                      disabled={!canEdit}
                    />

                    {idDocumentBackUrl ? (
                      <div className="relative border-2 border-green-200 bg-green-50 rounded-lg p-2">
                        <img
                          src={idDocumentBackUrl}
                          alt="ID Back"
                          className="w-full h-40 object-contain rounded"
                        />
                        {canEdit && (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => setIdDocumentBackUrl('')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                        <div className="flex items-center gap-1 mt-2 text-green-700 text-sm">
                          <CheckCircle2 className="h-4 w-4" />
                          Uploaded
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => idBackInputRef.current?.click()}
                        disabled={!canEdit || isUploading === 'id_back'}
                        className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading === 'id_back' ? (
                          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                        ) : (
                          <>
                            <FileImage className="h-8 w-8 text-gray-400" />
                            <span className="text-sm text-gray-600">Click to upload back</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Step 4: Selfie */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">4</span>
                Take a Selfie <span className="text-red-500">*</span>
              </Label>

              <input
                ref={selfieInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="user"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'selfie', setSelfieUrl)}
                disabled={!canEdit}
              />

              {/* Selfie already uploaded */}
              {selfieUrl ? (
                <div className="relative border-2 border-green-200 bg-green-50 rounded-lg p-2 max-w-xs">
                  <img
                    src={selfieUrl}
                    alt="Selfie"
                    className="w-full h-48 object-cover rounded"
                  />
                  {canEdit && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setSelfieUrl('')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="flex items-center gap-1 mt-2 text-green-700 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Selfie uploaded
                  </div>
                </div>
              ) : selfieMode === 'choose' ? (
                /* Mode Selection */
                <div className="space-y-4">
                  {/* Selfie Guidelines */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <h4 className="font-medium text-blue-900">Selfie Guidelines</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Position your face in the center of the frame</li>
                          <li>• Ensure good lighting on your face (no shadows)</li>
                          <li>• Look directly at the camera</li>
                          <li>• Remove sunglasses, hats, or face coverings</li>
                          <li>• Keep a neutral expression with eyes open</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {cameraError && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">{cameraError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Camera Option */}
                    <button
                      type="button"
                      onClick={openCamera}
                      disabled={!canEdit}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                          <Camera className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Use Computer Camera</p>
                          <p className="text-sm text-gray-500 mt-1">Take a photo with your webcam</p>
                        </div>
                      </div>
                    </button>

                    {/* Phone Option */}
                    <button
                      type="button"
                      onClick={() => setSelfieMode('phone')}
                      disabled={!canEdit}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                          <Smartphone className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Use Phone or Upload</p>
                          <p className="text-sm text-gray-500 mt-1">Take a photo with phone camera</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              ) : selfieMode === 'phone' ? (
                /* Phone/Upload Mode */
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Smartphone className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="space-y-2">
                        <h4 className="font-medium text-amber-900">Taking a Selfie with Your Phone</h4>
                        <ol className="text-sm text-amber-800 space-y-1 list-decimal list-inside">
                          <li>Open your phone&apos;s camera app</li>
                          <li>Switch to front-facing camera (selfie mode)</li>
                          <li>Position your face in the center</li>
                          <li>Take a clear, well-lit photo</li>
                          <li>Click the button below to upload</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => selfieInputRef.current?.click()}
                      disabled={!canEdit || isUploading === 'selfie'}
                      className="w-full h-14"
                      size="lg"
                    >
                      {isUploading === 'selfie' ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-5 w-5" />
                          Upload Selfie from Device
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setSelfieMode('choose')}
                      className="text-gray-500"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Choose Different Method
                    </Button>
                  </div>
                </div>
              ) : isCameraOpen ? (
                /* Camera View with Face Guide */
                <div className="space-y-4">
                  <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                    {/* Loading overlay */}
                    {!cameraReady && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                        <div className="text-center">
                          <Loader2 className="h-10 w-10 text-white animate-spin mx-auto" />
                          <p className="text-white text-sm mt-3">Starting camera...</p>
                        </div>
                      </div>
                    )}

                    {/* Video element */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-80 object-cover"
                      style={{ transform: 'scaleX(-1)' }}
                    />

                    {/* Face guide overlay */}
                    {cameraReady && (
                      <div className="absolute inset-0 pointer-events-none">
                        {/* Oval face guide */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-64 border-4 border-white/70 rounded-[50%] shadow-lg" style={{ boxShadow: '0 0 0 9999px rgba(0,0,0,0.3)' }}>
                          </div>
                        </div>

                        {/* Guide text */}
                        <div className="absolute bottom-4 left-0 right-0 text-center">
                          <span className="bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                            Position your face in the oval
                          </span>
                        </div>

                        {/* Corner guides */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2">
                          <span className="bg-black/60 text-white px-3 py-1 rounded text-xs">
                            Keep your face centered and look at the camera
                          </span>
                        </div>
                      </div>
                    )}

                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={capturePhoto}
                      className="flex-1"
                      disabled={isUploading === 'selfie' || !cameraReady}
                      size="lg"
                    >
                      {isUploading === 'selfie' ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-5 w-5" />
                          Capture Photo
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={closeCamera} size="lg">
                      Cancel
                    </Button>
                  </div>

                  <p className="text-sm text-center text-gray-500">
                    Tip: Make sure your entire face is visible within the oval guide
                  </p>
                </div>
              ) : null}
            </div>

            {/* Submit Button */}
            {canEdit && (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !idType || !idNumber || !idDocumentUrl || !selfieUrl}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : investor.kycStatus === 'rejected' ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resubmit Verification
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Submit for Verification
                    </>
                  )}
                </Button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  By submitting, you confirm that the information provided is accurate and belongs to you.
                </p>
              </div>
            )}

            </CardContent>
          </Card>
          </>
        )}

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p><strong>Accepted ID types:</strong> National ID Card, Passport, Driver&apos;s License</p>
            <p><strong>Photo requirements:</strong> Clear, well-lit, all text readable, no glare or blur</p>
            <p><strong>Selfie tips:</strong> Face the camera directly, ensure good lighting, remove sunglasses/hats</p>
            <p className="mt-4">
              Having trouble? Contact our support team at <a href="mailto:support@subercraftex.com" className="text-primary underline">support@subercraftex.com</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
