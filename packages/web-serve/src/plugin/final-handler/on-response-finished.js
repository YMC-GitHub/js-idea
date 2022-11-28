/*eslint-disable */

// /* eslint-disable no-use-before-define */

import first from 'ee-first'

export default onFinished
const _isFinished = isFinished
export { _isFinished as isFinished }

const asyncHooks = tryRequireAsyncHooks()

/* istanbul ignore next */
const defer =
    typeof setImmediate === 'function'
        ? setImmediate
        : function (fn) {
              process.nextTick(fn.bind.apply(fn, arguments))
          }

// setImmediate vs  process.nextTick vs setTimeout

/**
 * Invoke callback when the response has finished, useful for
 * cleaning up resources afterwards.
 *
 * @param {object} msg
 * @param {function} listener
 * @return {object}
 */

function onFinished(msg, listener) {
    if (isFinished(msg) !== false) {
        defer(listener, null, msg)
        return msg
    }

    // attach the listener to the message
    attachListener(msg, wrap(listener))

    return msg
}

/**
 * Determine if message is already finished.
 *
 * @param {object} msg
 * @return {boolean}
 * @public
 */

function isFinished(msg) {
    const { socket } = msg

    if (typeof msg.finished === 'boolean') {
        // OutgoingMessage
        return Boolean(msg.finished || (socket && !socket.writable))
    }

    if (typeof msg.complete === 'boolean') {
        // IncomingMessage
        return Boolean(msg.upgrade || !socket || !socket.readable || (msg.complete && !msg.readable))
    }

    // don't know
    return undefined
}

/**
 * Attach a finished listener to the message.
 *
 * @param {object} msg
 * @param {function} callback
 */

function attachFinishedListener(msg, callback) {
    let eeMsg
    let eeSocket
    let finished = false

    function onFinish(error) {
        eeMsg.cancel()
        eeSocket.cancel()

        finished = true
        callback(error)
    }

    // finished on first message event
    eeMsg = eeSocket = first([[msg, 'end', 'finish']], onFinish)

    function onSocket(socket) {
        // remove listener
        msg.removeListener('socket', onSocket)

        if (finished) return
        if (eeMsg !== eeSocket) return

        // finished on first socket event
        eeSocket = first([[socket, 'error', 'close']], onFinish)
    }

    if (msg.socket) {
        // socket already assigned
        onSocket(msg.socket)
        return
    }

    // wait for socket to be assigned
    msg.on('socket', onSocket)

    if (msg.socket === undefined) {
        // istanbul ignore next: node.js 0.8 patch
        patchAssignSocket(msg, onSocket)
    }
}

/**
 * Attach the listener to the message.
 *
 * @param {object} msg
 * @return {function}
 * @private
 */

function attachListener(msg, listener) {
    let attached = msg.__onFinished

    // create a private single listener with queue
    if (!attached || !attached.queue) {
        attached = msg.__onFinished = createListener(msg)
        attachFinishedListener(msg, attached)
    }

    attached.queue.push(listener)
}

/**
 * Create listener on message.
 *
 * @param {object} msg
 * @return {function}
 */

function createListener(msg) {
    function listener(err) {
        if (msg.__onFinished === listener) msg.__onFinished = null
        if (!listener.queue) return

        const { queue } = listener
        listener.queue = null

        for (let i = 0; i < queue.length; i++) {
            queue[i](err, msg)
        }
    }

    listener.queue = []

    return listener
}

/**
 * Patch ServerResponse.prototype.assignSocket for node.js 0.8.
 *
 * @param {ServerResponse} res
 * @param {function} callback
 * @private
 */

// istanbul ignore next: node.js 0.8 patch
function patchAssignSocket(res, callback) {
    const { assignSocket } = res

    if (typeof assignSocket !== 'function') return

    // res.on('socket', callback) is broken in 0.8
    res.assignSocket = function _assignSocket(socket) {
        assignSocket.call(this, socket)
        callback(socket)
    }
}

/**
 * Try to require async_hooks
 */

function tryRequireAsyncHooks() {
    try {
        return require('async_hooks')
    } catch (e) {
        return {}
    }
}

/**
 * Wrap function with async resource, if possible.
 * AsyncResource.bind static method backported.
 */

function wrap(fn) {
    let res

    // create anonymous resource
    if (asyncHooks.AsyncResource) {
        res = new asyncHooks.AsyncResource(fn.name || 'bound-anonymous-fn')
    }

    // incompatible node.js
    if (!res || !res.runInAsyncScope) {
        return fn
    }

    // return bound function
    return res.runInAsyncScope.bind(res, fn, null)
}
