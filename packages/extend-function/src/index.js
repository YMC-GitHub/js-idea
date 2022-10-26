/* eslint-disable prefer-rest-params */

function bind(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  // get args
  const args = [...arguments].slice(1)
  const Fn = this

  // fix a constructor name should not start with a lowercase letter
  // fix a constructor name should not start with a lowercase letter
  return function Wp() {
    // fix this line has a length of 102. Maximum allowed is 100
    // diliver args accooding to call way
    return Fn.apply(this instanceof Wp ? new Fn(...arguments) : context, args.concat(...arguments))
  }
}
// https://vue3js.cn/interview/JavaScript/bind_call_apply.html

/**
 *
 * @param {string} name
 * @param {()=>{}} handle
 */
function extendFunctionPrototype(name, handle) {
  const tobeExtende = Function.prototype
  if (!tobeExtende[name]) {
    /* eslint-disable func-names */
    // fix unexpected unnamed function
    tobeExtende[name] = function (...args) {
      return handle(this, ...args)
    }
  }
}
extendFunctionPrototype('bind', bind)
extendFunctionPrototype('ymcBind', bind)
