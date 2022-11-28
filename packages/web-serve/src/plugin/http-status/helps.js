const { hasOwnProperty } = Object.prototype

/**
 * Create a map of message to status code.
 * @param {object} codes
 */
function createMessageToStatusCodeMap(codes) {
    const map = {}

    Object.keys(codes).forEach(code => {
        const message = codes[code]
        // feat: status to number
        const status = Number(code)

        // feat: lower message
        map[message.toLowerCase()] = status
    })

    return map
}

/**
 * Create a list of all status codes.
 * @param {object} codes
 */

function createStatusCodeList(codes) {
    return Object.keys(codes).map(code => Number(code))
}

export { hasOwnProperty, createMessageToStatusCodeMap, createStatusCodeList }
