import main from './index'
test(`param-to-interface`, () => {
  let param = [{ name: 'help', type: 'boolean', value: false, desc: 'info help' }]
  let output
  output = main(param)
  expect(output).toStrictEqual(`interface baseOptions {\n  help:boolean;\n}`)
})
