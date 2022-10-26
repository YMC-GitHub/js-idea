/**
  * urlToDes v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["url-to-des"] = factory());
})(this, (function () { 'use strict';

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

  return url2des;

}));
