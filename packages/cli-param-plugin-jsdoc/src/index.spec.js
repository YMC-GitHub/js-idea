import main from './index'
test(`param-to-typedef`, () => {
    let param = [{ name: 'help', type: 'boolean', value: false, desc: 'info help' }]
    let output
    output = main(`baseOption`, param)
    expect(output).toStrictEqual(`/** @typedef {help:boolean} baseOption*/`)
    output = main(`baseOption`, param, { long: true })
    expect(output).toStrictEqual(`/**\n * @typedef {object} baseOption\n * @property {boolean} help - info help\n */`)
})
