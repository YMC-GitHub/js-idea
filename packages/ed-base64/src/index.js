export { getBase64FromBinary, getBinaryFromBase64 } from './transform/binary'
export { encodeUnicode, decodeUnicode } from './transform/uri'
// import { encodeUnicode, decodeUnicode } from './transform/unit16'

export { encode as encodeBase64 } from './encode'
export { decode as decodeBase64 } from './decode'
import { getBase64Chars, shuffle } from './chore'

export function randomKeys() {
    let keys = getBase64Chars()
    keys = shuffle(keys).join('')
    keys = `${keys}=`
    return keys
}

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
