/**
  * pipeAsyncFunc v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["pipe-async-func"] = factory());
})(this, (function () { 'use strict';

    function LengthError(msg) {
      const err = new Error(msg);
      err.name = 'Length Error'; // err.code = 404;

      return err;
    } // https://javascript.info/custom-errors
    // https://codeforgeek.com/nodejs-errors-list/


    function pipefn(...functions) {
      // feat: check args length
      // feat: at least one arg
      // feat: throw args length error
      if (functions.length === 0) {
        throw LengthError('Expected at least one argument');
      }

      return async input => {
        let currentValue = input; // eslint-disable-next-line no-restricted-syntax

        for (const func of functions) {
          currentValue = await func(currentValue); // eslint-disable-line no-await-in-loop
        }

        return currentValue;
      };
    }

    return pipefn;

}));
