/* eslint-disable  no-unused-vars */
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
    // undefined,null
    if (!s) {
        return false
    }
    const type = typeof s
    const falseList = ['boolean', 'string', 'number', 'function']
    if (falseList.some(v => v === type)) return false
    if (type === 'object' && s.test) {
        // 'test' in s
        return true
    }
    // log(s, typeof s, 'test' in s)
    // return typeof s
    return false
}
// 'getType' is defined but never used                          no-unused-vars
/**
 *
 * @param {*} s
 * @returns {string}
 * @description
 * ```
 * alias of typeof
 * ```
 */
function getType(s) {
    return typeof s
}
function isFunction() {
    return typeof s === 'function'
}
function isString(s) {
    return s === 'string'
}
function isArray(s) {
    return Array.isArray(s)
}

// feat: custom fn in option
/**
 *
 * @param {{}} option
 * @param {{}} customFunMix
 * @param {string|string[]|undefined} allowkeys
 * @returns {{}}
 * @sample
 * ```
 * import customFunMix from  "custom-fun.js"
 * registerFnToOption(option,customFunMix,allowkeys)
 * registerFnToOption(option,customFunMix,'isFileMode,isFileTextMode,output')
 * ```
 */
function registerFnToOption(option = {}, customFunMix = {}, allowkeys = '') {
    // Default parameters should be last                            default-param-last
    let list = allowkeys || ''
    list = isArray(list) ? list : list.split(',')
    if (!list) {
        list = Object.keys(customFunMix)
    }
    list = list.filter(s => isString(s))

    /* eslint-disable no-param-reassign */
    list.forEach(name => {
        const fn = customFunMix[name]
        if (!option[name] && fn && isFunction(fn)) {
            option[name] = fn
        }
    })
    /* eslint-enable no-param-reassign */
    return option
}

/**
 *
 * @param {{}} option
 * @param {{}} customFunMix
 * @param {string|string[]|undefined} allowkeys
 * @returns {{}}
 */
function getMixFunFromOption(option = {}, customFunMix = {}, allowkeys = '') {
    let list = allowkeys || ''
    list = isArray(list) ? list : list.split(',')
    if (!list) {
        list = Object.keys(option)
    }
    list = list.filter(s => isString(s))

    /* eslint-disable no-param-reassign */
    list.forEach(name => {
        const fn = option[name]
        if (!customFunMix[name] && fn && isFunction(fn)) {
            customFunMix[name] = fn
        }
    })
    /* eslint-enable no-param-reassign */
    return customFunMix
}
export { isRegExp, isFunction, isString, isArray, registerFnToOption, getMixFunFromOption }
