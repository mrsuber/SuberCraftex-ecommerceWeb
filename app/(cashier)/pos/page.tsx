import { redirect } from 'next/navigation'

export default async function POSPage() {
  // Redirect to new POS location in dashboard
  redirect('/dashboard/pos')
}
