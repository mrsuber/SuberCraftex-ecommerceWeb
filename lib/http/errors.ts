import { NextResponse } from 'next/server'
import { InvestorEngineError } from '@/lib/investors/lots'
import { MigrationError } from '@/lib/investors/migration'
import { InsufficientFundsError, LedgerError } from '@/lib/ledger'
import { MoneyInputError } from '@/lib/money'
import { PayoutError } from '@/lib/payments/payouts'
import { PayrollError } from '@/lib/payroll'
import { FeeError } from '@/lib/apprentices/fees'

/** Turn a known business error into a 400 with its message; anything else is rethrown. */
export function businessError(error: unknown) {
  if (error instanceof InsufficientFundsError) return NextResponse.json({ error: error.message }, { status: 400 })
  if (
    error instanceof InvestorEngineError || error instanceof MoneyInputError || error instanceof MigrationError || error instanceof LedgerError ||
    error instanceof PayrollError ||
    error instanceof FeeError ||
    error instanceof PayoutError
  ) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
  throw error
}
