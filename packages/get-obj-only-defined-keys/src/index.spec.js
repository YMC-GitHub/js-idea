import main from './index'
test(`get-defined-keys-val`, () => {
  let input = { filetext: 'hello', commentReg: false }
  let res = main(input, 'commentReg, ignoreComment')
  expect(res).toHaveProperty('commentReg', false)
  expect(res).not.toHaveProperty('ignoreComment')
})
