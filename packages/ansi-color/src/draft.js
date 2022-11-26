/*eslint-disable */
/** @typedef {[number,number]} stypeCodes */
/** @typedef {{open:string,close:string,regex:regex,codes:stypeCodes,wrap:function}} stype */
/** @typedef {{codes:stypeCodes}} stypeOption */
/** @typedef {(input: string,newline:boolean) => string} colorfunction */

/**
 * define ansi style
 * @param {stypeOption} style
 * @desciptyion
 * ```
 * ## task
 * - [x] set style.open with style.codes
 * - [x] set style.close with style.codes
 * - [x] set style.regex with style.codes
 * - [x] set style.wrap
 * ```
 * @returns {stype}
 */
const ansi = style => {
    const open = (style.open = `\u001b[${style.codes[0]}m`)
    const close = (style.close = `\u001b[${style.codes[1]}m`)
    const regex = (style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, 'g'))

    /**
     * wrap open , input and close
     * @param {string} input
     * @param {boolean} newline
     * @returns {string}
     */
    style.wrap = (input, newline) => {
        if (input.includes(close)) input = input.replace(regex, close + open)
        const output = open + input + close
        // see https://github.com/chalk/chalk/pull/92, thanks to the
        // chalk contributors for this fix. However, we've confirmed that
        // this issue is also present in Windows terminals
        // feat: support multi-line input
        return newline ? output.replace(/\r*\n/g, `${close}$&${open}`) : output
    }

    return style

    // return style.wrap
}

/**
 * define ansi color
 * @param {string} name
 * @param {number[]} codes
 * @param {*} type
 * @returns {colorfunction}
 */
const define = (name, codes, type) =>
    ansi({
        name,
        codes
    }).wrap

// color-api
// declare color here
const blue = define('blue', [34, 39])
const bold = define('bold', [1, 2])

export { ansi, define, blue, bold }
