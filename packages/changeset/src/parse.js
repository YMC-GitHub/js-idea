/* eslint-disable prefer-const */
import './types'
/**
 *
 * @param {string} text
 * @returns {string[]}
 */
function multiLineTextToArray(text) {
    return text.split(/\r?\n/)
}

/**
 *
 * @param {string[]} list
 * @param {string} label
 * @returns {number}
 * @sample
 * ```
 * getFrontLabelPostion(`---\n"@ymc/run-bash": patch\n---\ndocs(run-bash): change all thing\n`)
 * ```
 */
function getFrontLabelPostion(list, label = '---') {
    let count = 0
    let position = 0
    for (let index = 0; index < list.length; index += 1) {
        const line = list[index]
        if (line === label) {
            count += 1
        }
        if (count === 2) {
            position = index
            break
        }
    }
    return position
}

/**
 *
 * @param {string} s
 * @returns {parserResult}
 */
function parseChangeset(s) {
    // front,body
    const list = multiLineTextToArray(s)
    // get front label s and e positon
    const index = getFrontLabelPostion(list)
    const front = list.slice(0, index + 1).join('\n')
    const body = list.slice(index + 1).join('\n')
    return { front, body }
}

/**
 *
 * @param {string} s
 * @param {string} libname
 * @returns
 * @sample
 * ```
 * let s=`"@ymc/run-bash": patch`
 * let l='run-bash'
 * getVersionTypeInChangeset(s,l) //patch
 * ```
 */
function getVersionTypeInChangeset(s, libname) {
    // idea:def-libname-regexp -> match -> slice
    let res
    let match
    res = ''
    let reg
    reg = new RegExp(`\\".*${libname}\\": .*`, 'ig')
    match = s.match(reg)
    // log(reg, match);
    if (match) {
        // "@ymc/run-bash": patch -> patch
        res = match[0].split(':')[1].trim()
    }
    return res
}
export { parseChangeset, getVersionTypeInChangeset }
