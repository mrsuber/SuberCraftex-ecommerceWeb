import { toast as sonnerToast } from 'sonner'

export interface ToastProps {
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

export function useToast() {
  return {
    toast: ({ title, description, variant, duration }: ToastProps) => {
      const message = title || description || ''
      const fullMessage = title && description ? `${title}\n${description}` : message

      if (variant === 'destructive') {
        sonnerToast.error(fullMessage, { duration })
      } else {
        sonnerToast.success(fullMessage, { duration })
      }
    },
  }
}
