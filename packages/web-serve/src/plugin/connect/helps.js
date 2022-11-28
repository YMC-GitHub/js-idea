/*eslint-disable */
// topic:
// func,url,app

// func
/**
 * defer a function
 */
const defer =
    typeof setImmediate === 'function'
        ? setImmediate
        : function (fn) {
              process.nextTick(fn.bind.apply(fn, arguments))
          }

/**
 *
 * @param {option} opts
 * @returns
 */
function getEnv(opts = {}) {
    return opts.env || process.env.NODE_ENV || 'development'
}

// app
/**
 *
 * @param {object} handle
 * @param {string} path
 * @returns
 * @sample
 * ```
 * let server,handle
 * [server,handle]=wrapSubApp(path,handle)
 * ```
 */
function wrapSubApp(path, handle) {
    const server = handle
    server.route = path
    handle = function (req, res, next) {
        server.handle(req, res, next)
    }
    return [server, handle]
}

// url
/**
 * Get get protocol + host for a URL.
 * @param {string} url
 */

function getProtohost(url) {
    if (url.length === 0 || url[0] === '/') {
        return undefined
    }

    const fqdnIndex = url.indexOf('://')

    return fqdnIndex !== -1 && url.lastIndexOf('?', fqdnIndex) === -1
        ? url.substring(0, url.indexOf('/', 3 + fqdnIndex))
        : undefined
}

export { getEnv, defer, wrapSubApp, getProtohost }
