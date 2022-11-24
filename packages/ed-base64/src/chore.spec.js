import { getGreatestCommonDivisor, getLeastCommomMultiple, getBinFormatCharsFromDecFormatChar } from './chore'

test(`get-greatest-common-divisor`, () => {
    expect(getGreatestCommonDivisor(6, 3)).toBe(3)
    expect(getGreatestCommonDivisor(12, 3)).toBe(3)
    expect(getGreatestCommonDivisor(6, 8)).toBe(2)
})
test(`get-least-commom-multiple`, () => {
    expect(getLeastCommomMultiple(6, 3)).toBe(6)
    expect(getLeastCommomMultiple(12, 3)).toBe(12)
    expect(getLeastCommomMultiple(6, 8)).toBe(24)
})

test(`get-bin-format-chars-from-dec-format-char`, () => {
    // expect(getBinFormatCharsFromDecFormatChar(`1`)).toBe(`00000001`)
    // expect(`00000001`).toBe((1).toString(2))
    let binchars = (2).toString(2)
    expect(binchars).toBe('10')
    expect(binchars.padStart(8, '0')).toBe('00000010')
    expect('a'.charCodeAt(0).toString(2).padStart(8, '0')).toBe('01100001')
    expect(getBinFormatCharsFromDecFormatChar('a')).toBe('01100001')
    expect(getBinFormatCharsFromDecFormatChar('ab')).toBe('0110000101100010')
})
