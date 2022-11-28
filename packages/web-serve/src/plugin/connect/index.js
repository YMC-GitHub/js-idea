/*eslint-disable */

import makeDebug from 'debug'

import { EventEmitter } from 'events'
import finalhandler from 'finalhandler'
import { Server, createServer as _createServer } from 'http'
import merge from 'utils-merge'
import parseUrl from 'parseurl'
import { getEnv, defer, wrapSubApp, getProtohost } from './helps'

const debug = makeDebug('connect:dispatcher')

// topic:
// env,pto,app,log
//
// idea:
// bind env,log to pto (todo)
// use pto to create app

export default createServer

// feat: get env from process.env.NODE_ENV
// feat: add pto prototype

// desc:
// get env from process
// ini pto
// create a function to create server
// create a function to the given middleware `handle` to the given `route`
// create a function to listen host and port
// create a function to handle server requests, punting them down middleware stack
const env = getEnv()

const pto = {}

/**
 * Create a new connect server.
 * @return {function}
 */

function createServer() {
    function app(req, res, next) {
        app.handle(req, res, next)
    }
    // feat: add pto prototype
    // 1. use merge
    // 2. use proto
    // merge proto
    merge(app, pto)

    // feat: add ee prototype
    // 1. use merge
    merge(app, EventEmitter.prototype)

    app.route = '/'
    // desc: cache middleware
    // 1. use a array as stack
    // 2. type of a middleware { route: path, handle: handle }
    app.stack = []
    return app
}

/**
 * Utilize the given middleware `handle` to the given `route`,
 * defaulting to _/_. This "route" is the mount-point for the
 * middleware, when given a value other than _/_ the middleware
 * is only effective when that segment is present in the request's
 * pathname.
 *
 * For example if we were to mount a function at _/admin_, it would
 * be invoked on _/admin_, and _/admin/settings_, however it would
 * not be invoked for _/_, or _/posts_.
 *
 * @param {String|Function|Server} route, callback or server
 * @param {Function|Server} fn callback or server
 * @return {Server} for chaining
 * @public
 */

pto.use = function use(route, fn) {
    // /**@typedef {Function | {name:string,handle:Function}} handle */

    let handle = fn
    let path = route

    // feat: enable app.use(handle)
    // feat: enable app.use(route,handle)
    if (typeof route !== 'string') {
        handle = route
        // feat: prefer default route to '/'
        path = '/'
    }

    // feat: enable app.use(subapp)
    // feat: wrap sub-apps
    if (typeof handle.handle === 'function') {
        // [server,handle] = wrapSubApp(path,handle)
        const server = handle
        server.route = path
        handle = function (req, res, next) {
            server.handle(req, res, next)
        }
    }

    // feat: enable vanilla http.Servers
    // wrap vanilla http.Servers
    if (handle instanceof Server) {
        handle = handle.listeners('request')[0]
    }

    // feat: strip trailing slash
    if (path[path.length - 1] === '/') {
        path = path.slice(0, -1)
    }
    // or:
    // path=path.replace(/\/$/,'')

    // add the middleware
    debug('use %s %s', path || '/', handle.name || 'anonymous')
    this.stack.push({ route: path, handle })

    return this
}

/**
 * Handle server requests, punting them down
 * the middleware stack.
 *
 */

pto.handle = function handle(req, res, out) {
    let index = 0
    const protohost = getProtohost(req.url) || ''
    let removed = ''
    let slashAdded = false
    const { stack } = this

    // feat: enable handle(res,req)
    // feat: enable handle(res,req,cb)
    // feat: finalhandler as default cb
    // final function handler
    const done =
        out ||
        finalhandler(req, res, {
            env,
            onerror: logerror
        })

    // store the original URL
    req.originalUrl = req.originalUrl || req.url

    // feat: call middleware
    function next(err) {
        // feat: del the first slash char
        // /xx/to xx/
        if (slashAdded) {
            req.url = req.url.substr(1)
            slashAdded = false
        }

        if (removed.length !== 0) {
            req.url = protohost + removed + req.url.substr(protohost.length)
            removed = ''
        }

        // get next middleware
        // defer call done when  all middleware called
        // get path from req and route from middleware
        // skip a middleware when route no match path

        // next callback
        const layer = stack[index++]

        // feat: defer call done when all middleware called
        // all done
        if (!layer) {
            defer(done, err)
            return
        }

        // route data
        const path = parseUrl(req).pathname || '/'
        const { route } = layer

        // skip this layer if the route doesn't match
        if (path.toLowerCase().substring(0, route.length) !== route.toLowerCase()) {
            return next(err)
        }

        // skip if route match does not border "/", ".", or end
        const c = path.length > route.length && path[route.length]
        if (c && c !== '/' && c !== '.') {
            return next(err)
        }

        // trim off the part of the url that matches the route
        if (route.length !== 0 && route !== '/') {
            removed = route
            req.url = protohost + req.url.substring(protohost.length + removed.length)

            // ensure leading slash
            if (!protohost && req.url[0] !== '/') {
                req.url = `/${req.url}`
                slashAdded = true
            }
        }

        // call the layer handle
        call(layer.handle, route, err, req, res, next)
    }

    next()
}

/**
 * Listen for connections.
 *
 * This method takes the same arguments
 * as node's `http.Server#listen()`.
 *
 * HTTP and HTTPS:
 *
 * If you run your application both as HTTP
 * and HTTPS you may wrap them individually,
 * since your Connect "server" is really just
 * a JavaScript `Function`.
 *
 *      let connect = require('connect')
 *        , http = require('http')
 *        , https = require('https');
 *
 *      let app = connect();
 *
 *      http.createServer(app).listen(80);
 *      https.createServer(options, app).listen(443);
 *
 * @return {http.Server}
 * @api public
 */

pto.listen = function listen() {
    const server = _createServer(this)
    return server.listen.apply(server, arguments)
}

/**
 * Invoke a route handle.
 */

function call(handle, route, err, req, res, next) {
    // /**@typedef {originalUrl:string} req*/
    const arity = handle.length
    let error = err
    const hasError = Boolean(err)

    debug('%s %s : %s', handle.name || '<anonymous>', route, req.originalUrl)

    // feat: call handle middleware
    try {
        if (hasError && arity === 4) {
            // error-handling middleware
            handle(err, req, res, next)
            return
        }
        if (!hasError && arity < 4) {
            // request-handling middleware
            handle(req, res, next)
            return
        }
    } catch (e) {
        // replace the error
        error = e
    }

    // continue
    next(error)
}

/**
 * Log error using console.error.
 *
 * @param {Error} err
 */

function logerror(err) {
    // feat: log error when no test env
    if (env !== 'test') console.error(err.stack || err.toString())
}
