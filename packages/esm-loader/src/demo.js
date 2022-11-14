/* eslint-disable no-unused-vars */
import { jsonstream } from '@ymc/json-stream-io'
import readme from '../readme.md'
import { resolve } from '.'

const { log } = console
function infodone(s = 'done') {
    log(`[info] ${s}!`)
}
async function main() {
    log('[info] load text file xx.md async')
    const text = await import('../readme.md')
    // log(text)
    infodone()
}

log('[info] load text file xx.md')
// log(readme)
infodone()
log('[info] load alias')
// log(jsonstream)
infodone()

main()
// node --no-warnings --loader ./packages/esm-loader/dist/index.js packages/esm-loader/src/demo.js
// code: 'ERR_MODULE_NOT_FOUND'
