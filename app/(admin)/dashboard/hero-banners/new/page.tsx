import { HeroBannerForm } from '@/components/dashboard/HeroBannerForm'

export default function NewHeroBannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Hero Banner</h1>
        <p className="text-muted-foreground mt-2">
          Create a new banner for the homepage hero section
        </p>
      </div>

      <HeroBannerForm />
    </div>
  )
}
