/* eslint-disable no-use-before-define,prefer-const,max-len */
import { execOpts, runeslint, setLinState } from './helps'

const { log } = console
async function main() {
    const args = getArgs()

    const wkd = args[0]
    // let libname = getLibNameFromPath(wkd)
    // let libdir = getPackagesLocFromPath(wkd)

    let eslint = 'npx eslint'
    // feat: run remote cmd eslint with npx
    eslint = 'npx eslint'
    // // feat: run local eslint
    // eslint = 'node_modules/.bin/eslint'
    // // feat: run global eslint
    // eslint = 'eslint'

    log('[task] eslint lint pkg files')
    let loc
    loc = wkd

    log('[info] lint files')
    // feat: output with color
    // https://eslint.org/docs/latest/user-guide/command-line-interface
    // https://kohpoll.github.io/blog/2016/09/15/spawn-and-terminal-color/
    // await runeslint(`${eslint} --color --no-error-on-unmatched-pattern ${loc}`, execOpts)
    // await runeslint(`${eslint} --fix --color --no-error-on-unmatched-pattern ${loc}`, execOpts)
    const state = await runeslint(`${eslint} --fix --color --no-error-on-unmatched-pattern ${loc}`, execOpts)
    await setLinState({
        pkgLoc: loc,
        key: 'lin_state',
        state,
        storeAt: 'pkgs-info.json'
    })
}

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

main()

// run as node script
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/lin-pkg-file/src/demo.js private-pkgs/text-stream-io
