/* eslint-disable max-len */

// import { exec, execOpts } from '@ymc/run-bash'
import { getValidOpvCmds, runOpvCmds } from './helps'

/**
 * wrap run-bash to run list
 * @param {exec} exec
 * @param {execOpts} execOpts
 * @returns
 */
function main(exec, execOpts) {
    /**
     * run opv-cmds with cmds-array
     * @param {string|string[]} cmds
     * @param {boolean} quit
     * @param {exec} exec
     * @param {execOpts} execOpts
     * @returns
     * @description
     * ```
     * item-to-array -> run-bash-cmd -> log-stderr-if-presence -> quit-or-continue-when-stderr -> log-stdout-if-presence
     * ```
     */
    return function fn(cmds, quit) {
        const list = getValidOpvCmds(cmds)
        return runOpvCmds(list, quit, exec, execOpts)
    }
}

export default main
