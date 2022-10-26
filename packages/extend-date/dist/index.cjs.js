'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * format date
 * @param {string} fmt
 * @returns {string}
 * @sample
 * ```
 * let now = new Date();
 * formatDate("yyyy-MM-dd HH:mm:ss",now);
 * ```
 * @description
 * ```
 * M+
 * ```
 */
function formatDate(fmt, ctx) {
  // let ctx = this;
  const o = {
    'M+': ctx.getMonth() + 1,
    'd+': ctx.getDate(),
    'H+': ctx.getHours(),
    'm+': ctx.getMinutes(),
    's+': ctx.getSeconds(),
    'S+': ctx.getMilliseconds()
  }; // log(fmt, o);
  // get year eg . formatDate('yyyy')//2022

  let reg;
  reg = /(y+)/;

  if (reg.test(fmt)) {
    // deprecated
    // fmt = fmt.replace(
    //   RegExp.$1,
    //   `${ctx.getFullYear()}`.substr(4 - RegExp.$1.length)
    // );
    fmt = fmt.replace(reg, x => `${ctx.getFullYear()}`.substring(4 - x.length));
  } // add 0 before result with length


  for (const k in o) {
    reg = new RegExp(`(${k})`);

    if (reg.test(fmt)) {
      // deprecated
      // fmt = fmt.replace(
      //   RegExp.$1,
      //   RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(String(o[k]).length)
      // );
      fmt = fmt.replace(reg, x => x.length == 1 ? o[k] : `00${o[k]}`.substring(String(o[k]).length));
    }
  }

  return fmt;
}
/**
 *
 * @param {string} name
 * @param {()=>{}} handle
 */


function extendDatePrototype(name, handle) {
  let tobeExtende = Date.prototype;

  if (!tobeExtende[name]) {
    tobeExtende[name] = function (...args) {
      return handle(this, ...args);
    };
  }
}
/**
 * format date
 * @param {string} fmt
 * @returns {string}
 * @sample
 * ```
 * let now = new Date();
 * now.Format("yyyy-MM-dd HH:mm:ss");
 * ```
 */
// extendDatePrototype('formtDate',formatDate)


extendDatePrototype('formatDate', formatDate);
extendDatePrototype('Format', formatDate);
 // export default formatDate;

exports.extendDatePrototype = extendDatePrototype;
exports.formatDate = formatDate;
