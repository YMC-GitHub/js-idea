import './types'

const { log } = console
function isString(s) {
    return typeof s === 'string'
}
function isFunction(s) {
    return typeof s === 'function'
}
/**
 *
 * @param {string} likepath
 * @param {{split:string}} option
 */
function getDirLoc(likepath, option = {}) {
    const { split, splitReg } = {
        splitReg: /\/|\\/,
        split: '/',
        ...option
    }

    let list = likepath.split(splitReg || split)
    const { length } = list
    if (length > 1) {
        list = list.slice(0, length - 1)
        list = list.join(split)
    } else {
        list = ''
    }
    return list
}
export { log, isString, isFunction, getDirLoc }
