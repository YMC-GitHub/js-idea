/**
 * get base64 text valid len and place-holders len
 * @param {string} b64
 * @returns
 */
export function getLens(b64) {
    const len = b64.length

    if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4')
    }

    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    let validLen = b64.indexOf('=')
    if (validLen === -1) validLen = len

    const placeHoldersLen = validLen === len ? 0 : 4 - (validLen % 4)

    return [validLen, placeHoldersLen]
}
/**
 *
 * @param {number} validLen 4*n
 * @param {number} placeHoldersLen 0,1,2,3
 * @returns
 */
function calByteLength(validLen, placeHoldersLen) {
    return ((validLen + placeHoldersLen) * 3) / 4 - placeHoldersLen
}

// base64 is 4/3 + up to two characters of the original data
/**
 * get base64-text bytes length
 * @param {string} b64
 * @returns
 */
export function getBase64TextByteLength(b64) {
    const lens = getLens(b64)
    const [validLen, placeHoldersLen] = lens
    return calByteLength(validLen, placeHoldersLen)
}

export function repeat(fn, count = 5) {
    for (let index = 0; index < count; index += 1) {
        fn()
    }
}
/**
 *
 * @param {string} text
 * @returns
 */
export function getHexcode(text) {
    return text
        .split('')
        .map(s => s.codePointAt(0).toString(16))
        .join('')
}
