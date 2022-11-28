/* eslint-disable  no-param-reassign */
function noop() {}
/**
 *
 * @param {object} methods
 * @param {function} cls
 */
function addClassMethods(methods, cls = noop) {
    Object.entries(methods).forEach(([name, value]) => {
        // console.log(name, value)
        cls.prototype[name] = value
    })
}
export { noop, addClassMethods }
