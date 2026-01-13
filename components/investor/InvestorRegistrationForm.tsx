'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Upload } from 'lucide-react'

export default function InvestorRegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    idType: '',
    idNumber: '',
    idDocumentUrl: '',
  })

  const [idFile, setIdFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // In a real implementation, you would upload the ID document file here
      // For now, we'll just proceed with the registration
      // TODO: Implement file upload to cloud storage (e.g., AWS S3, Cloudinary)

      const response = await fetch('/api/investors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register')
      }

      // Redirect to agreement page
      router.push('/investor/agreement')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIdFile(file)
      // TODO: Upload file and set idDocumentUrl
      // For now, just set a placeholder
      setFormData({ ...formData, idDocumentUrl: 'placeholder-url' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
          placeholder="Enter your full legal name"
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
          placeholder="+237 XXX XXX XXX"
        />
      </div>

      <div>
        <Label htmlFor="idType">ID Type</Label>
        <Select
          value={formData.idType}
          onValueChange={(value) => setFormData({ ...formData, idType: value })}
          required
        >
          <SelectTrigger id="idType">
            <SelectValue placeholder="Select ID type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="national_id">National ID Card</SelectItem>
            <SelectItem value="passport">Passport</SelectItem>
            <SelectItem value="driver_license">Driver's License</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="idNumber">ID Number</Label>
        <Input
          id="idNumber"
          type="text"
          value={formData.idNumber}
          onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
          required
          placeholder="Enter your ID number"
        />
      </div>

      <div>
        <Label htmlFor="idDocument">ID Document (Optional)</Label>
        <div className="mt-1">
          <label
            htmlFor="idDocument"
            className="flex items-center justify-center w-full px-4 py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
          >
            <div className="space-y-2 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="text-sm text-gray-600">
                {idFile ? (
                  <span className="font-medium text-[#D4AF76]">{idFile.name}</span>
                ) : (
                  <>
                    <span className="font-medium text-[#D4AF76]">Click to upload</span>
                    {' or drag and drop'}
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
            </div>
            <input
              id="idDocument"
              type="file"
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
          </label>
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Upload a clear photo or scan of your ID document. You can also upload this later from your profile.
        </p>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Your information will be securely stored and only used for verification purposes. Admin will review your application within 24-48 hours.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Application'
          )}
        </Button>
      </div>
    </form>
  )
}
