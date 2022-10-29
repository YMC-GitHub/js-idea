/**
  * renderTpl v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/** @typedef {{[string]:string|boolean|number|undefined}} data */

/**
 * @param {string} tpl
 * @param {data} data
 * @returns {Stringimport("typescript").LiteralLike}
 */
function renderTpl(tpl, data) {
  let res = tpl;
  Object.keys(data).forEach(key => {
    const value = data[key];
    res = res.replace(new RegExp(`{${key}}`, 'ig'), value);
  });
  return res;
}
/**
 *
 * @param {string} tpl
 * @param {data} data
 * @returns {string|(data:data)=>string}
 * @sample
 * ```
 * writeTpl('{method} repo/owner',{method:'POST'}) //POST repo/owner
 * ```
 */


function writeTpl(tpl, data) {
  if (data) {
    return renderTpl(tpl, data);
  }

  return v => renderTpl(tpl, v);
}

exports.renderTpl = renderTpl;
exports.writeTpl = writeTpl;
