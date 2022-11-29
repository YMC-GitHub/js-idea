/* eslint-disable max-len */

import { createCipheriv, createDecipheriv, getRandomBuffer, getHexCodeFromBuffer } from './helps'

const des = {
    name: 'des',
    description: 'encode and decode data - des algorithm',
    keywors: [],
    key: '',
    encoding: 'base64', // dec?hex?base64
    algorithm: { ecb: 'aes-256-cbc', cbc: 'aes-256-cbc' },
    encode(plaintext, iv) {
        const { key } = this
        const bufKey = Buffer.from(key)

        const bufIv = Buffer.from(iv || 0)
        // TypeError: Invalid initialization vector
        const cipher = createCipheriv(this.algorithm.cbc, bufKey, bufIv)
        cipher.setAutoPadding(true) // default true
        let ciph = cipher.update(plaintext, 'utf8', this.encoding)
        ciph += cipher.final(this.encoding)
        return ciph
    },
    decode(encodedtext, iv) {
        const { key } = this
        const bufKey = Buffer.from(key)
        const bufIv = Buffer.from(iv || 0)
        const decipher = createDecipheriv(this.algorithm.cbc, bufKey, bufIv)
        decipher.setAutoPadding(true)
        let txt = decipher.update(encodedtext, this.encoding, 'utf8')
        txt += decipher.final('utf8')
        return txt
    }
}
export {
    getRandomBuffer,
    getHexCodeFromBuffer,
    getRandomBuffer as genKey,
    getHexCodeFromBuffer as getKeyHexCode,
    getRandomBuffer as genIv,
    getHexCodeFromBuffer as getIvHexCode
}
export default des
// export default () => des
