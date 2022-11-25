/* eslint-disable no-param-reassign,func-names */
import { isString, validString } from './tools'

/**
 * extend class
 * @param {function} cls
 * @param {string} name
 * @param {()=>{}} fun
 * @description
 * ```
 * set clss.prototype[name] = fun
 * ```
 */
function extendClass(cls, name, fun) {
    cls.prototype[name] = fun
}

/**
 * access ctx[ns]
 * @param {{}} ctx
 * @param {string} ns
 * @param {string} key
 * @param {*} val
 * @returns
 */
function magincAccess(ctx, ns, key, val) {
    // let store = ctx.data
    // let data = store[ns]
    const data = ctx[ns]
    if (!validString(key)) return ctx
    if (val || isString(val)) {
        data[key] = val
        return ctx
    }
    return data[key]
}

// wmd.type().scope().subject().body().foot().issue()

// - [x] extract commom logic fun
// - [x] register fun to avoid writing many method
// - [ ] register fun to define fun alias

// define class constructor
class WriteMsgData {
    constructor() {
        this.data = {}
    }
}

// define class method
'type|scope|subject|body|foot|issue'.split('|').forEach(method => {
    extendClass(WriteMsgData, method, function (...args) {
        return magincAccess(this, 'data', method, ...args)
    })
})
const writemsgdata = new WriteMsgData()
export { WriteMsgData, writemsgdata }
