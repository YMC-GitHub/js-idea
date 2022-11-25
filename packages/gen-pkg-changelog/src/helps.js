import { exec, execOpts } from '@ymc/run-bash'
import { camelize } from '@ymc/extend-string'
import { jsonstream } from '@ymc/json-stream-io'
// import chaintask from '@ymc/chain-task'
import { dirname, basename } from '@ymc/mock-path'

import { readFileSync, writeFileSync } from 'fs'

const { log } = console
/**
 * get lib name with working dir
 * @param {string} wkd
 * @param {{trim?:boolean,camelize?:boolean}} option
 * @returns
 */
function getLibNameFromPath(wkd, option = {}) {
    let res = basename(wkd)
    const opt = {
        trim: true,
        ...option
    }
    if (opt.trim) {
        res = res.trim()
    }
    if (opt.camelize) {
        res = camelize(res)
    }
    return res
}

/**
 * get lib dir with working dir
 * @param {string} wkd
 * @returns
 */
function getPackagesLocFromPath(wkd) {
    return dirname(wkd)
}

/**
 * get done or fail with condition
 * @param {*} cond
 * @param {string} done
 * @param {string} fail
 * @returns {string}
 */
function getFailOrDone(cond, done = 'done', fail = 'fail') {
    // get fail or done
    let state = fail
    if (cond) {
        state = done
    }
    return state
}

/* eslint-disable no-shadow */
async function runcmd(cmd, execOpts) {
    const { stdout } = await exec(cmd, execOpts)
    return stdout
}
/* eslint-enable no-shadow */

// @ymc/get-obj-only-define-keys
/**
 * get obj only define keys
 * @param {{}} option
 */
function getObjOnlyDefinedKeys(option = {}) {
    const res = {}
    Object.keys(option).forEach(v => {
        if (option[v] !== undefined) {
            res[v] = option[v]
        }
    })
    return res
}
/**
 *
 * @param {string} loc
 * @param {{}} def
 * @returns data
 * @description
 * ```
 * warn: need to fix when json with bom
 * ```
 */
function readJsonSync(loc, def = {}) {
    let data
    try {
        data = readFileSync(loc)
        data = JSON.parse(data)
    } catch (error) {
        data = def
    }
    return data
}

/**
 *
 * @param {string} file
 * @param {{}} data
 */
function writeJsonSync(file, data) {
    writeFileSync(file, JSON.stringify(data, null, 2))
}

// @ymc/log-info
/**
 * get loginfo function
 * @param {boolean} enable
 * @returns {()=>void} a function to log info
 */
function getLogInfo(enable) {
    return function (...msg) {
        if (enable) {
            log(...msg)
        }
    }
}

export {
    log,
    getLibNameFromPath,
    getPackagesLocFromPath,
    exec,
    execOpts,
    jsonstream,
    getFailOrDone,
    runcmd,
    getObjOnlyDefinedKeys,
    writeFileSync,
    readJsonSync,
    writeJsonSync,
    getLogInfo
}
