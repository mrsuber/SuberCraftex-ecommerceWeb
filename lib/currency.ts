/**
 * Currency configuration and utilities
 */

export interface Currency {
  code: string
  symbol: string
  name: string
  decimals: number
  symbolPosition: 'before' | 'after'
  thousandsSeparator: string
  decimalSeparator: string
}

export const currencies: Record<string, Currency> = {
  XAF: {
    code: 'XAF',
    symbol: 'FCFA',
    name: 'Central African CFA Franc',
    decimals: 0, // FCFA typically doesn't use decimals
    symbolPosition: 'after',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    decimals: 2,
    symbolPosition: 'before',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    decimals: 2,
    symbolPosition: 'after',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    decimals: 2,
    symbolPosition: 'before',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
}

// Default currency for Cameroon
export const DEFAULT_CURRENCY = 'XAF'

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = DEFAULT_CURRENCY
): string {
  const currency = currencies[currencyCode] || currencies.XAF

  // Round to appropriate decimals
  const rounded = currency.decimals === 0
    ? Math.round(amount)
    : Number(amount.toFixed(currency.decimals))

  // Format the number with thousands separator
  const parts = rounded.toString().split('.')
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandsSeparator)

  let formatted = integerPart
  if (currency.decimals > 0 && parts[1]) {
    formatted += currency.decimalSeparator + (parts[1] || '').padEnd(currency.decimals, '0')
  }

  // Add currency symbol
  if (currency.symbolPosition === 'before') {
    return `${currency.symbol}${formatted}`
  } else {
    return `${formatted} ${currency.symbol}`
  }
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currencyCode: string = DEFAULT_CURRENCY): string {
  return currencies[currencyCode]?.symbol || currencies.XAF.symbol
}

/**
 * Get currency configuration
 */
export function getCurrency(currencyCode: string = DEFAULT_CURRENCY): Currency {
  return currencies[currencyCode] || currencies.XAF
}
