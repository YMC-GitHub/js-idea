/**
 * binary-format to base64-format - with Buffer.from
 * @param {string} text
 * @returns
 */
export const btoa = text => Buffer.from(text, 'binary').toString('base64')
/**
 * base64-format to binary-format - with Buffer.from
 * @param {string} base64
 * @returns
 */
export const atob = base64 => Buffer.from(base64, 'base64').toString('binary')

// method alias
export const getBase64FromBinary = btoa
export const getBinaryFromBase64 = atob

export const encode = btoa
export const decode = atob
