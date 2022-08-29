/**
  * runBash v0.0.3
  * (c) 2018-2022 ymc
  * @license MIT
  */
/**
  * runBash v0.0.2
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
   * @sample
   * ```js
   * await exec(`git`,`--version`,execOpts) //correct
   * await exec(`git`,[`--version`],execOpts) //correct
   * await exec(`git --version`,execOpts) //correct
   * ```
   */

  var execWraper = function execWraper(cmd, cmdOpts, execOpts) {
    return new Promise(function (resolve, reject) {
      //desc: for exec(`git --version`],execOpts)
      if (!execOpts) {
        execOpts = cmdOpts;
        cmdOpts = cmd;
        cmd = '';
      }

      var option = cmdOptArr2cmdOptStr(cmdOpts); //desc: other yuyi to string

      var _execOpts = execOpts,
          exec = _execOpts.exec; //eg:{exec}=require("child_process");

      cmd = cmd ? "".concat(cmd, " ").concat(option) : "".concat(option); // cmd=`${cmd} ${option}`.trimStart()
      //delete execOpts.exec; //desc:clean some property to keep execOpts as native
      //support exe opt : exec(cmd,execOpts,callback)
      //https://stackoverflow.com/questions/18894433/nodejs-child-process-working-directory

      exec("".concat(cmd), execOpts, function (e, stdout, stderr) {
        if (e) {
          reject(e);
        } //case:reject std err and resolve std res
        //if (stderr) {
        //    reject(e);
        //}
        //resolve(stdout)
        //case:resolve std err and res


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
