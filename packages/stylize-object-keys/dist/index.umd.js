/**
  * stylizeObjectKeys v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["stylize-object-keys"] = {}));
})(this, (function (exports) { 'use strict';

  /**
    * extendString v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  // @ymc/extend-string

  /* eslint-disable no-unused-vars,func-names */
  // fix no-unused-vars test,expectString

  /**
   *
   * @param {string} name
   * @param {()=>{}} handle
   */
  function extendStringPrototype(name, handle) {
    const tobeExtende = String.prototype;

    if (!tobeExtende[name]) {
      // tobeExtende[name] = function(){return handle(this)}
      // function (...args){return padEndString(this,...args)}
      tobeExtende[name] = function (...args) {
        return handle(this, ...args);
      };
    } // String.prototype.humanize= function(){return humanize(this)}

  }
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

  function slugify(s) {
    return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toLowerCase()).replace(/\s+/g, '-');
  }

  function camelize(s) {
    return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
  }

  function underscoped(s) {
    return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toLowerCase()).replace(/\s+/g, '_');
  }

  function classify(s) {
    return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toUpperCase()).replace(/\s+/g, '');
  }

  function swapCase(s) {
    return s.replace(/(?:^\w|[A-Z-a-z]|\b\w)/g, (word, index) => {
      if (/[A-Z]/.test(word)) {
        return word.toLowerCase();
      }

      return word.toUpperCase();
    });
  }
  /**
   * the first char to upper case (only the first word)
   * @param {*} s
   * @returns
   */


  function capitialize(s) {
    return s.replace(/(?:^\w|[A-Z-a-z]|\b\w)/g, (word, index) => index === 0 ? word.toUpperCase() : word);
  }
  /**
   * make the firt char to upper (only the first word) , other lower
   * @param {*} s
   * @returns
   */


  function sentence(s) {
    return s.replace(/(?:^\w|[A-Z-a-z]|\b\w)/g, (word, index) => index === 0 ? word.toUpperCase() : word.toLowerCase());
  }
  /**
   * make the firt char to upper(for each word), other lower
   * @param {string|ctx} s
   * @returns
   */


  function titleize(s) {
    return s.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }

  function padStartString(number, len = 0, prefix = ' ') {
    if (number.length >= len) {
      return String(number);
    }

    return padStartString(prefix + number, len, prefix);
  }

  function padEndString(number, len = 0, prefix = ' ') {
    if (number.length >= len) {
      return String(number);
    }

    return padEndString(number + prefix, len, prefix);
  } // node lib/extend-string.js

  var styles = /*#__PURE__*/Object.freeze({
    __proto__: null,
    camelize: camelize,
    capitialize: capitialize,
    classify: classify,
    dasherize: slugify,
    extendStringPrototype: extendStringPrototype,
    humanize: humanize,
    padEnd: padEndString,
    padEndString: padEndString,
    padStart: padStartString,
    padStartString: padStartString,
    sentence: sentence,
    slugify: slugify,
    swapCase: swapCase,
    titleize: titleize,
    underscoped: underscoped
  });

  /* eslint-disable no-unused-vars,no-param-reassign */

  /**
   * stylize param-json - nano-parser-flags
   * @param {object} flags
   * @param {likeCamelizeFlagsOption} options
   * @returns
   */

  function stylizeFlags(flags = {}, options = {}) {
    // let res = {}
    const option = {
      slim: true,
      style: 'camelize',
      // get more infomation on extend-string
      ...options
    };
    if (option[`noAuto-${options.style}`.camelize()]) return flags; // typeof ''[options.style]==="function"

    Object.keys(flags).forEach(str => {
      // const ck = str[options.style]() //use when extend string.prototype
      const ck = styles[options.style](str); // use when do not extend string.prototype
      // res[ck]=flags[k]

      if (ck !== str) {
        flags[ck] = flags[str];

        if (option.slim) {
          delete flags[str];
        }
      }
    });
    return flags;
  }
  /**
   * camelize param-json - nano-parser-flags
   * @param {object} flags
   * @param {camelizeFlagsOption} options
   * @returns
   */


  function camelizeFlags(flags = {}, options = {}) {
    // let res = {}
    const option = {
      slim: true,
      ...options
    };
    option.style = 'camelize';
    if (option.noAutoCamelize) return flags;
    stylizeFlags(flags, option);
    return flags;
  }

  exports.camelizeFlags = camelizeFlags;
  exports.stylizeFlags = stylizeFlags;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
