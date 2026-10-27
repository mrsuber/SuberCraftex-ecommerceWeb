import { Prisma } from '@prisma/client'
import { suspendedMessage } from './suspended-message'
import { db } from '@/lib/db'
import { Tx } from '@/lib/ledger'
import { getSettings } from '@/lib/settings'
import { AGREEMENT_V1, agreementV2, RISK_KEYS, risksText, rulesFrom } from './agreement-text'
import { InvestorEngineError } from './lots'

type Client = Tx | typeof db

export async function ensureAgreements(client: Client = db) {
  const count = await client.investorAgreementVersion.count()
  if (count > 0) return
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
  const v2 = agreementV2(rules)
  await client.investorAgreementVersion.createMany({
    data: [
      { version: 1, ...AGREEMENT_V1, rules: { legacy: true } },
      {
        version: 2,
        title: v2.title,
        bodyEn: v2.bodyEn,
        bodyFr: v2.bodyFr,
        risksEn: Object.values(risksText('en')).join('\n'),
        risksFr: Object.values(risksText('fr')).join('\n'),
        rules: rules as unknown as Prisma.InputJsonValue,
      },
    ],
    skipDuplicates: true,
  })
}

export async function currentAgreement(client: Client = db) {
  await ensureAgreements(client)
  return client.investorAgreementVersion.findFirstOrThrow({ orderBy: { version: 'desc' } })
}

/** Has this investor accepted the version in force? Returns that version number when yes. */
export async function acceptedCurrentVersion(client: Client, investorId: string): Promise<number | null> {
  const current = await currentAgreement(client)
  const accepted = await client.investorAgreementAcceptance.findUnique({
    where: { investorId_versionId: { investorId, versionId: current.id } },
  })
  return accepted ? current.version : null
}

/** New money needs the current agreement accepted and identity verified. */
export async function requireReadyToInvest(client: Client, investorId: string): Promise<number> {
  const investor = await client.investor.findUnique({ where: { id: investorId } })
  if (!investor) throw new InvestorEngineError('Investor not found')
  if (investor.kycStatus !== 'approved' || !investor.isVerified) {
    throw new InvestorEngineError('Your identity must be verified before you can invest')
  }
  if (investor.status !== 'active') throw new InvestorEngineError(suspendedMessage(investor!) ?? 'This investor account is not active')
  const version = await acceptedCurrentVersion(client, investorId)
  if (!version) throw new InvestorEngineError('Please read and accept the current investor agreement first')
  return version
}

export interface AcceptInput {
  investorId: string
  versionId: string
  typedName: string
  risks: string[]
  language: 'en' | 'fr'
  ip?: string | null
  userAgent?: string | null
}

export async function acceptAgreement(input: AcceptInput) {
  const investor = await db.investor.findUniqueOrThrow({ where: { id: input.investorId } })
  const version = await db.investorAgreementVersion.findUnique({ where: { id: input.versionId } })
  if (!version) throw new InvestorEngineError('Agreement version not found')
  const current = await currentAgreement()
  if (version.id !== current.id) throw new InvestorEngineError('A newer version of the agreement exists. Please read that one.')
  const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()
  if (norm(input.typedName) !== norm(investor.fullName)) {
    throw new InvestorEngineError(`Type your full name exactly as on your profile: ${investor.fullName}`)
  }
  const missing = RISK_KEYS.filter((k) => !input.risks.includes(k))
  if (missing.length) throw new InvestorEngineError('Please tick every risk to confirm you understand it')
  const shown = risksText(input.language)
  return db.$transaction(async (tx) => {
    const acceptance = await tx.investorAgreementAcceptance.upsert({
      where: { investorId_versionId: { investorId: investor.id, versionId: version.id } },
      update: {},
      create: {
        investorId: investor.id,
        versionId: version.id,
        typedName: input.typedName.trim(),
        risksAcknowledged: Object.fromEntries(RISK_KEYS.map((k) => [k, shown[k]])),
        language: input.language,
        ip: input.ip ?? null,
        userAgent: input.userAgent?.slice(0, 300) ?? null,
      },
    })
    await tx.investor.update({ where: { id: investor.id }, data: { agreementAccepted: true, agreementAcceptedAt: acceptance.acceptedAt } })
    return acceptance
  })
}

/** Investors who accepted the agreement before versions existed are recorded against version 1. */
export async function recordLegacyAcceptances(tx: Tx) {
  await ensureAgreements(tx)
  const v1 = await tx.investorAgreementVersion.findUniqueOrThrow({ where: { version: 1 } })
  const accepted = await tx.investor.findMany({ where: { agreementAccepted: true } })
  for (const investor of accepted) {
    await tx.investorAgreementAcceptance.upsert({
      where: { investorId_versionId: { investorId: investor.id, versionId: v1.id } },
      update: {},
      create: {
        investorId: investor.id,
        versionId: v1.id,
        typedName: '(accepted before agreement versions were recorded)',
        risksAcknowledged: { legacy: true },
        acceptedAt: investor.agreementAcceptedAt ?? investor.createdAt,
      },
    })
  }
  return accepted.length
}
