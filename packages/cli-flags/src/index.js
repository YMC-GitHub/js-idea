/* eslint-disable no-param-reassign */
import { camelize, underscoped } from '@ymc/extend-string'

/** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} camelizeFlagsOption */
/** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} likeCamelizeFlagsOption */

/** @typedef {{style:string,styleHandle:()=>string}} stylizeOption */

/**
 * stylize param-json - nano-parser-flags
 * @param {object} flags
 * @param {likeCamelizeFlagsOption & stylizeOption} options
 * @returns
 */
function stylizeFlags(flags = {}, options = {}) {
    // let res = {}
    const option = {
        slim: true,
        style: 'camelize', // get more infomation on extend-string
        styleHandle: camelize,
        ...options
    }
    const stylize = option.styleHandle
    if (option[camelize(`noAuto-${options.style}`)]) return flags
    // typeof ''[options.style]==="function"
    Object.keys(flags).forEach(str => {
        const ck = stylize(str)
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
    if (option.noAutoCamelize) return flags
    Object.keys(flags).forEach(k => {
        const ck = camelize(k)
        // res[ck]=flags[k]
        if (ck !== k) {
            flags[ck] = flags[k]
            if (option.slim) {
                delete flags[k]
            }
        }
    })
    return flags
}
/**
 * underscoped param-json - nano-parser-flags
 * @param {object} flags
 * @param {likeCamelizeFlagsOption} options
 * @returns
 */
function underscopedFlags(flags = {}, options = {}) {
    return stylizeFlags(flags, { ...options, style: 'underscoped', styleHandle: underscoped })
}

export { stylizeFlags, camelizeFlags, underscopedFlags }
