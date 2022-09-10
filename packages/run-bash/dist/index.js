/**
  * runBash v0.0.3
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('child_process')) :
  typeof define === 'function' && define.amd ? define(['exports', 'child_process'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["run-bash"] = {}, global.child_process));
})(this, (function (exports, child_process) { 'use strict';

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

  const cmdOptArr2cmdOptStr = (cmdOptStr, splitChar = ' ') => {
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

  const execWraper = (cmd, cmdOpts, execOpts) => {
    return new Promise((resolve, reject) => {
      //desc: for exec(`git --version`],execOpts)
      if (!execOpts) {
        execOpts = cmdOpts;
        cmdOpts = cmd;
        cmd = '';
      }

      const option = cmdOptArr2cmdOptStr(cmdOpts); //desc: other yuyi to string
      // let { exec } = execOpts //eg:{exec}=require("child_process");
      //fix: exec is optional in execOpts

      let run = execOpts.exec ? execOpts.exec : child_process.exec;
      cmd = cmd ? `${cmd} ${option}` : `${option}`; // cmd=`${cmd} ${option}`.trimStart()
      //delete execOpts.exec; //desc:clean some property to keep execOpts as native
      //support exe opt : exec(cmd,execOpts,callback)
      //https://stackoverflow.com/questions/18894433/nodejs-child-process-working-directory

      run(`${cmd}`, execOpts, (e, stdout, stderr) => {
        //feat: set reject err to be optional\nwhen execOpts.exitWhenErr=true
        if (e && execOpts.exitWhenErr) {
          reject(e);
        } //case:reject std err and resolve std res
        //if (stderr) {
        //    reject(e);
        //}
        //resolve(stdout)
        //case:resolve std err and res


        resolve({
          stdout,
          stderr
        });
      });
    });
  };

  const execOpts = {
    exec: child_process.exec
  };

  exports.exec = execWraper;
  exports.execOpts = execOpts;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
