/**
  * getUserHome v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["get-user-home"] = factory());
})(this, (function () { 'use strict';

  /**
   * get user home through process.env and process.platform
   * @returns
   */
  function getUserHome() {
    return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
  }

  return getUserHome;

}));
