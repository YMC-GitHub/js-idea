/* eslint-disable no-use-before-define */
import { parse as _parse, Url as _Url } from 'url'

let parse = _parse // eslint-disable-line
const Url = _Url

/**
 * Module exports.
 * @public
 */

export default parseurl
export const original = originalurl

/**
 * Parse the `req` url with memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */

function parseurl(req) {
    const { url } = req

    if (url === undefined) {
        // URL is undefined
        return undefined
    }

    let parsed = req._parsedUrl

    if (fresh(url, parsed)) {
        // Return cached URL parse
        return parsed
    }

    // Parse the URL
    parsed = fastparse(url)
    parsed._raw = url

    return (req._parsedUrl = parsed)
}

/**
 * Parse the `req` original url with fallback and memoization.
 *
 * @param {ServerRequest} req
 * @return {Object}
 * @public
 */

function originalurl(req) {
    const url = req.originalUrl

    if (typeof url !== 'string') {
        // Fallback
        return parseurl(req)
    }

    let parsed = req._parsedOriginalUrl

    if (fresh(url, parsed)) {
        // Return cached URL parse
        return parsed
    }

    // Parse the URL
    parsed = fastparse(url)
    parsed._raw = url

    return (req._parsedOriginalUrl = parsed)
}

/**
 * Parse the `str` url with fast-path short-cut.
 *
 * @param {string} str
 * @return {Object}
 * @private
 */

function fastparse(str) {
    if (typeof str !== 'string' || str.charCodeAt(0) !== 0x2f /* / */) {
        return parse(str)
    }

    let pathname = str
    let query = null
    let search = null

    // This takes the regexp from https://github.com/joyent/node/pull/7878
    // Which is /^(\/[^?#\s]*)(\?[^#\s]*)?$/
    // And unrolls it into a for loop
    for (let i = 1; i < str.length; i++) {
        switch (str.charCodeAt(i)) {
            case 0x3f /* ?  */:
                if (search === null) {
                    pathname = str.substring(0, i)
                    query = str.substring(i + 1)
                    search = str.substring(i)
                }
                break
            case 0x09: /* \t */
            case 0x0a: /* \n */
            case 0x0c: /* \f */
            case 0x0d: /* \r */
            case 0x20: /*    */
            case 0x23: /* #  */
            case 0xa0:
            case 0xfeff:
                return parse(str)
        }
    }

    const url = Url !== undefined ? new Url() : {}

    url.path = str
    url.href = str
    url.pathname = pathname

    if (search !== null) {
        url.query = query
        url.search = search
    }

    return url
}

/**
 * Determine if parsed is still fresh for url.
 *
 * @param {string} url
 * @param {object} parsedUrl
 * @return {boolean}
 * @private
 */

function fresh(url, parsedUrl) {
    return (
        typeof parsedUrl === 'object' &&
        parsedUrl !== null &&
        (Url === undefined || parsedUrl instanceof Url) &&
        parsedUrl._raw === url
    )
}
