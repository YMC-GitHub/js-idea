/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

// import { log, getRandomBuffer, getHexCodeFromBuffer } from './helps'
import des, { getRandomBuffer, getHexCodeFromBuffer } from './index'

const { log } = console
// log(des)
log('[task] encode/decode image uri')
const algorithm = 'aes-256-cbc'
const key = getRandomBuffer(32)
const iv = getRandomBuffer(16)
const str = '/upload/image/201602120012.jpg'
des.key = key
des.encoding = 'base64'
// log(`[info] uri: ${str}`)
// log(`[info] key: ${key.toString('hex')}`)
// log(`[info] iv: ${iv.toString('hex')}`)
// log(`[info] encode uri`)
const encodedText = des.encode(str, iv)
// log({ key: getHexCodeFromBuffer(key), iv: getHexCodeFromBuffer(iv), data: encodedText })
// log(`[info] decode uri`)
const decodedtext = des.decode(encodedText, iv)
// log({ key: getHexCodeFromBuffer(key), iv: getHexCodeFromBuffer(iv), data: decodedtext })
const info = {
    key: getHexCodeFromBuffer(key),
    iv: getHexCodeFromBuffer(iv),
    encoded: encodedText,
    decoded: decodedtext
}
log(info)
// https://www.cnblogs.com/chenjianxiang/p/5648772.html
// https://www.codeblocq.com/2016/06/DES-encryption-in-Node-and-JavaScript/
// https://github.com/brix/crypto-js
// https://www.geeksforgeeks.org/node-js-crypto-createcipheriv-method/

// export default des
//  node --no-warnings --loader ./scr/lib/esm-loader.js packages/ed-des/src/demo.js
