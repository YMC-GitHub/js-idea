export default unpipe

/**
 * Determine if there are Node.js pipe-like data listeners.
 * @param {object} stream
 */

function hasPipeDataListeners(stream) {
    const listeners = stream.listeners('data')
    const { length } = listeners
    for (let i = 0; i < length; i += 1) {
        if (listeners[i].name === 'ondata') {
            return true
        }
    }

    return false
}

/**
 * Unpipe a stream from all destinations.
 *
 * @param {object} stream
 */

function unpipe(stream) {
    if (!stream) {
        throw new TypeError('argument stream is required')
    }

    if (typeof stream.unpipe === 'function') {
        // new-style
        stream.unpipe()
        return
    }

    // Node.js 0.8 hack
    if (!hasPipeDataListeners(stream)) {
        return
    }

    // feat: call stream close-hanlde
    let listener
    const listeners = stream.listeners('close')
    const { length } = listeners

    for (let i = 0; i < length; i += 1) {
        listener = listeners[i]

        if (listener.name !== 'cleanup' && listener.name !== 'onclose') {
            continue
        }

        // invoke the listener
        listener.call(stream)
    }
}
