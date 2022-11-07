import main from './index'
test(`get-selected-keys-val`, () => {
  let input = { filetext: 'hello', commentReg: false }
  let res = main(input, 'commentReg, ignoreComment')
  expect(res).toHaveProperty('commentReg', false)
  // expect(res.commentReg).toBe(false)
  expect(res).not.toHaveProperty('ignoreComment')

  res = main(input, '{text:filetext,commentReg, ignoreComment}')
  // console.log(res)
  expect(res).toHaveProperty('text', 'hello')
  expect(res).not.toHaveProperty('filetext')
})
