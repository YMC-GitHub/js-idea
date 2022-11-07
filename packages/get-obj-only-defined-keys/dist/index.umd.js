/**
  * getObjOnlyDefinedKeys v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["get-obj-only-defined-keys"] = factory());
})(this, (function () { 'use strict';

  // @ymc/get-obj-only-defined-keys

  /**
   * get obj only define keys
   * @param {{}} option
   * @return {{}}
   */
  function getObjOnlyDefinedKeys(option = {}) {
    const res = {};
    Object.keys(option).forEach(v => {
      if (option[v] !== undefined) {
        res[v] = option[v];
      }
    });
    return res;
  }

  return getObjOnlyDefinedKeys;

}));
