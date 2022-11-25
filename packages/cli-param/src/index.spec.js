import { getValFromParam, paramJsonToString } from './index'

let base = [
    {
        name: '-h,--help',
        type: 'boolean',
        value: false,
        desc: 'info help'
    },
    {
        name: '-v,--version',
        type: 'string',
        value: '1.0.0',
        desc: 'info version'
    }
]

test(`to-param-json`, () => {
    let out = getValFromParam(base)
    expect(out.help).toBe(false)
    expect(out.version).toStrictEqual(`1.0.0`)
    // other to do
})

test(`get param-string from param-json`, () => {
    let input = getValFromParam(base)
    let ouput = paramJsonToString(input, { mode: 'string', modeStyle: 'cli' })
    expect(ouput).toStrictEqual(`--help=false --version=1.0.0`)

    ouput = paramJsonToString(input, { mode: 'string', modeStyle: 'httpquery' })
    expect(ouput).toStrictEqual(`help=false&version=1.0.0`)

    ouput = paramJsonToString(input, { mode: 'string', modeStyle: 'swithoption' })
    expect(ouput).toStrictEqual(`help=false;version=1.0.0`)
    // other to do
})

// test(`camelize-flags`, () => {

// })
