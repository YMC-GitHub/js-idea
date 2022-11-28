/* eslint-disable  no-restricted-globals */

import codes from './codes.json'
import { hasOwnProperty, createMessageToStatusCodeMap, createStatusCodeList } from './helps'

const store = {}

// status code to message map
store.message = codes

// status message (lower-case) to code map
store.code = createMessageToStatusCodeMap(codes)

// array of status codes
store.codes = createStatusCodeList(codes)

// status codes for redirects
store.redirect = {
    300: true,
    301: true,
    302: true,
    303: true,
    305: true,
    307: true,
    308: true
}

// status codes for empty bodies
store.empty = {
    204: true,
    205: true,
    304: true
}

// status codes for when you should retry the request
store.retry = {
    502: true,
    503: true,
    504: true
}

/**
 * Get the status code for given message.
 * @param {string} message
 * @return {number}
 */

function getStatusCode(message) {
    const msg = message.toLowerCase()

    // feat: throw invalid msg when get status code
    if (!hasOwnProperty.call(store.code, msg)) {
        throw new Error(`invalid status message: "${message}"`)
    }

    return store.code[msg]
}

/**
 * Get the status message for given code.
 * @param {number} code
 * @return {string}
 */

function getStatusMessage(code) {
    // feat: throw invalid msg when get status msg

    if (!hasOwnProperty.call(store.message, code)) {
        throw new Error(`invalid status code: ${code}`)
    }

    return store.message[code]
}

/**
 * Get the status code.
 *
 * Given a number, this will throw if it is not a known status
 * code, otherwise the code will be returned. Given a string,
 * the string will be parsed for a number and return the code
 * if valid, otherwise will lookup the code assuming this is
 * the status message.
 *
 * @param {string|number} code
 * @returns {number}
 * @public
 */

function status(code) {
    // feat: get status msg
    if (typeof code === 'number') {
        return getStatusMessage(code)
    }

    if (typeof code !== 'string') {
        throw new TypeError('code must be a number or string')
    }

    // feat: code to number
    // '403'
    const n = parseInt(code, 10)
    if (!isNaN(n)) {
        return getStatusMessage(n)
    }

    // feat: get status code
    return getStatusCode(code)
}

export default status
