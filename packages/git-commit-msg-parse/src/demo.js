/*eslint-disable max-len */
import { parse, getIssueInFoot } from './index'
import { jsonstream } from '@ymc/json-stream-io'

const { log } = console
async function main() {
    let data, loc

    log(`[task] load gitlog`)
    loc = `gitlog-info.tmp.json`
    log(`[info] src: ${loc}`)
    jsonstream.init(loc)
    data = await jsonstream.read(data)

    log(`[task] parse gitlog`)
    data = data.map((item, index) => {
        let { subject, body } = item
        const menifest = parse(subject[index], body[index])
        let issue = getIssueInFoot(menifest.foot)
        return {
            ...item,
            ...menifest,
            issue
        }
    })
    loc = `gitlog-info.shim.tmp.json`
    jsonstream.init(loc)
    await jsonstream.write(data)
    log(`[info] out: ${loc}`)
}
main()
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/git-commit-msg-parse/src/demo.js
