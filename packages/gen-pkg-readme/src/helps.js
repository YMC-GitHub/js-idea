/* eslint-disable max-len,no-use-before-define, */

import { writeFileSync, readFileSync } from 'fs'
import { magicGetTagRegexp } from '@ymc/tpl-exp/src/help'

function isString(s) {
    return typeof s === 'string'
}
function donothing() {}
const { log } = console
// @ymc/read-text-sync
/**
 * read text file sync
 * @param {string} loc
 * @param {string} def
 * @returns {string}
 */
function readTextSync(loc, def = '') {
    let text
    try {
        text = readFileSync(loc)
        text = text.toString()
    } catch (error) {
        text = def
    }
    return text
}
/**
 * write text file sync
 * @param {string} loc
 * @param {string} def
 */
function writeTextSync(loc, def = '') {
    try {
        writeFileSync(loc, def)
    } catch (error) {
        donothing()
    }
}
// @ymc/write-text-sync

// @ymc/read-json-sync
/**
 *
 * @param {string} loc
 * @param {{}} def
 * @returns
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

// @ymc/load-tpl
// @ymc/get-tpl-loc
// @ymc/def-tpl-exp

const getTplLocByName = (name = 'readme', loc = '.') => `${loc}/${name}.tpl.md`
const getTmpLocByName = (name = 'readme', loc = '.') => `${loc}/${name}.tmp.md`

/**
 *
 * @param {string} name
 * @param {string} openLabel
 * @param {string} closeLabel
 * @returns {regexp}
 */
function getTplExpRegByName(name, openLabel = '{{', closeLabel = '}}') {
    return magicGetTagRegexp(name, { openLabel, closeLabel })
}

// @ymc/readme-render-help,@ymc/define-readme-render
/**
 * define render handle by name and tpl
 * @param {string} name
 * @param {{tpl:string,joinMode:string}} options
 * @returns {(text:string,data:{})=>string}
 */
function defineRender(name, options = {}) {
    return (text = '', data = '') => {
        const opt = isString(options) ? { tpl: options } : options
        const option = {
            tpl: '',
            joinMode: 'foot',
            ...opt
        }
        let res = text
        const reg = getTplExpRegByName(name)
        const hasExpInTpl = reg.test(res)

        if (!hasExpInTpl) {
            // if (option.joinMode.toLowerCase() === 'head') {
            //     res = `${option.tpl}\n${res}\n`
            // } else {
            //     res = `${res}\n${option.tpl}`
            // }
            res = option.tpl
        }
        res = res.replace(reg, data)
        return res
    }
}

export {
    log,
    readTextSync,
    writeTextSync,
    readJsonSync,
    getTplLocByName,
    getTmpLocByName,
    getTplExpRegByName,
    defineRender
}
