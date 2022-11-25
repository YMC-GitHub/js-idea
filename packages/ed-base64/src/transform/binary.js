/**
 * binary-format to base64-format - with Buffer.from
 * @param {string} text
 * @returns
 */
const btoa = text => Buffer.from(text, 'binary').toString('base64')
/**
 * base64-format to binary-format - with Buffer.from
 * @param {string} base64
 * @returns
 */
const atob = base64 => Buffer.from(base64, 'base64').toString('binary')

export { btoa, atob, btoa as getBase64FromBinary, atob as getBinaryFromBase64 }
