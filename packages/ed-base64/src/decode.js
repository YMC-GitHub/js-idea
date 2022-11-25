/* eslint-disable import/prefer-default-export,no-multi-assign */
/* eslint-disable no-unused-vars,no-restricted-syntax */
/* eslint-disable no-plusplus,no-bitwise */
import { chars } from './bas64-chars'
/**
 *
 * @param {string} text
 * @param {string} map
 * @returns
 */
function decodeBase64(text, map) {
    let output = ''
    let chr1
    let chr2
    let chr3 = ''
    let enc1
    let enc2
    let enc3
    let enc4 = ''
    const keyStr = map || chars
    let i = 0
    if (text.length % 4 !== 0) {
        return ''
    }
    // let base64test = /[^A-Za-z0-9\+\/\=]/g
    // if (base64test.exec(text)) {
    //     return ''
    // }
    do {
        enc1 = keyStr.indexOf(text.charAt(i++))
        enc2 = keyStr.indexOf(text.charAt(i++))
        enc3 = keyStr.indexOf(text.charAt(i++))
        enc4 = keyStr.indexOf(text.charAt(i++))
        chr1 = (enc1 << 2) | (enc2 >> 4)
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
        chr3 = ((enc3 & 3) << 6) | enc4
        output += String.fromCharCode(chr1)
        if (enc3 !== 64) {
            output += String.fromCharCode(chr2)
        }
        if (enc4 !== 64) {
            output += String.fromCharCode(chr3)
        }
        chr1 = chr2 = chr3 = ''
        enc1 = enc2 = enc3 = enc4 = ''
    } while (i < text.length)
    return output
}
export { decodeBase64, decodeBase64 as decode }
