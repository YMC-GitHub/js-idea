// style or compact:
/* eslint-disable  no-unused-vars,prefer-const */
/* eslint-disable  prefer-destructuring */
/* eslint-disable  func-names */

/* eslint-disable  max-len */
// other:
/* eslint-disable no-tabs */
/* eslint-disable  no-plusplus */
// danger:
/* eslint-disable  no-shadow */
/* eslint-disable  no-param-reassign */
/* eslint-disable  no-underscore-dangle */
/* eslint-disable  no-new-func */
/* eslint-disable  no-control-regex,no-bitwise */

/**
 * compare a or b
 * @param {*} a
 * @param {*} b
 * @returns
 */
function equals(a, b) {
    return a && a.toLowerCase() === b.toLowerCase()
}
function normalizeOption(options) {
    let option = { ...options }
    option.fixed = typeof option.fixed === 'number' ? option.fixed : 2
    option.spacer = typeof option.spacer === 'string' ? option.spacer : ' '
    return option
}
function normalizeBytes(bytes) {
    return typeof bytes === 'number' ? bytes : 0
}
function calculateSize(bytes, options = {}) {
    let { spec } = options
    // idea:
    // get-type,get-algorithm,get-magnitude
    // get-result,get-fixed,get-suffix,get-bits
    const type = equals(spec, 'si') ? ['k', 'B'] : ['K', 'iB']
    const algorithm = equals(spec, 'si') ? 1e3 : 1024
    const magnitude = (Math.log(bytes) / Math.log(algorithm)) | 0

    const result = bytes / algorithm ** magnitude
    const fixed = result.toFixed(options.fixed)
    let suffix

    if (magnitude - 1 < 3 && !equals(spec, 'si') && equals(spec, 'jedec')) type[1] = 'B'

    /* eslint-disable-next-line no-nested-ternary */
    suffix = magnitude ? `${type[0]}MGTPEZY`[magnitude - 1] + type[1] : (fixed | 0) === 1 ? 'Byte' : 'Bytes'

    return {
        suffix,
        magnitude,
        result,
        fixed,
        bits: { result: result / 8, fixed: (result / 8).toFixed(options.fixed) }
    }
}
const units = 'BKMGTPEZY'.split('')
function toUnit(bytes, unit, spec) {
    const algorithm = equals(spec, 'si') ? 1e3 : 1024
    let position = units.indexOf(typeof unit === 'string' ? unit[0].toUpperCase() : 'B')
    let result = bytes

    if (position === -1 || position === 0) return result.toFixed(2)
    for (; position > 0; position--) result /= algorithm
    return result.toFixed(2)
}

function filesize(bytes, options) {
    // idea:
    // normalize-bytes,normalize-option
    bytes = typeof bytes === 'number' ? bytes : 0
    options = options || {}
    options.fixed = typeof options.fixed === 'number' ? options.fixed : 2
    options.spacer = typeof options.spacer === 'string' ? options.spacer : ' '

    // let bytes =normalizeBytes(bytes)
    // let options = normalizeOption(options)
    /**
     * caculate
     * @param {string} spec si is 1000, other 1024
     * @returns
     */
    options.calculate = function (spec) {
        return calculateSize(bytes, { spec, ...options })
    }

    options.to = function (unit, spec) {
        return toUnit(bytes, unit, spec)
    }

    /**
     * to human read-able
     * @param {string} spec
     * @returns
     */
    options.human = function (spec) {
        const output = calculateSize(bytes, { spec, ...options })
        // let { fixed, spacer, suffix } = output
        return output.fixed + options.spacer + output.suffix
    }

    return options
}
export default filesize
