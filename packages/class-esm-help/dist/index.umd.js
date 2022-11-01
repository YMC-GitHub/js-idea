/**
  * classEsmHelp v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["class-esm-help"] = {}));
})(this, (function (exports) { 'use strict';

  /* eslint-disable no-param-reassign,no-unused-expressions,import/prefer-default-export */

  /**
   *
   * @param {function} constructor
   * @param {function} superConstructor
   * @param {{[string]:function}} props
   * @param {{}} descriptors
   * @description
   * ```
   * - set constructor.prototype with superConstructor and descriptors
   * - set constructor.prototype.constructor
   * - set constructor.super
   * - set constructor.prototype.xx with props
   * ```
   */
  function inherits(constructor, superConstructor, props, descriptors) {
    // set constructor.prototype
    constructor.prototype = Object.create(superConstructor.prototype, descriptors); // set constructor.prototype.constructor

    constructor.prototype.constructor = constructor; // set constructor.super

    Object.defineProperty(constructor, 'super', {
      value: superConstructor.prototype
    }); // set constructor.prototype.xx method or property

    props && Object.assign(constructor.prototype, props);
  }

  exports.inherits = inherits;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
