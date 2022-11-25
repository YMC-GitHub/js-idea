import { getBase64FromBinary, getBinaryFromBase64 } from './transform/binary'
import { encodeUri, decodeUri } from './transform/uri'
// import { encodeUnit16, decodeUnit16 } from './transform/unit16'

/**
 *
 * @param {string} text
 * @returns
 */
export function encode(text) {
    return getBase64FromBinary(encodeUri(text))
}
/**
 *
 * @param {string} base64
 * @returns
 */
export function decode(base64) {
    return decodeUri(getBinaryFromBase64(base64))
}
