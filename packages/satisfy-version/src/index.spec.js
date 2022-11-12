import satisfy from './index'
test(`compare-version`, () => {
    expect(satisfy('1.0.0', '>1.0.0-beta.2')).toBe(true)
    expect(satisfy('1.0.0', '1.0.0')).toBe(true)
    expect(satisfy('1.0.0-beta.2', '>1.0.0')).toBe(false)
})
