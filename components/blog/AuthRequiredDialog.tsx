'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface AuthRequiredDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: string
}

export function AuthRequiredDialog({
  open,
  onOpenChange,
  action,
}: AuthRequiredDialogProps) {
  const router = useRouter()

  const handleSignUp = () => {
    onOpenChange(false)
    router.push('/signup')
  }

  const handleLogin = () => {
    onOpenChange(false)
    router.push('/login')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account Required</DialogTitle>
          <DialogDescription>
            You need to be registered to {action} this post. Create an account
            to engage with our content.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleLogin}>
            Log In
          </Button>
          <Button onClick={handleSignUp}>Create Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
