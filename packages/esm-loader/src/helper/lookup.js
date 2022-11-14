/* eslint-disable no-return-await */

// # lookup.js
// This function is responsible for automatically looking up the .loaderrc
// file containing the loader configuration.
import path from 'path'
import parseargs from '@ymc/nano-parse'
import findConfig from './find-up-config'
import loadConfig from './load-esm-config'

// Finds and loads the configuration file based on the parameters the process
// was run with.
export default async function lookup(cwd = process.cwd()) {
    // Check if a loader was specified explicitly.
    const parsed = parseargs(process.argv)
    const config = parsed['loader-config']
    let fullPath
    if (config) {
        fullPath = path.resolve(process.cwd(), config)
    } else {
        fullPath = findConfig(cwd)
    }
    return fullPath ? await loadConfig(fullPath) : {}
}
