/*eslint-disable */

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

/**
 *
 * @param {string} text
 * @returns
 * @sample
 * ```
 * btoa(getUnit8FromUnit16("☸☹☺☻☼☾☿"))
 * getBase64FromUnicode(getUnit8FromUnit16("☸☹☺☻☼☾☿"))
 * ```
 * @decsiption
 * ```
 * convert a Unicode string to a string in which
 * each 16-bit unit occupies only one byte
 * ## why?
 * - [x] encode unit-16 text to unit8 text
 * ## idea:
 * - [x] unit-16 text -> Uint16Array -> Uint8Array -> unit-8 text
 * ```
 */
export function getUnit8FromUnit16(text) {
    const codeUnits = new Uint16Array(text.length)
    for (let i = 0; i < codeUnits.length; i += 1) {
        codeUnits[i] = text.charCodeAt(i)
    }
    const charCodes = new Uint8Array(codeUnits.buffer)
    let result = ''
    for (let i = 0; i < charCodes.byteLength; i += 1) {
        result += String.fromCharCode(charCodes[i])
    }
    return result
}

/**
 *
 * @param {string} text
 * @returns
 * @sample
 * ```
 * let encoded = btoa(getUnit8FromUnit16("☸☹☺☻☼☾☿")
 * getUnit16FromUnit8(atob(encoded))
 *
 * encoded = getUnicodeFromBase64(getUnit8FromUnit16("☸☹☺☻☼☾☿")
 * getUnit16FromUnit8(getUnicodeFromBase64(encoded))
 * ```
 * @decsiption
 * ```
 * ## why?
 * - [x] decode unit-16 text from unit8 text
 * ## idea:
 * - [x] unit8-text -> Uint8Array -> Uint16Array -> unit-16 text
 * ```
 */
export function getUnit16FromUnit8(text) {
    const bytes = new Uint8Array(text.length)
    for (let i = 0; i < bytes.length; i += 1) {
        bytes[i] = text.charCodeAt(i)
    }
    const charCodes = new Uint16Array(bytes.buffer)
    let result = ''
    for (let i = 0; i < charCodes.length; i += 1) {
        result += String.fromCharCode(charCodes[i])
    }
    return result
}
export function countBytes(text) {
    const codeUnits = new Uint16Array(text.length)
    for (let i = 0; i < codeUnits.length; i += 1) {
        codeUnits[i] = text.charCodeAt(i)
    }
    // return codeUnits.length
    const charCodes = new Uint8Array(codeUnits.buffer)
    // return charCodes.length
    let result = ''
    for (let i = 0; i < charCodes.byteLength; i += 1) {
        result += String.fromCharCode(charCodes[i])
    }
    // return result
    return result.length
}

// /**
//  *
//  * @param {string} text
//  * @returns
//  */
// export function countBytes(text) {
//     //desc:
//     //replace all non-ascii characters with
//     //hex escape sequences (each denoted by a preceeding %)

//     let escstr = encodeURIComponent(text)

//     //desc: replace the escapes with binary strings
//     let binstr = escstr.replace(/%([0-9A-F]{2})/gi, function (match, hex) {
//         let i = parseInt(hex, 16)
//         return String.fromCharCode(i)
//     })
//     return binstr.length
// }

export function countCodePoints(str) {
    let point
    let index
    let width = 0
    let len = 0
    for (index = 0; index < str.length; ) {
        point = str.codePointAt(index)
        width = 0
        while (point) {
            width += 1
            point >>= 8
        }
        index += Math.round(width / 2)
        len += 1
    }
    return len
}

/**
 * Create a unicode character from the codepoint of a Chinese character
 * @param {number | string} codepoint codepoint of Chinese character as number or string type
 * @example
 * ```
 * codepointToUnicode(0x6211)   // 我
 * codepointToUnicode('0x6211') // 我
 * codepointToUnicode('U+6211') // 我
 * codepointToUnicode('6211')   // 我
 * ```
 */
export const codepointToUnicode = codepoint => {
    if (typeof codepoint === 'string') {
        let codepointStr = codepoint.replace('U+', '')
        if (!/^0x/.test(codepointStr)) {
            codepointStr = `0x${codepointStr}`
        }
        return String.fromCodePoint(parseInt(codepointStr))
    }
    return String.fromCodePoint(codepoint)
}

/**
 *
 * @param {string} text
 * @returns
 */
