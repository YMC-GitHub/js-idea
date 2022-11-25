const CODE_EXPRESSION = /%([0-9A-F]{2})/g

/**
 * get char from hex code
 * @param {*} part
 * @param {string} hex
 * @returns
 */
const getCharFromHexCode = (part, hex) => String.fromCharCode(parseInt(hex, 16))

/**
 * encode uri chars
 * @param {string} text
 * @returns
 */
const encodeUri = text => {
    const safeText = encodeURIComponent(text)
    return safeText.replace(CODE_EXPRESSION, getCharFromHexCode)
}

/**
 * decode uri chars
 * @param {string} text
 * @returns
 */
const decodeUri = text => {
    let result = ''
    for (let i = 0; i < text.length; i += 1) {
        const code = text.charCodeAt(i)
        result += '%'
        if (code < 16) {
            result += '0'
        }
        result += code.toString(16)
    }
    return decodeURIComponent(result)
}

// method alias
// export const encodeUnicode = encodeUri
// export const decodeUnicode = decodeUri

// export const encode = encodeUri
// export const decode = encodeUri
export { encodeUri, decodeUri, encodeUri as encode, decodeUri as decode }
