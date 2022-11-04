import main from './index'
test(`param-to-markdown-table`, () => {
  let param = [{ name: '-h,--help', type: 'boolean', value: false, desc: 'info help' }]
  let output
  output = main(param)
  let exp = `## param
name|type|value|desc|optional
:--|:--|:--|:--|:--
help|boolean|false|info help|\n\n`
  expect(output).toStrictEqual(exp)

  output = main(param, '## param', { slimName: false, camelizeName: false })
  exp = `## param
name|type|value|desc|optional
:--|:--|:--|:--|:--
-h,--help|boolean|false|info help|\n\n`
  expect(output).toStrictEqual(exp)
})
