/** The refusal shown when a suspended investor tries to move money in or out. */
export function suspendedMessage(investor: { status: string; suspendedReason?: string | null }) {
  if (investor.status !== 'suspended') return null
  return `Your account is suspended${investor.suspendedReason ? ` (${investor.suspendedReason})` : ''}. Deposits, withdrawals and new investments are paused. Contact SuberCraftex.`
}
