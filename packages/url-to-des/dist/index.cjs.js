/**
  * urlToDes v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

/**
 * get target file loc by url
 * @param {string} url
 * @param {{prefix:string}} option
 * @returns {string}
 * @description
 * ```
 * //idea:
 * //delete prefix
 * ```
 */
function url2des(url, option = {}) {
  let res = url;
  const {
    prefix
  } = option;
  if (prefix) res = res.replace(new RegExp(`.*${prefix}`), '');
  return res;
}

module.exports = url2des;
