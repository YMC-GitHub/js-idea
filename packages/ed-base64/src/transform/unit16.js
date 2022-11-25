// https://developer.mozilla.org/zh-CN/docs/Web/API/btoa
// transfrom unit-16 text and unit8 text

// convert a Unicode string to a string in which
// each 16-bit unit occupies only one byte

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
function getUnit8FromUnit16(text) {
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
function getUnit16FromUnit8(text) {
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

// method alias
// export const encodeUnicode = getUnit8FromUnit16
// export const decodeUnicode = getUnit16FromUnit8

// export const encode = getUnit8FromUnit16
// export const decode = getUnit16FromUnit8
export {
    getUnit16FromUnit8,
    getUnit8FromUnit16,
    getUnit16FromUnit8 as encodeUnit16,
    getUnit8FromUnit16 as decodeUnit16,
    getUnit16FromUnit8 as encode,
    getUnit8FromUnit16 as decode
}
