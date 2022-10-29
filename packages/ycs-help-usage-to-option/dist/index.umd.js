/**
  * ycsHelpUsageToOption v0.0.2
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["ycs-help-usage-to-option"] = {}));
})(this, (function (exports) { 'use strict';

  // idea: usage to option
  // uo is short for usage-to-option
  // get subns
  // get subcmd
  const getTxtFromUsage = (s, usage = '') => {
    const regexp = new RegExp(` *${s}:.*`, 'ig');
    const match = usage.match(regexp);

    if (match) {
      return match[0].replace(new RegExp(` *${s}:`, 'i'), '');
    }

    return '';
  };

  const genOptionFromUsage = (ns = 'npm-bin', version = '1.0.0', usage = '') => {
    let option = {};
    option = { ...option,
      ...{
        version,
        ns,
        autoSubCmd: getTxtFromUsage('subcmd', usage),
        autoSubNs: getTxtFromUsage('subns', usage)
      }
    };
    return option;
  };

  exports.getTxtFromUsage = getTxtFromUsage;
  exports.usageToOption = genOptionFromUsage;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
