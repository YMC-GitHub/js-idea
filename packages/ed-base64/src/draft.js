/**
 *
 * @param {string} text
 * @returns
 */
export function encodeBase64(text, from = 'utf8') {
    return Buffer.from(text, from).toString('base64')
}
/**
 *
 * @param {string} base64
 * @returns
 */
export function decodeBase64(base64, to) {
    return Buffer.from(base64, 'base64').toString(to)
}

/**
 *
 * @param {string} plainText
 * @returns
 */
export function encodePlainTextToBase64(plainText) {
    return Buffer.from(plainText).toString('base64')
}
/**
 *
 * @param {string} base64
 * @returns
 */
export function decodePlainTextFromBase64(base64) {
    return Buffer.from(base64, 'base64').toString()
}

/**
 *
 * @param {string} hexText
 * @returns
 */
export function encodeHexTextToBase64(hexText) {
    return encodeBase64(hexText, 'hex')
}

/**
 *
 * @param {string} base64
 * @returns
 */
export function decodeHexTextFromBase64(base64) {
    return encodeBase64(base64, 'utf8')
}

/**
 *
 * @param {Buffer} bitmap
 * @returns
 */
export function encodeBitmapToBase64(bitmap) {
    return Buffer.from(bitmap).toString('base64')
}
/**
 *
 * @param {string} base64
 * @returns {Buffer}
 */
export function decodeBitMapFromBase64(base64) {
    return Buffer.from(base64, 'base64')
}
