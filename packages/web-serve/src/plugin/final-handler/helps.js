import './types'
/**
 *
 * @param {option} opts
 * @returns
 */
function getEnv(opts = {}) {
    return opts.env || process.env.NODE_ENV || 'development'
}

/**
 *
 * @param {option} opts
 * @returns
 */
function getErrCallback(opts = {}) {
    return opts.onerror
}

// res
/**
 * Determine if the response headers have been sent.
 *
 * @param {res} res
 * @returns {boolean}
 */

function headersSent(res) {
    return typeof res.headersSent !== 'boolean' ? Boolean(res._header) : res.headersSent
}

/**
 * Get status code from response.
 *
 * @param {OutgoingMessage} res
 * @return {number}
 */

function getResponseStatusCode(res) {
    let status = res.statusCode

    // default status code to 500 if outside valid range
    if (typeof status !== 'number' || status < 400 || status > 599) {
        status = 500
    }

    return status
}
/**
 * Set response headers from an object.
 *
 * @param {OutgoingMessage} res
 * @param {object} headers
 */

function setHeaders(res, headers) {
    if (!headers) {
        return
    }

    const keys = Object.keys(headers)
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i]
        res.setHeader(key, headers[key])
    }
}

// error
/**
 * Get status code from Error object.
 *
 * @param {Error} err
 * @return {number|undefined}
 */

function getErrorStatusCode(err) {
    // check err.status
    if (typeof err.status === 'number' && err.status >= 400 && err.status < 600) {
        return err.status
    }

    // check err.statusCode
    if (typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 600) {
        return err.statusCode
    }

    return undefined
}

/**
 * Get headers from Error object.
 *
 * @param {Error} err
 * @return {object}
 */

function getErrorHeaders(err) {
    if (!err.headers || typeof err.headers !== 'object') {
        return undefined
    }

    const headers = Object.create(null)
    const keys = Object.keys(err.headers)
    const { length } = keys
    for (let i = 0; i < length; i += 1) {
        const key = keys[i]
        headers[key] = err.headers[key]
    }

    return headers
}

export { getEnv, getErrCallback, headersSent, getResponseStatusCode, setHeaders, getErrorStatusCode, getErrorHeaders }
