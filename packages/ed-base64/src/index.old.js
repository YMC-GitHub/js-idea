import { getBase64FromBinary, getBinaryFromBase64 } from './transform/binary'
import { encodeUnicode, decodeUnicode } from './transform/uri'
// import { encodeUnicode, decodeUnicode } from './transform/unit16'

/**
 *
 * @param {string} text
 * @returns
 */
export function encode(text) {
    return getBase64FromBinary(encodeUnicode(text))
}
/**
 *
 * @param {string} base64
 * @returns
 */
export function decode(base64) {
    return decodeUnicode(getBinaryFromBase64(base64))
}
