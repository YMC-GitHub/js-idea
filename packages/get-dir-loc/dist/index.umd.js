/**
  * getDirLoc v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["get-dir-loc"] = factory());
})(this, (function () { 'use strict';

  /**
   * get parent dir loc
   * @param {string} likepath
   * @param {{splitReg:regexp,split:string}} option
   */
  function getDirLoc(likepath, option = {}) {
    const {
      split,
      splitReg
    } = {
      splitReg: /\/|\\/,
      split: '/',
      ...option
    };
    let list = likepath.split(splitReg || split);
    const {
      length
    } = list;

    if (length > 1) {
      list = list.slice(0, length - 1);
      list = list.join(split);
    } else {
      list = '';
    }

    return list;
  }

  return getDirLoc;

}));
