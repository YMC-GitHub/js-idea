/**
 * dec str to hex str - with buffer
 * @param {string} str
 * @returns {string}
 */
export function str2hex(str) {
    const buf = Buffer.from(str, 'utf8')
    return buf.toString('hex')
}

/**
 * hex str to dec str - with buffer
 * @param {string} str
 * @returns {string}
 */
export function hex2str(str) {
    // const buf = new Buffer(str, 'hex')
    const buf = Buffer.from(str, 'hex')
    return buf.toString('utf8')
}
