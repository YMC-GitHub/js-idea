/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

// import { log, getRandomBuffer, getHexCodeFromBuffer } from './helps'
import des, { getRandomBuffer, getHexCodeFromBuffer } from './index'

const { log } = console
// log(des)
log('[task] encode/decode image uri')
const str = '/upload/image/201606300005.jpg'

let encoding = 'base64'
let algorithm = 'aes-256-cbc'

let key = getRandomBuffer(32)
let iv = getRandomBuffer(16)
// encoding = 'hex'
algorithm = 'aes-128-cbc'
if (algorithm === 'aes-128-cbc') {
    //Invalid key length
    //when algorithm='aes-128-cbc'
    //key=getRandomBuffer(32)
    key = getRandomBuffer(16)
    iv = getRandomBuffer(16)
}

des.key = key
des.encoding = encoding
des.algorithm = { ecb: algorithm, cbc: algorithm }
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
