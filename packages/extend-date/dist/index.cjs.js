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
  // fix no-param-reassign fmt
  let res = fmt; // let ctx = this;

  const o = {
    'M+': ctx.getMonth() + 1,
    'd+': ctx.getDate(),
    'H+': ctx.getHours(),
    'm+': ctx.getMinutes(),
    's+': ctx.getSeconds(),
    'S+': ctx.getMilliseconds()
  }; // log(res, o);
  // get year eg . formatDate('yyyy')//2022

  let reg;
  reg = /(y+)/;

  if (reg.test(res)) {
    // deprecated
    // res = res.replace(
    //   RegExp.$1,
    //   `${ctx.getFullYear()}`.substr(4 - RegExp.$1.length)
    // );
    res = res.replace(reg, x => `${ctx.getFullYear()}`.substring(4 - x.length));
  }
  /* eslint-disable no-restricted-syntax,guard-for-in */
  // add 0 before result with length


  for (const k in o) {
    reg = new RegExp(`(${k})`);

    if (reg.test(res)) {
      // deprecated
      // res = res.replace(
      //   RegExp.$1,
      //   RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(String(o[k]).length)
      // );
      // fix eqeqeq expected '==='
      res = res.replace(reg, x => x.length === 1 ? o[k] : `00${o[k]}`.substring(String(o[k]).length));
    }
  }

  return res;
}
/**
 *
 * @param {string} name
 * @param {()=>{}} handle
 */


function extendDatePrototype(name, handle) {
  const tobeExtende = Date.prototype;

  if (!tobeExtende[name]) {
    // fix func-names - unexpected unnamed function

    /* eslint-disable func-names */
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
