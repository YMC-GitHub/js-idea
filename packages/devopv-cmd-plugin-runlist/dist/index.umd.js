/**
  * devopvCmdPluginRunlist v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["devopv-cmd-plugin-runlist"] = factory());
})(this, (function () { 'use strict';

  /* eslint-disable max-len */
  const {
    log
  } = console;
  /**
   * filter valid cmd in multi-line list
   * @param {string} list
   * @returns {string[]}
   * @description
   * ```
   * split-line -> trim -> del-js-line-comment
   * ```
   */

  const getValidOpvCmds = (list = '') => list.split(/\r?\n/).map(line => line.trim()).filter(line => line.replace(/^\/\/.*/gi, ''));
  /**
   * run opv-cmds with cmds-array
   * @param {string|string[]} cmds
   * @param {boolean} quit
   * @param {exec} exec
   * @param {execOpts} execOpts
   * @returns
   * @description
   * ```
   * item-to-array -> run-bash-cmd -> log-stderr-if-presence -> quit-or-continue-when-stderr -> log-stdout-if-presence
   * ```
   */


  const runOpvCmds = async (cmds, quit, exec, execOpts) => {
    const list = Array.isArray(cmds) ? cmds : [cmds]; // queue with index

    /* eslint-disable no-await-in-loop */

    for (let index = 0; index < list.length; index += 1) {
      const cmd = list[index];
      const {
        stdout,
        stderr
      } = await exec(cmd, execOpts);

      if (stderr) {
        log(stderr);
        if (quit) return; // process.exit(0) vs return vs process.exit(1)
      }

      if (stdout) {
        log(stdout);
      }
    }
    /* eslint-enable no-await-in-loop */

  };

  /* eslint-disable max-len */
  /**
   * wrap run-bash to run list
   * @param {exec} exec
   * @param {execOpts} execOpts
   * @returns
   */

  function main(exec, execOpts) {
    /**
     * run opv-cmds with cmds-array
     * @param {string|string[]} cmds
     * @param {boolean} quit
     * @param {exec} exec
     * @param {execOpts} execOpts
     * @returns
     * @description
     * ```
     * item-to-array -> run-bash-cmd -> log-stderr-if-presence -> quit-or-continue-when-stderr -> log-stdout-if-presence
     * ```
     */
    return function fn(cmds, quit) {
      const list = getValidOpvCmds(cmds);
      return runOpvCmds(list, quit, exec, execOpts);
    };
  }

  return main;

}));
