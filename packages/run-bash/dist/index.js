/**
  * runBash v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('child_process')) :
  typeof define === 'function' && define.amd ? define(['exports', 'child_process'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.runBash = {}, global.child_process));
})(this, (function (exports, child_process) { 'use strict';

  /**
   * opt to arr-format
   * @description
   * ```
   * str to arr
   * ```
   * @param {string|string[]} cmdOptStr some cmd opt str-format or arr-format
   * @param {string} [splitChar=' '] some string
   * @returns {string[]}
   */
  /**
   * opt to str-format
   * @description
   * ```
   * arr to str
   * ```
   * @param {string|string[]} cmdOptStr some cmd opt str-format or arr-format
   * @param {string} [splitChar=' '] some string
   * @returns {string}
   */

  var cmdOptArr2cmdOptStr = function cmdOptArr2cmdOptStr(cmdOptStr) {
    var splitChar = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ' ';
    return Array.isArray(cmdOptStr) ? cmdOptStr.join(splitChar) : cmdOptStr;
  };
  /**
   * exec wraper
   * @param {string} cmd some cmd
   * @param {object} cmdOpts some cmd opts
   * @param {object} execOpts some exec opts
   * @returns {Promise}
   */

  var execWraper = function execWraper(cmd, cmdOpts, execOpts) {
    return new Promise(function (resolve, reject) {
      var cmdList = cmdOptArr2cmdOptStr(cmdOpts); // eg:{exec}=require("child_process");

      var exec = execOpts.exec; // support exe opt : exec(cmd,execOpts,callback)
      // https://stackoverflow.com/questions/18894433/nodejs-child-process-working-directory
      // delete execOpts.exec;

      exec("".concat(cmd, " ").concat(cmdList), execOpts, function (e, stdout, stderr) {
        if (e) {
          reject(e);
        } // case:reject std err and resolve std res
        // if (stderr) {
        //    reject(e);
        // }
        // resolve(stdout)
        // case:resolve std err and res


        resolve({
          stdout: stdout,
          stderr: stderr
        });
      });
    });
  };

  var execOpts = {
    exec: child_process.exec
  };

  exports.exec = execWraper;
  exports.execOpts = execOpts;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
