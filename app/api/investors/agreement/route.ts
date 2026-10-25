import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { investorOrResponse } from '@/lib/investors/http'
import { acceptAgreement, acceptedCurrentVersion, currentAgreement } from '@/lib/investors/agreement'
import { RISK_KEYS, risksText } from '@/lib/investors/agreement-text'
import { InvestorEngineError } from '@/lib/investors/lots'
import { clientIp } from '@/lib/rate-limit'

// GET /api/investors/agreement - The agreement in force, in both languages, and whether I accepted it
export async function GET(request: NextRequest) {
  const { investor, response } = await investorOrResponse(request)
  if (response) return response
  const agreement = await currentAgreement()
  return NextResponse.json({
    id: agreement.id,
    version: agreement.version,
    title: agreement.title,
    bodyEn: agreement.bodyEn,
    bodyFr: agreement.bodyFr,
    publishedAt: agreement.publishedAt,
    risks: { en: risksText('en'), fr: risksText('fr') },
    riskKeys: RISK_KEYS,
    fullName: investor.fullName,
    accepted: (await acceptedCurrentVersion(db, investor.id)) !== null,
  })
}

// POST /api/investors/agreement - { versionId, typedName, risks: [...keys], language }
export async function POST(request: NextRequest) {
  const { investor, response } = await investorOrResponse(request)
  if (response) return response
  try {
    const body = await request.json()
    const acceptance = await acceptAgreement({
      investorId: investor.id,
      versionId: String(body.versionId ?? ''),
      typedName: String(body.typedName ?? ''),
      risks: Array.isArray(body.risks) ? body.risks.map(String) : [],
      language: body.language === 'fr' ? 'fr' : 'en',
      ip: clientIp(request),
      userAgent: request.headers.get('user-agent'),
    })
    return NextResponse.json({ accepted: true, acceptedAt: acceptance.acceptedAt })
  } catch (error) {
    if (error instanceof InvestorEngineError) return NextResponse.json({ error: error.message }, { status: 400 })
    throw error
  }
}
