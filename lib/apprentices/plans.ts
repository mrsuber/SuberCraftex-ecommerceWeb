import { ServiceTrack } from '@prisma/client'
import { MoneyInputError, parseXaf, parseXafOrZero } from '@/lib/money'

/** A fee plan from what an admin typed, checked. */
export function planData(body: Record<string, unknown>) {
  const name = String(body.name ?? '').trim().slice(0, 120)
  if (!name) throw new MoneyInputError('Give the plan a name')
  const instalments = Number(body.instalments ?? 1)
  const intervalMonths = Number(body.intervalMonths ?? 1)
  if (!Number.isInteger(instalments) || instalments < 1 || instalments > 36) throw new MoneyInputError('Instalments must be between 1 and 36')
  if (!Number.isInteger(intervalMonths) || intervalMonths < 1 || intervalMonths > 12) throw new MoneyInputError('Months between instalments must be between 1 and 12')
  const track = body.serviceTrack ? String(body.serviceTrack) : null
  if (track && !Object.values(ServiceTrack).includes(track as ServiceTrack)) throw new MoneyInputError('Unknown track')
  return {
    name,
    serviceTrack: track as ServiceTrack | null,
    registrationFee: parseXafOrZero(body.registrationFee, 'registration fee'),
    tuition: parseXaf(body.tuition, 'tuition'),
    instalments,
    intervalMonths,
    description: body.description ? String(body.description).slice(0, 2000) : null,
    isActive: body.isActive !== false,
  }
}
