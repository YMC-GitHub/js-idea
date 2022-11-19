/* eslint-disable  no-unused-vars,prefer-const */
import { toString, kindOf, kindOfTest, typeOfTest, isTypeOf } from './index'

const { log } = console
function noop() {}
class Github {}
function Gitlab() {}
const github = new Github()
const regexp = /helo/

const vals = ['', 1, null, undefined, false, [], {}, () => {}, noop, Github, github, Gitlab, regexp]
let exps
let ft
ft = 'kindOfTest'
// ft = 'typeOfTest'
// ft = ''
// toString.call(v) -> [object String]
// kindOf(v) -> string
// isTypeOf(v) -> String
exps = vals.map(v => {
    const res = isTypeOf(v)
    return res
})
switch (ft) {
    case 'kindOfTest':
        exps = vals.map(v => kindOf(v))
        exps = exps.map((v, i) => `expect(kindOfTest(vals[${i}],'${v}')).toBe(true)`).join('\n')
        exps = `test(\`kindOfTest\`,()=>{\n${exps}\n})`
        break
    case 'typeOfTest':
        exps = vals.map(v => isTypeOf(v))
        exps = exps.map((v, i) => `expect(typeOfTest(vals[${i}],'${v}')).toBe(true)`).join('\n')
        exps = `test(\`typeOfTest\`,()=>{\n${exps}\n})`
        break
    default:
        break
}

// kindOfTest(v, 'string')
// kindOfTest(v, 'number')
// kindOfTest(v, 'null')
// kindOfTest(v, 'undefined')
// kindOfTest(v, 'boolean')
// kindOfTest(v, 'array')
// kindOfTest(v, 'object')
// kindOfTest(v, 'function')
// kindOfTest(v, 'function')
log(exps)

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/kind-of/src/demo.js
