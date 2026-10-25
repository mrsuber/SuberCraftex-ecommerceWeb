import { describe, expect, it } from 'vitest'
import {
  mobileProviderOf,
  normalizeCameroonPhone,
  parseXaf,
  percentCeil,
  splitByWeights,
  toXaf,
} from '@/lib/money'

describe('splitByWeights', () => {
  it('always adds up to the total, giving leftover francs to the largest remainders', () => {
    expect(splitByWeights(100_000n, [2n, 1n])).toEqual([66_667n, 33_333n])
    expect(splitByWeights(10n, [1n, 1n, 1n])).toEqual([4n, 3n, 3n])
    const parts = splitByWeights(1_234_567n, [7n, 13n, 29n, 51n])
    expect(parts.reduce((a, b) => a + b, 0n)).toBe(1_234_567n)
  })

  it('splits losses the same way', () => {
    const parts = splitByWeights(-1_001n, [1n, 1n])
    expect(parts).toEqual([-501n, -500n])
  })

  it('gives nothing to a zero weight', () => {
    expect(splitByWeights(5n, [0n, 1n, 1n])).toEqual([0n, 3n, 2n])
  })
})

describe('parsing money', () => {
  it('accepts whole francs only', () => {
    expect(parseXaf('25000')).toBe(25_000n)
    expect(parseXaf(100)).toBe(100n)
    expect(() => parseXaf('10.5')).toThrow()
    expect(() => parseXaf(-5)).toThrow()
    expect(() => parseXaf(0)).toThrow()
    expect(() => parseXaf('1e5')).toThrow()
  })

  it('rounds old decimal columns to whole francs', () => {
    expect(toXaf('15000.00')).toBe(15_000n)
    expect(toXaf('99.50')).toBe(100n)
  })

  it('rounds fees up', () => {
    expect(percentCeil(10_000n, 5)).toBe(500n)
    expect(percentCeil(101n, 5)).toBe(6n)
  })
})

describe('Cameroon phone numbers', () => {
  it('normalises to 237XXXXXXXXX', () => {
    expect(normalizeCameroonPhone('677 12 34 56')).toBe('237677123456')
    expect(normalizeCameroonPhone('+237 699-123-456')).toBe('237699123456')
    expect(() => normalizeCameroonPhone('12345')).toThrow()
  })

  it('knows the operator from the prefix', () => {
    expect(mobileProviderOf('237677123456')).toBe('MTN')
    expect(mobileProviderOf('237699123456')).toBe('ORANGE')
    expect(mobileProviderOf('237652123456')).toBe('MTN')
    expect(mobileProviderOf('237657123456')).toBe('ORANGE')
  })
})
