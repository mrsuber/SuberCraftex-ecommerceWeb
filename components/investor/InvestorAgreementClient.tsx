'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'

interface InvestorAgreementClientProps {
  investorNumber: string
}

export default function InvestorAgreementClient({ investorNumber }: InvestorAgreementClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)

  const handleAccept = async () => {
    if (!agreed) {
      setError('Please check the box to accept the agreement')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/investors/accept-agreement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to accept agreement')
      }

      router.push('/investor/dashboard')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="p-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Investor Agreement
        </h1>
        <p className="text-gray-600">
          Investor Number: <span className="font-semibold text-[#D4AF76]">{investorNumber}</span>
        </p>
      </div>

      <div className="p-8 space-y-6 max-h-[600px] overflow-y-auto">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Investment Structure</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              By accepting this agreement, you acknowledge and agree to the following investment terms:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>All investments are made by depositing cash into your investor account</li>
              <li>The company (SuberCraftex) will allocate your funds to purchase products, raw materials, or equipment</li>
              <li>You are not a shareholder of SuberCraftex and have no voting rights or ownership stake</li>
              <li>Investment allocation decisions are solely at the discretion of SuberCraftex management</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. Profit Distribution</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              Profit sharing operates as follows:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Product Sales:</strong> When products funded by your investment are sold, net profit is split 50-50 between the company and you</li>
              <li><strong>Equipment Revenue:</strong> When equipment co-funded by your investment generates revenue, net profit is split 50% to the company and 50% distributed proportionally among all investors who funded that equipment</li>
              <li><strong>Real-time Distribution:</strong> Profits are calculated and distributed immediately upon sale completion</li>
              <li><strong>Capital Return:</strong> Your original investment (capital) is returned to your cash wallet when products sell</li>
              <li><strong>Profit Accumulation:</strong> Profits accumulate in a separate profit wallet</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Expense Calculation</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              Net profit is calculated after deducting the following expenses:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Material costs (raw materials, supplies)</li>
              <li>Labor costs (employee wages, contractor fees)</li>
              <li>Equipment maintenance and repairs</li>
              <li>Taxes and government fees</li>
              <li>Shipping and logistics costs</li>
              <li>Other operational expenses</li>
            </ul>
            <p className="mt-2">
              <strong>Important:</strong> The 50-50 profit split applies only to net profit after all expenses have been deducted.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Investment Types</h2>
          <div className="text-gray-700 space-y-2">
            <p><strong>A. Product Investments:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your funds are used to purchase products, raw materials, or inventory</li>
              <li>Products are linked to your investor account</li>
              <li>You can view which products were purchased with your investment</li>
              <li>When products sell, you receive your capital back plus 50% of the profit</li>
            </ul>

            <p className="mt-3"><strong>B. Equipment Investments:</strong></p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your funds are combined with other investors or company funds to purchase equipment</li>
              <li>Your profit share is proportional to your investment percentage in that equipment</li>
              <li>Equipment can be used for multiple jobs over time, generating ongoing revenue</li>
              <li>You receive proportional profit from each job that uses the equipment</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Withdrawal Rights</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              You have the right to withdraw from investments at any time:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Cash Withdrawal:</strong> Withdraw available cash from your cash wallet</li>
              <li><strong>Profit Withdrawal:</strong> Withdraw accumulated profits from your profit wallet</li>
              <li><strong>Product Claims:</strong> Request to claim physical products purchased with your investment</li>
              <li><strong>Equipment Exit:</strong> Request to exit from equipment investments and receive a proportional refund based on current equipment value</li>
            </ul>
            <p className="mt-2">
              <strong>Processing Time:</strong> Withdrawal requests will be processed within a reasonable timeframe. For equipment exits, the company or other investors may purchase your share.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">6. Equipment Depreciation & Exit</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              When exiting from equipment investments:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Refund is based on current equipment value, not original purchase price</li>
              <li>Equipment depreciates over time due to wear, usage, and market conditions</li>
              <li>Your refund is proportional to your ownership percentage of current value</li>
              <li>All profits generated up until exit date will be credited to your account</li>
              <li>Once you exit, you no longer receive profits from that equipment</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">7. Diversification Strategy</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              SuberCraftex management will diversify your investments to optimize returns:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your cash may be allocated across multiple products or equipment</li>
              <li>Mix of fast-turnover products and long-term equipment investments</li>
              <li>Allocation decisions consider market demand, profitability, and risk</li>
              <li>You will have full transparency of all allocations in your dashboard</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">8. Risk Acknowledgment</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              You acknowledge and accept the following risks:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Products may not sell immediately or may sell at lower margins than expected</li>
              <li>Equipment may require maintenance, reducing profitability</li>
              <li>Market conditions may affect product demand and pricing</li>
              <li>There is no guaranteed rate of return on your investment</li>
              <li>Past performance does not guarantee future results</li>
              <li>SuberCraftex is not responsible for market fluctuations or external factors affecting profitability</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">9. Transparency & Reporting</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              SuberCraftex commits to full transparency:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Real-time dashboard showing all investments, products, and equipment</li>
              <li>Detailed profit calculations with expense breakdowns</li>
              <li>Transaction history for all deposits, allocations, and withdrawals</li>
              <li>For equipment jobs, full financial breakdown including revenue and all expenses</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">10. Verification & Compliance</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              By accepting this agreement:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>You confirm that all information provided (ID, contact details) is accurate</li>
              <li>You are legally able to enter into this investment agreement</li>
              <li>You understand this is an investment, not a loan or deposit account</li>
              <li>You agree to one investor account per person (linked to your verified ID)</li>
              <li>You will not engage in fraudulent activities or attempt to manipulate the system</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">11. Suspension & Termination</h2>
          <div className="text-gray-700 space-y-2">
            <p>
              SuberCraftex reserves the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Suspend or terminate your investor account for violation of terms</li>
              <li>Refuse investment deposits if verification is incomplete</li>
              <li>Process withdrawal requests on a reasonable timeline</li>
              <li>Modify these terms with 30 days notice to all investors</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="p-8 border-t border-gray-200 bg-gray-50">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex items-start gap-3 mb-6">
          <Checkbox
            id="agreement"
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
          />
          <label
            htmlFor="agreement"
            className="text-sm text-gray-700 leading-relaxed cursor-pointer"
          >
            I have read, understood, and agree to all terms and conditions outlined in this Investor Agreement. I acknowledge the risks involved and understand the profit-sharing structure, withdrawal rights, and my obligations as an investor with SuberCraftex.
          </label>
        </div>

        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Go Back
          </Button>
          <Button
            onClick={handleAccept}
            disabled={loading || !agreed}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accepting...
              </>
            ) : (
              'Accept & Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
