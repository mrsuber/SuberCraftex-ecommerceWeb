import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { audit } from '@/lib/audit'
import { adminOrResponse } from '@/lib/http/admin'
import { ensureAgreements } from '@/lib/investors/agreement'
import { agreementV2, risksText, rulesFrom } from '@/lib/investors/agreement-text'
import { getSettings } from '@/lib/settings'

// GET /api/admin/investors/agreements - Every published version and how many accepted each
export async function GET() {
  const { response } = await adminOrResponse()
  if (response) return response
  await ensureAgreements()
  const versions = await db.investorAgreementVersion.findMany({ orderBy: { version: 'desc' }, include: { _count: { select: { acceptances: true } } } })
  return NextResponse.json(versions)
}

// POST /api/admin/investors/agreements - Publish a new version from today's settings (super admin).
// Investors must accept it before any new money is invested; existing capital keeps its version.
export async function POST(request: NextRequest) {
  const { user, response } = await adminOrResponse({ superAdmin: true })
  if (response) return response
  await ensureAgreements()
  const settings = await getSettings([
    'investors.investorProfitPercent',
    'investors.profitHoldDays',
    'investors.exitNoticeDays',
    'investors.machineLockMonths',
    'investors.buyoutOfferDays',
    'investors.buyoutMaxInstalments',
    'payouts.feePercent',
  ])
  const rules = rulesFrom(settings)
  const text = agreementV2(rules)
  const body = await request.json().catch(() => ({}))
  const last = await db.investorAgreementVersion.findFirstOrThrow({ orderBy: { version: 'desc' } })
  const version = await db.investorAgreementVersion.create({
    data: {
      version: last.version + 1,
      title: typeof body.title === 'string' && body.title.trim() ? body.title.trim() : text.title,
      bodyEn: typeof body.bodyEn === 'string' && body.bodyEn.trim() ? body.bodyEn : text.bodyEn,
      bodyFr: typeof body.bodyFr === 'string' && body.bodyFr.trim() ? body.bodyFr : text.bodyFr,
      risksEn: Object.values(risksText('en')).join('\n'),
      risksFr: Object.values(risksText('fr')).join('\n'),
      rules: rules as any,
      createdById: user.id,
    },
  })
  await audit({ actor: user, action: 'investors.agreement_published', targetType: 'agreement', targetId: version.id, details: { version: version.version, rules } })
  return NextResponse.json({ version: version.version }, { status: 201 })
}
