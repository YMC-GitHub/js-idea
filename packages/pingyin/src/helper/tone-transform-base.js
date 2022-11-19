// @ymc/extend-string-str2hex
// @ymc/extend-string-hex2str
// @ymc/extend-string-str2uni
// @ymc/extend-string-uni2str

// https://9to5answer.com/hex-to-string-amp-string-to-hex-conversion-in-nodejs
// https://9to5answer.com/hex-to-string-amp-string-to-hex-conversion-in-nodejs

// const convert = (from, to) => str => Buffer.from(str, from).toString(to)
// const utf8ToHex = convert('utf8', 'hex')
// const hexToUtf8 = convert('hex', 'utf8')
// @ymc/pinyin-transform-str2hex
// @ymc/pinyin-transform-hex2str

/**
 * dec str to hex str - with buffer
 * @param {string} str
 * @returns {string}
 */
export function str2hex(str) {
    const buf = Buffer.from(str, 'utf8')
    return buf.toString('hex')
}
/**
 * hex str to dec str - with buffer
 * @param {string} str
 * @returns {string}
 */
export function hex2str(str) {
    // const buf = new Buffer(str, 'hex')
    const buf = Buffer.from(str, 'hex')
    return buf.toString('utf8')
}
/**
 * dec str to uni str
 * @param {string} s
 * @returns {string}
 * @sample
 * ```
 * str2uni('ɑɑ̄ɑ́ɑ̌ɑ̀')//\u0251;\u0251;\u0251;\u0251;\u0251;\u0251;\u0251;\u0251;\u0251;
 *
 * ```
 */
export function str2uni(s, options = {}) {
    const option = {
        prefix: '\\u',
        spanChar: '', // ';'
        to: 'unicode',
        ...options
    }
    const { prefix, spanChar, to } = option
    let res = []
    let i = s.length
    /* eslint-disable no-plusplus */
    while (i--) {
        // dec->hex->uni
        let code = s.codePointAt(i)
        switch (to) {
            case 'hex':
                code = code.toString(16)
                break
            case 'dec':
                break
            case 'unicode':
            default:
                code = code.toString(16).padStart(4, 0)
                break
        }

        // code = `\\u${code}`
        res[i] = code
    }
    const ms = `${spanChar}${prefix}`
    if (res.length > 1) {
        res = `${prefix}${res.join(ms)}${spanChar}`
    } else {
        res = res.join(ms)
        res = `${prefix}${res}`
    }
    return res
}
/**
 * unicode to dec str
 * @param {string} unicode
 * @returns
 */
export function uni2str(unicode) {
    // return eval("'" + unicode + "'")
    // return unescape(unicode.replace(/\u/g, '%u'))
    return new Function(`return '${unicode}'`)() // eslint-disable-line no-new-func
}
