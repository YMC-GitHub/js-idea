/* eslint-disable no-unused-vars,max-len */
import { pullPkgsInfo, codePkgsInfo, pushPkgsInfo } from './mgnt'

const { log } = console

/**
 * get cli args
 * @param {string} def
 * @returns {string[]}
 * @description
 * ```
 * - [x] set the first arg with default value 'def'
 * ```
 */
function getArgs(def = './packages/noop') {
    const args = process.argv.slice(2)
    if (args.length === 0) args[0] = def
    return args
}

async function main() {
    const args = getArgs()
    const wkd = args[0] ? args[0] : './packages,./private-pkgs'

    const option = { packagesLoc: wkd, storeAt: './pkgs-info.json' }
    // log('[task] pull pkgs data')
    // await pullPkgsInfo(option)
    log('[task] code pkgs data')

    await codePkgsInfo(option)
    log('[task] push pkgs data')

    await pushPkgsInfo({ storeAt: option.storeAt })
}
main()

// run as node script
// node --no-warnings --loader ./scr/lib/esm-loader.js  packages/pkgs-info/src/demo.js .
// node --no-warnings --loader ./scr/lib/esm-loader.js  packages/pkgs-info/src/demo.js ./packages,./private-pkgs
