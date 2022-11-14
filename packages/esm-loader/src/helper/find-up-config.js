// @ymc/find-up-config

import { existsSync } from 'fs'
import { dirname, parse, join } from 'path'

// @ymc/find-up

/**
 * find config file - from bottom to up
 * @param {string[]} list config name list - eg .loaderrc .loaderrc.json
 * @param {{cwd:string}} options
 * @returns {string|undefined}
 */
function findup(list, options) {
    const option = {
        ...options
    }
    // resolve,parse,join
    let { cwd } = option
    if (!cwd) cwd = ''
    // find
    const res = list.map(v => join(cwd, v)).filter(loc => existsSync(loc))
    const [file] = res
    if (file) return file
    // is root dir , return
    if (cwd === parse(cwd).root) return undefined
    // find in parent dir
    return findup(list, { cwd: dirname(cwd) })
}

const CONFIG_FILES = ['.loaderrc.mjs', '.loaderrc.js']
// get process current dir
// def config filename , get config filename
// get dirname of path
// exsits file
// This function looks for a `.loaderrc` file in case no loader configuration
// was explicitly specified.
export default function findConfig(cwd = process.cwd()) {
    return findup(CONFIG_FILES, { cwd })
}
