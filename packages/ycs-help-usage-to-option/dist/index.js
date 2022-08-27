/**
  * ycsHelpUsageToOption v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ycsHelpUsageToOption = {}));
})(this, (function (exports) { 'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      enumerableOnly && (symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      })), keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = null != arguments[i] ? arguments[i] : {};
      i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }

    return target;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  // idea: usage to option
  // uo is short for usage-to-option
  // get subns
  // get subcmd
  var getTxtFromUsage = function getTxtFromUsage(s) {
    var usage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var regexp = new RegExp(" *".concat(s, ":.*"), 'ig');
    var match = usage.match(regexp);

    if (match) {
      return match[0].replace(new RegExp(" *".concat(s, ":"), 'i'), '');
    }

    return '';
  };

  var genOptionFromUsage = function genOptionFromUsage() {
    var ns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'npm-bin';
    var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '1.0.0';
    var usage = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var option = {};
    option = _objectSpread2(_objectSpread2({}, option), {
      version: version,
      ns: ns,
      autoSubCmd: getTxtFromUsage('subcmd', usage),
      autoSubNs: getTxtFromUsage('subns', usage)
    });
    return option;
  };

  exports.usageToOption = genOptionFromUsage;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
