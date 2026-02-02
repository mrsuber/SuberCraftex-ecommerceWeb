import { BlogPostForm } from '@/components/dashboard/BlogPostForm'

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Blog Post</h1>
        <p className="text-muted-foreground mt-2">
          Write and publish a new blog article
        </p>
      </div>

      <BlogPostForm />
    </div>
  )
}
