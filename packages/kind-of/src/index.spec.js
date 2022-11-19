import { kindOfTest, typeOfTest } from './index'
const { log } = console
function noop() {}
class Github {}
function Gitlab() {}
let regexp = /helo/

let vals = ['', 1, null, undefined, false, [], {}, () => {}, noop, Github, Gitlab, regexp]

test(`kindOfTest`, () => {
    expect(kindOfTest(vals[0], 'string')).toBe(true)
    expect(kindOfTest(vals[1], 'number')).toBe(true)
    expect(kindOfTest(vals[2], 'null')).toBe(true)
    expect(kindOfTest(vals[3], 'undefined')).toBe(true)
    expect(kindOfTest(vals[4], 'boolean')).toBe(true)
    expect(kindOfTest(vals[5], 'array')).toBe(true)
    expect(kindOfTest(vals[6], 'object')).toBe(true)
    expect(kindOfTest(vals[7], 'function')).toBe(true)
    expect(kindOfTest(vals[8], 'function')).toBe(true)
    expect(kindOfTest(vals[9], 'function')).toBe(true)
    expect(kindOfTest(vals[10], 'function')).toBe(true)
    expect(kindOfTest(vals[11], 'regexp')).toBe(true)
})

test(`typeOfTest`, () => {
    expect(typeOfTest(vals[0], 'String')).toBe(true)
    expect(typeOfTest(vals[1], 'Number')).toBe(true)
    expect(typeOfTest(vals[2], 'Null')).toBe(true)
    expect(typeOfTest(vals[3], 'Undefined')).toBe(true)
    expect(typeOfTest(vals[4], 'Boolean')).toBe(true)
    expect(typeOfTest(vals[5], 'Array')).toBe(true)
    expect(typeOfTest(vals[6], 'Object')).toBe(true)
    expect(typeOfTest(vals[7], 'Function')).toBe(true)
    expect(typeOfTest(vals[8], 'Function')).toBe(true)
    expect(typeOfTest(vals[9], 'Function')).toBe(true)
    expect(typeOfTest(vals[10], 'Function')).toBe(true)
    expect(typeOfTest(vals[11], 'RegExp')).toBe(true)
})
