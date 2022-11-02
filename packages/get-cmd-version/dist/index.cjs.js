/**
  * getCmdVersion v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* eslint-disable class-methods-use-this */

/**
 * @sample
 * ```
 * //gcv is short for get-cmd-version
 * gcv.setExec(exec)
 * gcv.setCmd("git --version")
 * await gcv.runCmd(execOpts)
 * gcv.getVersion(versionExpReg)
 *
 * //reqs:
 * import {exec,execOpts} from "@ymc/run-bash"
 *
 * //todo:
 * //await gcv.setExec(exec).setCmd("git --version").runCmd(execOpts).getVersion(versionExpReg)
 * ```
 */
class Gcv {
  constructor(option) {
    this.ini(option);
  }
  /**
   *
   * @param {string} cmd
   * @returns {this} to chain
   * @sample
   * ```
   * gcv.setCmd("git --version")
   * ```
   */


  setCmd(cmd) {
    const {
      option
    } = this;
    option.cmd = cmd;
    return this;
  }
  /**
   *
   * @param {{exec:function}} execOpts
   * @returns {this} to chain
   * @sample
   * ```
   * await gcv.runCmd()
   * await gcv.runCmd(execOpts)
   * ```
   */


  async runCmd(execOpts) {
    const {
      option
    } = this;
    const {
      cmd,
      exec,
      execOpts: opt
    } = { ...option,
      execOpts
    };
    option.res = await exec(cmd, opt);
    return this;
  }
  /**
   *
   * @param {regexp} versionExpReg
   * @returns {string}
   * @sample
   * ```
   * gcv.getVersion()
   * gcv.getVersion(/(\d{1,}.){1,2}\d{1,}/gi)
   * ```
   */


  getVersion(versionExpReg = /(\d{1,}.){1,2}\d{1,}/gi) {
    const {
      option
    } = this;
    const {
      cmd,
      res,
      versionExpReg: reg
    } = { ...option,
      versionExpReg
    };
    const version = res.match(reg);

    if (version) {
      // feat: set result without solft name\nwith option.onlyVersion
      if (option.onlyVersion) {
        return `${version[0]}`;
      }

      return `${cmd.split(' ')[0]}: ${version[0]}`;
    }

    return '';
  }
  /**
   *
   * @param {function} exec
   * @returns {tihs} to chain
   * @sample
   * ```
   * gsv.setExec(exec)
   * ```
   */


  setExec(exec) {
    const {
      option
    } = this;

    if (exec) {
      option.exec = exec;
    }

    return this;
  }
  /**
   * ini instance
   * @param {{}} option
   * @returns {tihs} to chain
   */


  ini(option = {}) {
    this.option = option;
    return this;
  }
  /**
   * ini a new instance without new xx()
   * @returns {this}
   */


  new(...option) {
    return new Gcv(...option);
  }

}

const gcv = new Gcv();

exports.Gcv = Gcv;
exports.gcv = gcv;
