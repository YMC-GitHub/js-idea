/* eslint-disable no-unused-vars,no-param-reassign */
import * as styles from '@ymc/extend-string'
// import  * as styles from '@ymc/extend-string/src/enhance'
/**
 * stylize param-json - nano-parser-flags
 * @param {object} flags
 * @param {likeCamelizeFlagsOption} options
 * @returns
 */
function stylizeFlags(flags = {}, options = {}) {
    // let res = {}
    const option = {
        slim: true,
        style: 'camelize', // get more infomation on extend-string
        ...options
    }
    if (option[`noAuto-${options.style}`.camelize()]) return flags
    // typeof ''[options.style]==="function"
    Object.keys(flags).forEach(str => {
        // const ck = str[options.style]() //use when extend string.prototype
        const ck = styles[options.style](str) // use when do not extend string.prototype
        // res[ck]=flags[k]
        if (ck !== str) {
            flags[ck] = flags[str]
            if (option.slim) {
                delete flags[str]
            }
        }
    })
    return flags
}

/**
 * camelize param-json - nano-parser-flags
 * @param {object} flags
 * @param {camelizeFlagsOption} options
 * @returns
 */
function camelizeFlags(flags = {}, options = {}) {
    // let res = {}
    const option = {
        slim: true,
        ...options
    }
    option.style = 'camelize'
    if (option.noAutoCamelize) return flags
    stylizeFlags(flags, option)
    return flags
}

export { camelizeFlags, stylizeFlags }
