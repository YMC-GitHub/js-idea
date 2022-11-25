import { getBase64Chars, shuffle } from './chore'

// import { getBase64FromBinary, getBinaryFromBase64 } from './transform/binary'
import { encodeUri, decodeUri } from './transform/uri'
import { encodeUnit16, decodeUnit16 } from './transform/unit16'
import { encodeUtf8, decodeUtf8 } from './transform/utf8'

import { encodeBase64 } from './encode'
import { decodeBase64 } from './decode'

function randomKeys() {
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
function encode(text) {
    // return getBase64FromBinary(encodeUri(text))
    return encodeBase64(encodeUri(text))
}
/**
 *
 * @param {string} base64
 * @returns
 */
function decode(base64) {
    // return decodeUri(getBinaryFromBase64(base64))
    return decodeUri(decodeBase64(base64))
}

export {
    encodeUri,
    decodeUri,
    encodeUnit16,
    decodeUnit16,
    encodeUtf8,
    decodeUtf8,
    // getBase64FromBinary,
    // getBinaryFromBase64,
    randomKeys,
    encodeBase64,
    decodeBase64,
    encode,
    decode
}
