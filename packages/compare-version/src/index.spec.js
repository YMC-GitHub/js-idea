import compare from './index'
test(`compare-version`, () => {
  expect(compare('1.0.0', '1.0.0-beta.2')).toBe(1)
  expect(compare('1.0.0', '1.0.0')).toBe(0)
  expect(compare('1.0.0-beta.2', '1.0.0')).toBe(-1)
})
