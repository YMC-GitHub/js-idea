import { jsonstream } from '@ymc/json-stream-io'
import { store as gitlog } from './index'

const { log } = console
async function main() {
    // log('[task] read gitlog')
    // const data = await gitlog.getinfo()
    // // log(data)
    // log('[task] store gitlog')
    // const loc = 'gitlog-info.tmp.json'
    // jsonstream.init(loc)
    // await jsonstream.write(data)
    // log(`[info] out: ${loc}`)

    let o
    log('[task] read gitlog')
    gitlog.options.n = 1
    const data = await gitlog.parse()
    log(data)

    log('[task] store gitlog')
    const loc = 'gitlog-info.shim.tmp.json'
    jsonstream.init(loc)
    o = await jsonstream.read([])
    data.forEach(v => {
        if (!o.some(nv => nv.hash === v.hash)) {
            o.unshift(v)
        }
    })

    await jsonstream.write(o)
    log(`[info] out: ${loc}`)
}
main()
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/git-commit-msg-read/src/demo.js
