/*eslint-disable */

// /* eslint-disable no-use-before-define */

// https://github.com/pillarjs/finalhandler/blob/master/index.js

import makedebug from 'debug'
import encodeUrl from 'encodeurl'
import onFinished, { isFinished as _isFinished } from 'on-finished'
// import { original } from 'parseurl'
// import { message as statusMessage } from 'statuses'
import { message as statusMessage } from '../http-status'
// import unpipe from 'unpipe'
import unpipe from './unpipe-stream'
import {
    getEnv,
    getErrCallback,
    headersSent,
    getResponseStatusCode,
    setHeaders,
    getErrorStatusCode,
    getErrorHeaders
} from './helps'
import createHtmlDocument from './create-html-document'
import getErrorMessage from './get-error-message'
import getResourceName from './get-resource-name'

import defer from './defer'

const debug = makedebug('finalhandler')

// feat: profill setImmediate
// feat: escape html
// feat: create a mini html document
// feat: create a function to handle final reponse
// feat: get env from option, process.env.NODE_ENV
// feat: get err callback from option
// feat: get status,msg and headers
// feat: get string byte length
// ...

const isFinished = _isFinished

export default finalhandler

/**
 * create a function to handle the final response.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Object} [options]
 * @return {Function}
 * @public
 */

function finalhandler(req, res, options) {
    const opts = options || {}

    // get environment
    const env = getEnv(opts)

    // get error callback
    const onerror = getErrCallback(opts)

    return function (err) {
        let headers
        let msg
        let status

        // feat: ignore 404 on in-flight response
        if (!err && headersSent(res)) {
            debug('cannot 404 after headers sent')
            return
        }

        // feat: get status,msg and headers
        // unhandled error
        if (err) {
            // respect status code from error
            status = getErrorStatusCode(err)

            if (status === undefined) {
                // fallback to status code on response
                status = getResponseStatusCode(res)
            } else {
                // feat: respect headers from error
                headers = getErrorHeaders(err)
            }

            // get error message
            msg = getErrorMessage(err, status, env)
        } else {
            // not found
            status = 404
            msg = `Cannot ${req.method} ${encodeUrl(getResourceName(req))}`
        }

        debug('default %s', status)

        // feat: schedule onerror callback
        if (err && onerror) {
            defer(onerror, err, req, res)
        }

        // feat: cannot send response actually respond
        if (headersSent(res)) {
            debug('cannot %d after headers sent', status)
            req.socket.destroy()
            return
        }

        // feat: send response
        send(req, res, status, headers, msg)
    }
}

/**
 * Send response.
 *
 * @param {IncomingMessage} req
 * @param {OutgoingMessage} res
 * @param {number} status
 * @param {object} headers
 * @param {string} message
 * @private
 */

function send(req, res, status, headers, message) {
    function write() {
        // feat: create html document with message
        // response body
        const body = createHtmlDocument(message)

        // feat: set response status (code and msg)
        // response status
        res.statusCode = status
        res.statusMessage = statusMessage[status]

        // feat: del some response header
        // remove any content headers
        res.removeHeader('Content-Encoding')
        res.removeHeader('Content-Language')
        res.removeHeader('Content-Range')

        // feat: set response headers (from error)
        // response headers
        setHeaders(res, headers)

        // feat: security headers
        res.setHeader('Content-Security-Policy', "default-src 'none'")
        res.setHeader('X-Content-Type-Options', 'nosniff')

        // feat: standard headers
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.setHeader('Content-Length', Buffer.byteLength(body, 'utf8'))

        // feat: end nothing for method head
        if (req.method === 'HEAD') {
            res.end()
            return
        }
        // feat: end body for method other
        res.end(body, 'utf8')
    }

    // feat: write when req finished
    if (isFinished(req)) {
        write()
        return
    }

    // feat: unpipe everything from the request
    unpipe(req)

    // feat: write on req finished
    // flush the request
    onFinished(req, write)
    req.resume()
}
