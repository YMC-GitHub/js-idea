/*eslint-disable */

const defer =
    typeof setImmediate === 'function'
        ? setImmediate
        : function (fn) {
              process.nextTick(fn.bind.apply(fn, arguments))
          }
export default defer
