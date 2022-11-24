/* eslint-disable no-unused-vars,no-restricted-syntax */
const { log } = console
export function getBinFormatCharsFromDecFormatChar(text) {
    let code = ''
    for (const i of text) {
        let char = i.charCodeAt().toString(2)
        for (let a = 0; a <= 8 - char.length; a += 1) {
            char = 0 + char
        }
        code += char
    }
    return code
}
// greatest common divisor
/**
 *
 * @param {number} a
 * @param {number} b
 */
export function getGreatestCommonDivisor(a, b) {
    let res = 0
    const min = Math.min(a, b)
    for (let i = min; i > 0; i -= 1) {
        if (a % i === 0 && b % i === 0) {
            res = i
            break
        }
    }
    return res
}

// least common multiple
export function getLeastCommomMultiple(a, b) {
    // let res = 0
    // let max = Math.min(a, b)
    // for (let i = max; i <= a * b; i += 1) {
    //     if (i % a == 0 && i % b == 0) {
    //         res = i
    //         break
    //     }
    // }
    // return res
    // or:
    return (a * b) / getGreatestCommonDivisor(a, b)
}
export function paddStart(char, max = 8, s = '0') {
    let res = char
    for (let a = 0; a <= max - res.length; a += 1) {
        res = `${s}${res}`
    }
    return res
}
export function repeatStr(max = 8, s = '0') {
    let res = ''
    for (let a = 0; a <= max - res.length; a += 1) {
        res = `${s}${res}`
    }
    return res
}

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
export function fromCharCode(range) {
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
export function getCharsInRanges(ranges) {
    const res = []
    ranges.forEach(range => {
        res.push(fromCharCode(range))
    })
    return res.flat(Infinity)
}
/**
 *
 * @param {number[]} list
 * @returns
 */
export function getCharsInDiscrete(list) {
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
export function getBase64Chars() {
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
 * shuffle array - vs array.sort+Math.random
 * @param {[]} array
 * @returns {[]}
 */
export function shuffle(array) {
    const cache = [...array]
    // Fisher–Yates
    let j
    let x
    let i
    const len = cache.length
    const { floor, random } = Math
    for (i = len; i; i -= 1) {
        j = floor(random() * i)
        x = cache[i - 1]
        cache[i - 1] = cache[j]
        cache[j] = x
    }
    return cache
}
