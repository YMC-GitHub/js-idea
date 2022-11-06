/**
  * getCustomProp v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["get-custom-prop"] = factory());
})(this, (function () { 'use strict';

  /**
    * extendString v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /**
   *
   * @param {*} s
   * @returns {string}
   * @sample
   * ```
   * humanize('per_page')// Per page
   * humanize('per-page')// Per page
   * ```
   * @description
   * ```
   * ## idea
   * - [x] replace multi - or _ to one space
   * - [x] add space to the char that is uppercase and is not the first index
   * - [x] the first char to upper ,other lowercase
   * ```
   */


  function humanize(s) {
    return s.replace(/(?:^\w|[A-Z_-]|\b\w)/g, (word, index) => {
      let res = ''; // log(word, index); //desc: for debug
      // feat: replace multi - or _ to one space

      res = word.replace(/[-_]+/g, ' '); // feat: add space to the char that is uppercase and is not the first index

      res = index !== 0 ? res.replace(/[A-Z]/, ' $&') : res; // feat: the first char to upper ,other lowercase

      return index === 0 ? res.toUpperCase() : res.toLowerCase();
    }).replace(/\s+/g, ' ');
  }

  function camelize(s) {
    return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
  }

  /**
   * get prefixed prop
   * @param {string} prop
   * @param {{prefix:string,camelize:boolean}} option
   * @returns
   */

  function getPrefixedProp(prop, option) {
    let prefixedProp = prop;

    if (option.prefix) {
      prefixedProp = `${option.prefix}${prop}`;
    }

    if (option.camelize) {
      prefixedProp = `${option.prefix}-${prop}`;
      prefixedProp = camelize(prefixedProp);
    }

    return prefixedProp;
  }
  /**
   * get custom prop from context
   * @param {{}} context
   * @param {string} prop
   * @param {()=>{}} def
   * @param {{prefix:string,camelize:boolean}} options
   * @returns {*}
   * @desciption
   * ```
   * ## task
   * - [x] auto bind custiom prefix to property
   * - [x] auto camelize property
   * ```
   */


  function getCustomProp(context, prop, def, options = {}) {
    const option = {
      prefix: 'custom',
      camelize: true,
      ...options
    };
    const prefixedProp = getPrefixedProp(prop, option); // idea:get-custom-if-presence -> get-native-if-presence -> get-default-if-presence

    const native = context[prop] ? context[prop] : def;
    return context[prefixedProp] ? context[prefixedProp] : native;
  }

  return getCustomProp;

}));
