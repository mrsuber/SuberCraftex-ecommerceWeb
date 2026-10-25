import { LedgerAccountKind } from '@prisma/client'

export interface AccountRef {
  key: string
  kind: LedgerAccountKind
  name: string
  ownerType?: string
  ownerId?: string
  /** May go below zero (income, expense, equity, profit wallets that can owe after a return) */
  allowNegative?: boolean
}

const asset = (key: string, name: string, owner?: [string, string]): AccountRef => ({
  key: `ASSET:${key}`,
  kind: 'asset',
  name,
  ownerType: owner?.[0],
  ownerId: owner?.[1],
})
const liability = (key: string, name: string, owner?: [string, string], allowNegative = false): AccountRef => ({
  key: `LIAB:${key}`,
  kind: 'liability',
  name,
  ownerType: owner?.[0],
  ownerId: owner?.[1],
  allowNegative,
})
const equity = (key: string, name: string, owner?: [string, string]): AccountRef => ({
  key: `EQUITY:${key}`,
  kind: 'equity',
  name,
  ownerType: owner?.[0],
  ownerId: owner?.[1],
  allowNegative: true,
})
const income = (key: string, name: string, owner?: [string, string]): AccountRef => ({
  key: `INCOME:${key}`,
  kind: 'income',
  name,
  ownerType: owner?.[0],
  ownerId: owner?.[1],
  allowNegative: true,
})
const expense = (key: string, name: string, owner?: [string, string]): AccountRef => ({
  key: `EXPENSE:${key}`,
  kind: 'expense',
  name,
  ownerType: owner?.[0],
  ownerId: owner?.[1],
  allowNegative: true,
})

/**
 * Every account SuberCraftex uses. One account per owner, created on first use.
 *
 * Where money sits (assets) is kept apart from who it belongs to (liabilities): the
 * PayWithCAMSOL account can hold 25 000 FCFA of which 20 000 belong to an investor.
 */
