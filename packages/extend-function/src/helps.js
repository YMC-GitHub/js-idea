/**
 * add method to Function.prototype
 * @param {string} name
 * @param {()=>{}} handle
 */
function extendFunctionPrototype(name, handle) {
    const tobeExtende = Function.prototype
    if (!tobeExtende[name]) {
        /* eslint-disable func-names */
        // fix unexpected unnamed function
        // tobeExtende[name] = function (...args) {
        //     return handle(this, ...args)
        // }
        tobeExtende[name] = handle
    }
}
export { extendFunctionPrototype, extendFunctionPrototype as addProtoMethod }
