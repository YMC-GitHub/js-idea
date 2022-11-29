import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const { log } = console
/**
 *
 * @param {number} size
 * @returns
 */
function getRandomBuffer(size) {
    return randomBytes(size)
}
/**
 *
 * @param {Buffer} buf
 * @returns
 */
function getHexCodeFromBuffer(buf) {
    return buf.toString('hex')
}

export { log, getRandomBuffer, getHexCodeFromBuffer, createCipheriv, createDecipheriv }
