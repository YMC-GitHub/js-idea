// import { str2hex, hex2str } from './transform/hex'
import shuffle from './helper/shuffle-array'
import randomFnGenerateor from './helper/random'

// idea:str2hex,randomHex,hex2str,str2buf
// loc2bin,bin2buf

/**
 * get text from asii range
 * @param {number[]} range
 * @returns {string[]}
 * @sample
 * ```
 * fromCharCode([48,57])//0-9
 * fromCharCode([65,90])//A-Z
 * fromCharCode([97,121])//a-z
 * ```
 */
function fromCharCode(range) {
    const res = []
    const [s, e] = range
    for (let i = s; i <= e; i += 1) {
        res.push(String.fromCharCode(i))
    }
    return res
}

// bin,oct,dec,hex,..
// base64

/**
 *
 * @param {range[]} ranges
 * @returns {string[]}
 * @sample
 * ```
 * getCharsInRanges([[48,57],[65,90]],[97,121])
 * ```
 */
function getCharsInRanges(ranges) {
    const res = []
    ranges.forEach(range => {
        res.push(fromCharCode(range))
    })
    return res.flat(Infinity)
}

/**
 *
 * @returns {string[]}
 * @sample
 * ```
 * getEnglishChars().join('')
 * //abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ
 * ```
 */
function getEnglishChars() {
    // https://www.ascii-code.com/
    // simboy,dec,oct,hex,bin,htmlnumber,htmlenty
    // 0-9: [48,57]
    // A-Z: [65,90]
    // a-z: [97,122]
    const res = []
    const ranges = [
        [97, 121],
        [65, 90]
    ]
    ranges.forEach(range => {
        res.push(fromCharCode(range))
    })
    return res.flat(Infinity)
}

/**
 * get random enlish chars
 * @param {number} length
 * @returns {string}
 * @sample
 * ```
 * randomEnglishChars(16)
 * //bdBSwheIpFLNlsCZ
 * ```
 */
function randomEnglishChars(length) {
    let chars = getEnglishChars()
    let res = []
    for (let i = 0; i < 100000; i += 1) {
        chars = shuffle(chars)
    }
    res = chars.slice(0, length)
    return res.join('')
}

/**
 *
 * @returns {string}
 * @sample
 * ```
 * getHexChars().join('')
 * //0123456789abcdef
 * ```
 */
function getHexChars() {
    return getCharsInRanges([
        [48, 57],
        [97, 97 + 6 - 1]
    ])
}

/**
 * get random hex chars
 * @param {number} length
 * @returns {string}
 * @sample
 * ```
 * randomHexChars(16)
 * //5364bc728ad190ef
 * ```
 */
function randomHexChars(length) {
    let chars = getHexChars()
    // log(chars)
    let res = []
    for (let i = 0; i < 100000; i += 1) {
        chars = shuffle(chars)
    }
    res = chars.slice(0, length)
    return res.join('')
}

/**
 * get base32 chars
 * @returns
 * @sample
 * ```
 * getBase32Chars().join('')
 * //123456789ABCDEFGHJKLMNOPQRTUVWXY
 * //with out '0ISZ'
 * ```
 */
function getBase32Chars() {
    const list = getCharsInRanges([
        [48, 57],
        [65, 90]
    ])
    // del 0,I,S,Z
    const res = []
    list.forEach(v => {
        if ('0ISZ'.indexOf(v) === -1) {
            res.push(v)
        }
    })
    return res
}
/**
 * get random base32 chars
 * @param {number} length
 * @returns {string}
 * @sample
 * ```
 * randomBase32Chars(16)
 * //TJLYXPN81BQ7KMUG
 * ```
 */
const randomBase32Chars = randomFnGenerateor(getBase32Chars)
/**
 *
 * @param {number[]} list
 * @returns
 */
function getCharsInDiscrete(list) {
    return list.map(v => String.fromCharCode(v))
}

/**
 * get base64 chars - table
 * @returns
 * @sample
 * ```
 * getBase64Chars().join('')
 * //ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./
 * ```
 */
function getBase64Chars() {
    // https://base64.guru/learn/base64-characters
    // https://www.iana.org/assignments/character-sets/character-sets.xhtml
    // letters,digits,symbols
    // A-Z: [65,90]
    // a-z: [97,122]
    // 0-9: [48,57]
    // +,/: 43,47

    // .,/:46,47

    const res = getCharsInRanges([
        [65, 90],
        [97, 122],
        [48, 57]
    ])
    // res.push(...getCharsInDiscrete([43, 47]))
    res.push(...getCharsInDiscrete([46, 47]))
    return res
}

/**
 * get random base64 chars - random
 * @param {number} length
 * @returns {string}
 * @sample
 * ```
 * randomBase64Chars(16)
 * //DBfz.472cjqASWvi
 * ```
 */
const randomBase64Chars = randomFnGenerateor(getBase64Chars)

// ^[A-Za-z0-9+/]+={0,2}$

// /**
//  * get base64 chars - table
//  * @returns
//  * @sample
//  * ```
//  * getMiscChars().join('')
//  * //ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./
//  * ```
//  */
// function getMiscChars() {
//     // http://www.moe.gov.cn/jyb_sjzl/ziliao/A19/201001/t20100115_75611.html
//     // https://www.cnblogs.com/lsgxeva/p/10120275.html
//     // https://www.zhihu.com/question/21763766
//     // [32,47]
//     // [58,64]
//     // [91,96]
//     // [123,126]

//     const res = getCharsInRanges([[32, 47][(58, 64)], [91, 96], [123, 126]])

//     // res.push(...getCharsInDiscrete([46, 47]))
//     return res
// }

export {
    shuffle,
    getEnglishChars,
    randomEnglishChars,
    getHexChars,
    randomHexChars,
    getBase32Chars,
    randomBase32Chars,
    getBase64Chars,
    randomBase64Chars
}
