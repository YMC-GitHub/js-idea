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
    options = options || {}
    options.fixed = typeof options.fixed == 'number' ? options.fixed : 2
    options.spacer = typeof options.spacer == 'string' ? options.spacer : ' '
    return options
}
let units = 'BKMGTPEZY'.split('')

function filesize(bytes, options) {
    //idea:
    // normalize-bytes,normalize-option
    bytes = typeof bytes == 'number' ? bytes : 0
    options = options || {}
    options.fixed = typeof options.fixed == 'number' ? options.fixed : 2
    options.spacer = typeof options.spacer == 'string' ? options.spacer : ' '

    /**
     * caculate
     * @param {string} spec si is 1000, other 1024
     * @returns
     */
    options.calculate = function (spec) {
        //idea:
        //get-type,get-algorithm,get-magnitude
        //get-result,get-fixed,get-suffix,get-bits
        let type = equals(spec, 'si') ? ['k', 'B'] : ['K', 'iB']
        let algorithm = equals(spec, 'si') ? 1e3 : 1024
        let magnitude = (Math.log(bytes) / Math.log(algorithm)) | 0

        let result = bytes / Math.pow(algorithm, magnitude)
        let fixed = result.toFixed(options.fixed)
        let suffix

        if (magnitude - 1 < 3 && !equals(spec, 'si') && equals(spec, 'jedec')) type[1] = 'B'

        suffix = magnitude ? (type[0] + 'MGTPEZY')[magnitude - 1] + type[1] : (fixed | 0) === 1 ? 'Byte' : 'Bytes'

        return {
            suffix: suffix,
            magnitude: magnitude,
            result: result,
            fixed: fixed,
            bits: { result: result / 8, fixed: (result / 8).toFixed(options.fixed) }
        }
    }

    options.to = function (unit, spec) {
        let algorithm = equals(spec, 'si') ? 1e3 : 1024
        let position = units.indexOf(typeof unit == 'string' ? unit[0].toUpperCase() : 'B')
        let result = bytes

        if (position === -1 || position === 0) return result.toFixed(2)
        for (; position > 0; position--) result /= algorithm
        return result.toFixed(2)
    }

    /**
     * to human read-able
     * @param {string} spec
     * @returns
     */
    options.human = function (spec) {
        let output = options.calculate(spec)
        // let { fixed, spacer, suffix } = output
        return output.fixed + options.spacer + output.suffix
    }

    return options
}
export default filesize
