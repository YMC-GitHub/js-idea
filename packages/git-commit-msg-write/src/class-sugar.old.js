/* eslint-disable no-new-func,no-use-before-define */
import { isString, validString } from './tools'

/**
 * get or set val by key in ctx.data
 * @param {{data:{}}} ctx
 * @param {string} key
 * @param {string} val
 * @returns {ctx|string}
 */
function magicc(ctx, key, val) {
    const { data } = ctx
    if (!validString(key)) return ctx
    if (isString(val)) {
        data[key] = val
        return ctx
    }
    return data[key]
}

// wmd.type().scope().subject().body().foot().issue()

// - [x] extract commom logic fun
// - [x] register fun to avoid writing many method
// - [ ] register fun to define fun alias

/**
 * @description
 * ```
 * ## why use?
 * - [x] write msg data
 * ```
 */
class WriteMsgData {
    constructor() {
        this.data = {}
        // auto register on new class
        // for (let method in dataBase) {
        //   this.registerMethod(method);
        // }
    }

    registerMethod(name) {
        const fnBody = `let ctx = this ; return ctx.magicc("${name}", msg)`
        this[`${name}`] = new Function('msg', fnBody)
    }

    // body(msg) {
    //   let ctx = this;
    //   return magicc(ctx, "body", msg);
    // }
    // scope(msg) {
    //   let ctx = this;
    //   return magicc(ctx, "scope", msg);
    // }
    /**
     * get or set val by key in ctx.data
     * @param {string} key
     * @param {string} val
     * @returns {this|string}
     */
    magicc(key, val) {
        const ctx = this
        return magicc(ctx, key, val)
    }
}

const msgdata = new WriteMsgData()
// idea:it.type().scope().subject().body().foot().issue()
'type|scope|subject|body|foot|issue'.split('|').forEach(method => {
    msgdata.registerMethod(method)
})
export { WriteMsgData, msgdata }
