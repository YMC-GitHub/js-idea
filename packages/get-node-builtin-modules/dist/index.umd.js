/**
  * getNodeBuiltinModules v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node:module')) :
  typeof define === 'function' && define.amd ? define(['node:module'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["get-node-builtin-modules"] = factory(global.node_module));
})(this, (function (node_module) { 'use strict';

  // eslint-diable node/no-deprecated-api

  /**
   *
   * @returns {string[]}
   */

  function getNodeBuitInModule() {
    // https://github.com/sindresorhus/builtin-modules
    const ignoreList = ['sys'];
    return (node_module.builtinModules || (process.binding ? Object.keys(process.binding('natives')) : []) || []).filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x) && !ignoreList.includes(x)).sort();
  }

  return getNodeBuitInModule;

}));
