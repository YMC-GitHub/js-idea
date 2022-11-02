import { excapeSpecialChar, getTplexp, magicGetTagRegexp } from './help'

test('get tpl expression', () => {
  // let specals = `[]{}()`
  // specals.split('').map(s => {
  //     expect(excapeSpecialChar(s)).toBe(`\\${s}`)
  // })
  expect(getTplexp('hi', '{', '}')).toStrictEqual(`{hi}`)
  expect(getTplexp('hi', '[', ']')).toStrictEqual(`[hi]`)
  expect(getTplexp('hi', '(', ')')).toStrictEqual(`(hi)`)
  expect(getTplexp('hi', '{{', '}}')).toStrictEqual(`{{hi}}`)
  expect(getTplexp('hi', '{{{', '}}}')).toStrictEqual(`{{{hi}}}`)
})

test('escape special chars', () => {
  let specals = `[]{}()`
  specals.split('').map(s => {
    expect(excapeSpecialChar(s)).toBe(`\\${s}`)
  })
  // expect(excapeSpecialChar('{')).toBe('\\{')
})

test('get tag regexp', () => {
  // let specals = `[]{}()`
  // specals.split('').map(s => {
  //     expect(excapeSpecialChar(s)).toBe(`\\${s}`)
  // })
  expect(magicGetTagRegexp('hi', { openLabel: '{', closeLabel: '}' })).toStrictEqual(/\{hi\}/gi)
  expect(magicGetTagRegexp('hi', { openLabel: '[', closeLabel: ']' })).toStrictEqual(/\[hi\]/gi)
  expect(magicGetTagRegexp('hi', { openLabel: '(', closeLabel: ')' })).toStrictEqual(/\(hi\)/gi)
})
