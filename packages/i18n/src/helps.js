/* eslint-disable no-use-before-define */
/**
 * is string and not empty
 * @param {*} s
 * @returns
 */
function validString(s) {
    return isString(s) && !isEmpty(s)
}
function isString(s) {
    return typeof s === 'string'
}
function isEmpty(s) {
    return s === '' || s === null || s === undefined
}
function isArray(s) {
    return Array.isArray(s)
}

/**
 *
 * @param {*} s
 * @returns
 * @description
 * ```
 * it is no safe--no perform, please only use in i18n.set
 * ```
 */
function isObject(s) {
    return typeof s === 'object'
}
/**
 *
 * @param {*} s
 * @returns
 */
function isDefine(s) {
    return s !== undefined
}
function doNothing() {}
export { isArray, isString, isObject, isDefine, isEmpty, validString, doNothing }
