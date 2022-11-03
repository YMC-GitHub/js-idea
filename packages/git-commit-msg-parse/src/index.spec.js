import { parse } from './index'
test('parse angular style msg', () => {
  let json
  let msg = `
docs(core): update readme

update pkg name,version

generated by ymc@robot
`
  json = parse(msg)
  //   console.log(json)
  let { type, scope, subject, body, foot } = json
  expect(type).toStrictEqual(`docs`)
  expect(scope).toStrictEqual(`core`)
  expect(subject).toStrictEqual(`update readme`)
  expect(body).toStrictEqual(`update pkg name,version`)
  expect(foot).toStrictEqual(`generated by ymc@robot`)
})