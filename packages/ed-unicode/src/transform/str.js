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
 *
 * @param {string} unicode
 * @returns
 */
export function addUchar(unicode) {
    return unicode.replace(/^/, '\\u').replace(/ +/gi, '\\u')
}
/**
 * unicode to dec str
 * @param {string} unicode
 * @returns
 */
export function uni2str(unicode) {
    // add \u
    const code = addUchar(unicode)
    // console.log(code)
    // return eval("'" + unicode + "'")
    // return unescape(unicode.replace(/\u/g, '%u'))
    return new Function(`return '${code}'`)() // eslint-disable-line no-new-func
}