export function countWord(text) {
    const regG =
        /[a-zA-Z0-9_'\u0392-\u03c9\u0400-\u04FF\u0027]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|[\u00E4\u00C4\u00E5\u00C5\u00F6\u00D6]+|[\u0531-\u0556\u0561-\u0586\u0559\u055A\u055B]+|\w+/g

    const match = text.match(regG)
    return match ? match.length : 0
}

/**
 *
 * @param {string} text
 * @returns
 */
export function countHanzi(text) {
    let count = 0
    const reg = /[\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/
    for (const char of text) {
        if (char.match(reg)) {
            count += 1
        }
    }
    return count
}
// \u0251\u0251\u0304\u0251\u0301\u0251\u030c\u0251\u0300

/**
 *
 * @param {string} text
 * @returns
 */
export function countDigit(text) {
    let count = 0
    const reg = /[0-9]/
    for (const char of text) {
        if (char.match(reg)) {
            count += 1
        }
    }
    return count
}
/**
 *
 * @param {string} text
 * @returns
 */
export function countByteType(text) {
    let exts = 0
    let base = 0

    const reg = /[^\x00-\xff]/
    for (const char of text) {
        if (char.match(reg)) {
            //no-two-byte
            exts += 1
        } else {
            base + -1
        }
    }
    return [base, exts]
}

export function countChars(val) {
    // https://zhuanlan.zhihu.com/p/370558760
    let bo = 0
    let b2 = 0
    let digit = 0
    let hanzi = 0
    for (let i = 0; i < val.length; i++) {
        const c = val.charAt(i)
        if (c.match(/[\u2E80-\u2FD5\u3190-\u319f\u3400-\u4DBF\u4E00-\u9FCC\uF900-\uFAAD]/)) {
            hanzi++
        }
        if (c.match(/[^\x00-\xff]/)) {
            // no-2-byte char
            bo += 1
        } else {
            // hanzi
            b2 += 1
        }
        if (c.match(/[0-9]/)) {
            // number 0-9
            digit += 1
        }
    }
    return {
        // englishLetter: ec,
        zishu: digit + hanzi,
        hanzi: hanzi,
        biaodian: bo - hanzi,
        zimu: b2 - digit,
        zifu: hanzi * 2 + (bo - hanzi) * 2 + b2 // length
    }
    // return len
}

// base hanzi
// 4E00-9FA5
// base hanzi extend
// 9FA6-9FFF
// hanzi-extend-a
// 3400-4DBF
// hanzi-extend-b
// 20000-2A6DF
// hanzi-extend-c
// 2A700-2B739
// hanzi-extend-d
// 2B740-2B81D
// hanzi-extend-e
// 2B820-2CEA1
// hanzi-extend-f
// 2CEB0-2EBE0
// hanzi-extend-g
// 30000-3134A
// hanzi-extend-h
// 31350-323AF
// kangxi-bushou
// 2F00-2FD5
// kangxi-bushou-extend
// 2E80-2EF3
// compact-hanzi
// F900-FAD9
// compact-hanzi-extend
// 2F800-2FA1D
// hanzi-bihua
// 31C0-31E3
// hanzi-jiegou
// 2FF0-2FFB
// hanzi-zhuyin
// 3105-312F
// hanzi-zhuyin-extend
// 31A0-31BF
// https://unicode-table.com/en/alphabets/chinese/
export function getTextLength(string) {
    return Array.from(string).length
}
// eq:
// '\u01D1'.normalize() === '\u004F\u030C'.normalize()
/**
 *
 * @param {string} text
 * @returns  {number[]}
 */
function getCodePoint(text) {
    // return Array.from(text).map(s => s.codePointAt(0))
    const res = []
    for (const s of text) {
        // res.push(s.codePointAt(0))
        res.push(s.charCodeAt(0))
    }
    return res
}
function checkCodePointType() {
    // base
    let range
    // 128
    range = [0x0000, 0x007f]
    range = [0x0080, 0x007ff]
}

// https://www.cnblogs.com/develon/p/14036765.html
function pow(n) {
    const [x, y] = n.split('^')
    return x ** y
}

export function isInRange(n, range) {
    const [s, e] = range
    return n >= s && n <= e
}
export function getUtf8CodeByteType(n) {
    // utf-8
    const rangs = [
        [0x0000, 0x007f],
        [0x0080, 0x07ff],
        [0x0800, 0xffff],
        [0x010000, 0x10ffff]
    ]
    if (isInRange(n, rangs[0])) {
        return '1 byte'
    }
    if (isInRange(n, rangs[1])) {
        return '2 byte'
    }
    if (isInRange(n, rangs[2])) {
        return '3 byte'
    }
    if (isInRange(n, rangs[3])) {
        return '4 byte'
    }
}
const H = [0xd800, 0xdbff] // 1024
const L = [0xdc00, 0xdfff] // 1024
export function isH(n) {
    const [s, e] = H
    return n >= s && n <= e
}
export function isL(n) {
    const [s, e] = L
    return n >= s && n <= e
}
export function getUtf16CodeByteType(n) {
    // utf-8
    const rangs = [
        [0x0000, 0xffff],
        [0x010000, 0x10ffff]
    ]
    if (isInRange(n, rangs[0])) {
        // isBase
        return '2 byte'
    }
    if (isInRange(n, rangs[1])) {
        // isH or isL
        return '4 byte'
    }
}

// function unit8ToUnit16() {}

export function codePoint2Unit16(cp) {
    const type = getUtf16CodeByteType(cp)
    if (type == '2 byte') {
        return cp
    }
    let H
    let L
    H = Math.floor((cp - 0x10000) / 0x400) + 0xd800

    L = ((cp - 0x10000) % 0x400) + 0xdc00
    return [H, L]
}

// const { log } = console
// // log(0xd800, 127, String.fromCharCode(593, 772), String.fromCharCode(65))
// // log(0xd800, 127, String.fromCodePoint(593, 772), String.fromCodePoint(65))
// // // log(codePoint2Unit16(0x1d306))
// // // log(String.fromCodePoint(...codePoint2Unit16(0x1d306)))
// // //dec2hex,hex2dec,
// // log((55296).toString(16), 0xd800, (0xd800).toString())

// //65536
// // log(Math.pow(2, 16)) //2^16=65536
// // log(pow('2^16'))

// // log(getCodePoint('ɑ̄'))
// const tone = 'ɑɑ̄ɑ́ɑ̌ɑ̀'
// log(tone.charAt(2))
// let text, codepoint
// log(str2uni(tone))
// log(`[info] get text length`)
// log(getTextLength(tone))

// log(`[info] get code point`)
// codepoint = getCodePoint(tone)
// log(codepoint)
// // log(codepoint.map(v => getUtf8CodeByteType(v)))
// log(codepoint.map(v => v.toString(16)))
// // log(`[info] from code point`)
// // log(fromCodePoint(...codepoint))

// text = `\u{1d306}` //two-bytes-char
// log(getTextLength(`\u0251\u0251\u0304\u0251\u0301\u0251\u030c\u0251\u0300`))
// // log(getTextLength(text)) //1
// // log(text.length) //2
// // log(`[info] get code point`)
// // log(getCodePoint(text))

// // for (let s of text) {
// //     log(s)
// // }

// // log(countBytes(tone)) //18
// // // log(countBytes(tone)) //18
// // log(countCodePoints(tone)) //9
// // log(countChars(tone)) //9

// // text = 'こんにちは世界!'
// // log(tone.length) //9 - byte length
// // log(countBytes(tone)) //18
// // // log(countBytes(tone)) //18
// // log(countCodePoints(tone)) //9
// // log(countChars(tone)) //9

// // log(text.length)
// // log(countBytes(text))
// // log(countCodePoints(text))
// // log(countChars(text))

// //http://www.ruanyifeng.com/blog/2014/12/unicode.html
// //js-unit8:  one-byte as one char , or two-byte as one char
// //js-unit16:  two-byte as one char
// //unicode ? UCS-2
// //charset:unicode
// //encoding:

// //'\u01D1'.normalize() === '\u004F\u030C'.normalize()

// // log(getUnit8FromUnit16(tone))
// // log(getUnit16FromUnit8(getUnit8FromUnit16(tone)))

// //idea:
// //count-unicode,hanzi,biaodian,zimu,zifu,zishu,
// //fix text.length when > utf-16

// // zishu: inum + iTotal,
// // hanzi: iTotal,
// // biaodian: sTotal - iTotal,
// // zimu: eTotal - inum,
// // zifu: iTotal * 2 + (sTotal - iTotal) * 2 + eTotal // length
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/ed-unicode/src/helps.js
