import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth/session'

// Mobile money settings keys
const MOBILE_MONEY_KEYS = {
  number: 'mobile_money_number',
  name: 'mobile_money_name',
  provider: 'mobile_money_provider', // MTN, Airtel, Orange
  instructions: 'mobile_money_instructions',
}

// GET /api/settings/mobile-money - Get mobile money settings (public for investors)
export async function GET() {
  try {
    const settings = await db.appSetting.findMany({
      where: {
        key: {
          in: Object.values(MOBILE_MONEY_KEYS),
        },
      },
    })

    const result: Record<string, string> = {}
    settings.forEach((s) => {
      // Convert key to camelCase for API response
      const camelKey = s.key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
      result[camelKey] = s.value
    })

    return NextResponse.json({
      mobileMoneyNumber: result.mobileMoneyNumber || '',
      mobileMoneyName: result.mobileMoneyName || '',
      mobileMoneyProvider: result.mobileMoneyProvider || 'MTN',
      mobileMoneyInstructions: result.mobileMoneyInstructions || 'Send money to the number above, then upload your receipt.',
    })
  } catch (error) {
    console.error('Error fetching mobile money settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// PUT /api/settings/mobile-money - Update mobile money settings (admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await getSession()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { mobileMoneyNumber, mobileMoneyName, mobileMoneyProvider, mobileMoneyInstructions } = body

    // Upsert each setting
    const updates = [
      { key: MOBILE_MONEY_KEYS.number, value: mobileMoneyNumber || '' },
      { key: MOBILE_MONEY_KEYS.name, value: mobileMoneyName || '' },
      { key: MOBILE_MONEY_KEYS.provider, value: mobileMoneyProvider || 'MTN' },
      { key: MOBILE_MONEY_KEYS.instructions, value: mobileMoneyInstructions || '' },
    ]

    for (const update of updates) {
      await db.appSetting.upsert({
        where: { key: update.key },
        update: { value: update.value },
        create: {
          key: update.key,
          value: update.value,
          category: 'investor',
        },
      })
    }

    console.log(`✅ Mobile money settings updated by admin: ${user.email}`)

    return NextResponse.json({
      message: 'Mobile money settings updated successfully',
    })
  } catch (error) {
    console.error('Error updating mobile money settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
