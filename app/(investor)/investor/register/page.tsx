import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import InvestorRegistrationForm from '@/components/investor/InvestorRegistrationForm'

export default async function InvestorRegisterPage() {
  const user = await getSession()

  if (!user) {
    redirect('/login?redirect=/investor/register')
  }

  // Check if user is already an investor
  const existingInvestor = await db.investor.findUnique({
    where: { userId: user.id },
  })

  if (existingInvestor) {
    redirect('/investor/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Become an Investor
            </h1>
            <p className="text-gray-600">
              Join SuberCraftex investment platform and start earning passive income through product and equipment investments.
            </p>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  <strong>Important:</strong> All investors must complete ID verification before investing. Please have your government-issued ID ready.
                </p>
              </div>
            </div>
          </div>

          <InvestorRegistrationForm />
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#D4AF76] text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Register & Verify</h3>
                <p className="text-gray-600">
                  Complete registration with your ID verification. Admin will review within 24-48 hours.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#D4AF76] text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Deposit Funds</h3>
                <p className="text-gray-600">
                  Once verified, deposit investment capital into your account. Funds are allocated to products or equipment purchases.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#D4AF76] text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Earn Profits</h3>
                <p className="text-gray-600">
                  When products sell or equipment generates revenue, you receive 50% of the profit proportional to your investment.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-[#D4AF76] text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Withdraw Anytime</h3>
                <p className="text-gray-600">
                  Request withdrawal of cash, profits, or claim back your invested products at any time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