export const Accounts = {
  // ------------------------------------------------------------ where money sits
  camsol: () => asset('CAMSOL', 'PayWithCAMSOL account'),
  drawer: (sessionId: string, label?: string) => asset(`DRAWER:${sessionId}`, `Cash drawer ${label ?? sessionId.slice(0, 8)}`, ['pos_session', sessionId]),
  driverCash: (driverId: string, name?: string) => asset(`DRIVER_CASH:${driverId}`, `Cash held by ${name ?? 'driver'}`, ['driver', driverId]),
  safe: () => asset('SAFE', 'Shop safe'),
  /** The shop's own Mobile Money number, for money customers send by hand (not through PayWithCAMSOL) */
  shopMobileMoney: () => asset('SHOP_MOMO', 'Shop Mobile Money number'),
  bank: () => asset('BANK', 'Bank account'),
  /** Money advanced to an employee, taken back from a later salary */
  employeeAdvance: (employeeId: string) => asset(`ADVANCE:${employeeId}`, 'Salary advance', ['employee', employeeId]),
  /** Apprentice fees invoiced and not yet paid */
  apprenticeFeesDue: (apprenticeId: string) => asset(`APPRENTICE_FEES_DUE:${apprenticeId}`, 'Apprentice fees due', ['apprentice', apprenticeId]),

  // ------------------------------------------------------------- investors
  /** Capital not invested anywhere right now: withdrawable, or reinvested by the team */
  investorFree: (investorId: string) => liability(`INVESTOR_FREE:${investorId}`, 'Free capital', ['investor', investorId]),
  /** Capital in one product lot (units an investor funded or brought) */
  investorLot: (lotId: string) => liability(`INVESTOR_LOT:${lotId}`, 'Capital in products', ['lot', lotId]),
  /** Capital in a machine share, at book value */
  investorMachine: (holdingId: string) => liability(`INVESTOR_MACHINE:${holdingId}`, 'Capital in a machine', ['holding', holdingId]),
  /** A co-owner's part of a machine's replacement reserve */
  machineReserve: (holdingId: string) => liability(`MACHINE_RESERVE:${holdingId}`, 'Machine replacement reserve', ['holding', holdingId]),
  /** Product profit inside the holding period (returns can still take it back) */
  investorProfitPending: (investorId: string) => liability(`INVESTOR_PROFIT_PENDING:${investorId}`, 'Profit pending', ['investor', investorId], true),
  /** Profit that can be withdrawn. Negative after a return took back profit already paid. */
  investorProfit: (investorId: string) => liability(`INVESTOR_PROFIT:${investorId}`, 'Profit available', ['investor', investorId], true),
  /** Exit payments owed to an investor who left, paid in instalments */
  investorExitDue: (investorId: string) => liability(`INVESTOR_EXIT_DUE:${investorId}`, 'Exit payment owed', ['investor', investorId]),

  // ------------------------------------------------------------- people
  customerCredit: (userId: string) => liability(`CUSTOMER_CREDIT:${userId}`, 'Store credit', ['user', userId]),
  /** Money received for an order that cannot be fulfilled, owed back to a guest customer */
  refundDue: (orderId: string) => liability(`REFUND_DUE:${orderId}`, 'Refund owed', ['order', orderId]),
  salaryWallet: (employeeId: string) => liability(`SALARY:${employeeId}`, 'Salary wallet', ['employee', employeeId]),
  /** Apprentice fees paid for months not yet taught */
  apprenticeFeesInAdvance: (apprenticeId: string) => liability(`APPRENTICE_FEES_ADVANCE:${apprenticeId}`, 'Fees paid in advance', ['apprentice', apprenticeId]),

  // ------------------------------------------------------------- clearing
  payoutsInFlight: () => liability('PAYOUTS_IN_FLIGHT', 'Payouts on their way'),
  vatPayable: () => liability('VAT', 'VAT owed'),
  payrollDeduction: (code: string, label: string) => liability(`PAYROLL:${code}`, label),

  // ------------------------------------------------------------- equity
  openingBalances: () => equity('OPENING', 'Opening balances'),
  /** SuberCraftex's own part of a machine's replacement reserve */
  companyMachineReserve: (equipmentId: string) => equity(`MACHINE_RESERVE:${equipmentId}`, 'Machine reserve (SuberCraftex share)', ['equipment', equipmentId]),
  /** SuberCraftex's own capital in a machine (the part it paid for) */
  companyMachineCapital: (equipmentId: string) => equity(`MACHINE_CAPITAL:${equipmentId}`, 'Machine capital (SuberCraftex share)', ['equipment', equipmentId]),

  // ------------------------------------------------------------- income
  productSales: () => income('SALES:PRODUCTS', 'Product sales'),
  shippingIncome: () => income('SALES:SHIPPING', 'Delivery charges'),
  serviceIncome: () => income('SERVICES', 'Services and bookings'),
  repairIncome: () => income('REPAIRS', 'Repairs'),
  apprenticeFeeIncome: () => income('APPRENTICE_FEES', 'Apprentice fees'),
  /** Half of a product loss carried by the investor, recovered by SuberCraftex */
  investorLossShare: () => income('INVESTOR_LOSS_SHARE', 'Investors’ share of losses'),
  cashOver: () => income('CASH_OVER', 'Cash counted over'),

  // ------------------------------------------------------------- expenses
  investorProfitShare: () => expense('INVESTOR_PROFIT_SHARE', 'Investors’ share of profit'),
  machineDepreciation: (equipmentId: string) => expense(`DEPRECIATION:${equipmentId}`, 'Machine depreciation', ['equipment', equipmentId]),
  paymentFees: () => expense('PAYMENT_FEES', 'Mobile Money collection fees'),
  payoutFees: () => expense('PAYOUT_FEES', 'Payout fees paid by SuberCraftex'),
  salaries: () => expense('SALARIES', 'Salaries'),
  employerContributions: () => expense('EMPLOYER_CONTRIBUTIONS', 'Employer contributions'),
  cashShort: () => expense('CASH_SHORT', 'Cash counted short'),
  stockLoss: () => expense('STOCK_LOSS', 'Investor stock lost or damaged in our care'),
  refunds: () => expense('REFUNDS', 'Refunds'),
}
