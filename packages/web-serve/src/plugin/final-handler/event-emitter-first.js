/*eslint-disable */

// /* eslint-disable no-use-before-define */

export default first

/**
 * Get the first event in a set of event emitters and event pairs.
 *
 * @param {array} stuff
 * @param {function} done
 */

function first(stuff, done) {
    // feat: only stuff array
    if (!Array.isArray(stuff)) {
        throw new TypeError('arg must be an array of [ee, events...] arrays')
    }

    const cleanups = []

    for (let i = 0; i < stuff.length; i++) {
        const arr = stuff[i]

        if (!Array.isArray(arr) || arr.length < 2) {
            throw new TypeError('each array member must be [ee, events...]')
        }

        const ee = arr[0]
        for (let j = 1; j < arr.length; j++) {
            const event = arr[j]
            const fn = listener(event, callback)

            // listen to the event
            ee.on(event, fn)
            // push this listener to the list of cleanups
            cleanups.push({
                ee,
                event,
                fn
            })
        }
    }

    /**
     * clean all ee and call cb
     */
    function callback() {
        // feat: all ee clean event
        cleanup()
        // feat: call cb
        done.apply(null, arguments)
    }

    /**
     * clean all ee 's event and fn
     */
    function cleanup() {
        let x
        for (let i = 0; i < cleanups.length; i++) {
            x = cleanups[i]
            x.ee.removeListener(x.event, x.fn)
        }
    }

    /**
     * set done fn
     * @param {function} fn
     */
    function thunk(fn) {
        done = fn
    }

    // feat: cancel all ee
    thunk.cancel = cleanup

    return thunk
}

/**
 * Create a function to ctx listen the event listener.
 * @param {string} event
 * @param {(err:object,ee:object,event:string,args:object)=>any} done
 */

function listener(event, done) {
    return function onevent(arg1) {
        const args = new Array(arguments.length)
        const ee = this
        const err = event === 'error' ? arg1 : null

        // copy args to prevent arguments escaping scope
        for (let i = 0; i < args.length; i++) {
            args[i] = arguments[i]
        }

        done(err, ee, event, args)
    }
}
