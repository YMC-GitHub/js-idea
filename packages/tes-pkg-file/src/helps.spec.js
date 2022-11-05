import { getFailOrDone } from './helps'

test(`get-fail-done`, () => {
  let input = ''
  let res
  res = getFailOrDone(input, 'done', 'fail')
  expect(res).toStrictEqual('done')
  res = getFailOrDone(true, 'done', 'fail')
  expect(res).toStrictEqual('fail')
})
