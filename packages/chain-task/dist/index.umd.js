/**
  * chainTask v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["chain-task"] = factory());
})(this, (function () { 'use strict';

  /**
   * chain async task
   * @param {()=>{}} tasks
   * @returns {{}[]}
   */
  async function chaintask(tasks) {
    const res = [];
    let chain = Promise.resolve(null); // fix Unary operator '++' used       no-plusplus

    /* eslint-disable no-plusplus */

    for (let index = 0; index < tasks.length; index++) {
      const task = tasks[index]; // fix Unexpected console statement   no-console
      // fix 'v' is defined but never used  no-unused-vars

      /* eslint-disable no-unused-vars,no-console */

      chain = chain.then(async v => {
        // feat: save each result to res
        res[index] = await task();
        return res[index];
      }).catch(console.log);
    }

    await chain;
    return res;
  }

  return chaintask;

}));
