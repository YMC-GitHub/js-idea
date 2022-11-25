/**
  * getObjOnlySelectedKeys v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["get-obj-only-selected-keys"] = factory());
})(this, (function () { 'use strict';

  /* eslint-disable prefer-const */
  // @ymc/get-obj-only-selected-keys

  /**
   * get obj only selected keys
   * @param {{}} data
   * @param {string} keys
   * @param {string|regexp} sc
   * @returns {{}}
   * @sample
   * ```
   * selectDataKeys(option, 'commentReg, ignoreComment')
   * selectDataKeys(option, '{text:filetext,commentReg, ignoreComment}')
   * ```
   */
  function getObjOnlySelectedKeys(data, keys, sc = /,/) {
    const res = {};
    keys.replace(/(^ ?{)|(} ?$)/gi, '').split(sc).forEach(key => {
      // keys=''
      let [alias, name] = key.trim().split(':').map(v => v.trim()); // get val by key

      const val = name ? data[name] : data[alias];

      if (val !== undefined) {
        // feat: set val bind new name
        res[alias] = val;
      }
    });
    return res;
  }

  return getObjOnlySelectedKeys;

}));
