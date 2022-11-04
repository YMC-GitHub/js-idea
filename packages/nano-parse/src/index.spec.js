import parse from './index'

/**
 * cli agrs from string to array - mock preocess.argv
 * @param {string} s
 * @return {string[]}
 */
function mockArgv(s) {
  return s.split(/ +/)
}
test(`like-argv`, () => {
  let input, output
  output = parse(mockArgv(`ns cmd`))
  expect(output).toHaveProperty('flags', {})
  expect(output).toHaveProperty('_', ['ns', 'cmd'])
  expect(output).toHaveProperty('extras', [])

  output = parse(mockArgv(`ns cmd -a -b -c`))
  expect(output).toHaveProperty('flags', { a: true, b: true, c: true })
  expect(output).toHaveProperty('_', ['ns', 'cmd'])
  expect(output).toHaveProperty('extras', [])

  output = parse(mockArgv(`ns cmd -a -b -c -- -a -b -c`))
  expect(output).toHaveProperty('flags', { a: true, b: true, c: true })
  expect(output).toHaveProperty('_', ['ns', 'cmd'])
  expect(output).toHaveProperty('extras', [`-a`, `-b`, `-c`])
  // output = parse(mockArgv(`ns cmd -a -b -c -- -a -b -c`))
  // output = parse(mockArgv(`ns subns cmd -a -b -c -- -a -b -c`))
  // output = parse(mockArgv(`ns subns subcmd -a -b -c -- -a -b -c`))
})

// console.log(process.argv)
// node packages/nano-parse/src/index.js ns subns subcmd -a -b -c -- -a -b -c
