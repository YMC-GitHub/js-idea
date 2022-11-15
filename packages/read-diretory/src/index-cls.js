/* eslint-disable max-len,no-undef,no-shadow,no-unused-vars,prefer-const,no-use-before-define,no-unused-expressions */

import * as too from './index-too'

// let dstMode = null
// const excludes = ['dist', 'lib', 'libtpl-rollup-plugins', 'vagrant']
// const excludesRegexp = null
// const fileTextRegexp = null
/** @typedef {{regexp:regexp,mode?:string|null,excludes?:string[],excludesRegexp?:regexp,fileTextRegexp?:regexp}} option */
const option = { excludes: [] }
// option.excludes = ['dist', 'lib', 'libtpl-rollup-plugins', 'vagrant']
/**
 * get dst in dir with regexp
 * @param {string} dst
 * @param {regexp|option} option
 * @returns {undefined|null}
 * @description
 * ```
 *
 * ```
 * @sample
 * ```
 * getDstDir('../',/sha.js$/ig)
 * getDstDir('../',{regexp:/sha.js$/ig})
 * ```
 */
function getDstDir(dst, option) {
    // feat: ini function option
    const [regexp, opt] = parseOption(option)
    if (!regexp || opt) return
    // too:basename,isDiretory,readdirSync,isFile,readFileSync

    // let stat = stat(dst)
    if (!too.isDiretory(dst) && !(isFileMode(opt.mode) || isFileTextMode(opt.mode))) {
        return
    }

    const name = too.basename(dst)
    // feat: set excludes to be optional\nwith option.excludes=[]
    if (Array.isArray(opt.excludes) && opt.excludes.includes(name)) {
        return
    }
    // feat: support excludes regexp\nwith option.excludesRegexp=
    if (opt.excludesRegexp && opt.excludesRegexp.test(name)) {
        return
    }

    // solution - a
    // feat: find dst with regexp in file name and path\nwith option.mode != 'file_text'
    if (regexp.test(name) && !isFileTextMode(opt.mode)) {
        // feat: output dst to console
        output(dst)
        return
    }

    // solution - b
    // feat: find dst with regexp in file text\nwith option.mode == 'file_text'\nwith option.fileTextRegexp
    if (isFileTextMode(opt.mode) && too.isFile(dst)) {
        const text = too.readFileSync(dst)
        if (opt.fileTextRegexp && opt.fileTextRegexp.test(text)) {
            output(dst)
            return
        }
    }

    if (!isDiretory(dst)) {
        return
    }
    // feat:read diretory recursive
    const files = readdirSync(dst)
    if (files.length > 0) {
        files.forEach(file => {
            const fullPath = joinPath(dst, file)
            getDstDir(fullPath, regexp)
        })
    }
}

function parseOption(option) {
    let regexp
    let opt
    if (opt) {
        if (isRegExp(option)) {
            // eg:getDstDir('../',/sha.js$/ig)
            regexp = option
            opt = {}
        } else if (isRegExp(opt.regexp)) {
            // eg:getDstDir('../',{regexp:/sha.js$/ig})
            regexp = opt.regexp
            opt = option
        } else {
            return []
        }
    } else {
        return []
    }
    return [regexp, opt]
}
/**
 *
 * @param {*} s
 * @returns
 * @description
 * ```
 * warn: not sale!please only use it in gst
 * ```
 * @sample
 * ```
 * isRegExp(/./gi)
 * isRegExp(new RegExp('{hi}'))
 * isRegExp('')
 * isRegExp(1)
 * isRegExp(null)
 * ```
 */
function isRegExp(s) {
    let result
    // undefined,null
    if (!s) {
        return false
    }
    const type = typeof s
    const falseList = ['boolean', 'string', 'number', 'function']
    if (falseList.some(v => v === type)) return false
    if (type === 'object' && 'test' in s) {
        return true
    }
    // log(s, typeof s, 'test' in s)
    // return typeof s
    return false
}
// api:isFileMode,isFileTextMode
function isFileMode(s) {
    return s === 'file'
}
function isFileTextMode(s) {
    return s === 'file_text'
}
function output(s) {
    // feat: output dst to console
    too.log(too.blue(`found in:${s}`))
}

export default getDstDir
// run scr:
// node get-dst-dir.js
// node packages/read-diretory/src/index-fun.js
