/**
  * gitCommitMsgRead v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:child_process')) :
  typeof define === 'function' && define.amd ? define(['exports', 'node:child_process'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["git-commit-msg-read"] = {}, global.node_child_process));
})(this, (function (exports, node_child_process) { 'use strict';

  /**
    * runBash v0.0.3
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /* eslint-disable no-use-before-define,no-param-reassign */

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

  const cmdOptArr2cmdOptStr = (cmdOptStr, splitChar = ' ') => Array.isArray(cmdOptStr) ? cmdOptStr.join(splitChar) : cmdOptStr;

  function trimstdout(stdout) {
    return stdout.split(/\r?\n/).map(v => v.trim()).filter(v => v).join('\n');
  }
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


  const execWraper = (cmd, cmdOpts, execOpts) => new Promise((resolve, reject) => {
    // Assignment to function parameter 'execOpts'              no-param-reassign
    // desc: for exec(`git --version`],execOpts)
    if (!execOpts) {
      execOpts = cmdOpts;
      cmdOpts = cmd;
      cmd = '';
    }

    const option = cmdOptArr2cmdOptStr(cmdOpts); // desc: other yuyi to string
    // let { exec } = execOpts //eg:{exec}=require("child_process");
    // fix: exec is optional in execOpts

    const run = execOpts.exec ? execOpts.exec : node_child_process.exec;
    cmd = cmd ? `${cmd} ${option}` : `${option}`; // cmd=`${cmd} ${option}`.trimStart()
    // delete execOpts.exec; //desc:clean some property to keep execOpts as native
    // support exe opt : exec(cmd,execOpts,callback)
    // https://stackoverflow.com/questions/18894433/nodejs-child-process-working-directory

    run(`${cmd}`, execOpts, (e, stdout, stderr) => {
      // feat:fix unreadable zh code\with option.fixUnreadbleCode
      const {
        fixUnreadbleCode
      } = execOpts;

      if (fixUnreadbleCode) {
        const {
          iconvDesEncoding,
          iconvSrcEncoding
        } = execOpts; // fix: convert unreadble code only with code
        // fixUnreadbleCode=(code,charset="cp936")=>{return iconv.decode(err, charset)})
        // if (e) e = fixUnreadbleCode(e, iconvDesEncoding, iconvSrcEncoding)//del

        if (stdout) stdout = fixUnreadbleCode(stdout, iconvDesEncoding, iconvSrcEncoding);
        if (stderr) stderr = fixUnreadbleCode(stderr, iconvDesEncoding, iconvSrcEncoding); // console.log(e, stdout, stderr)
      } // feat: set reject err to be optional\nwhen execOpts.exitWhenErr=true


      if (e && execOpts.exitWhenErr) {
        reject(e);
      } // feat(core): trim stdout and stderr \ndo not trim when execOpts.noTrimOut=true


      if (!execOpts.noTrimOut) {
        stdout = trimstdout(stdout);
        stderr = trimstdout(stderr);
      } // case:reject std err and resolve std res
      // feat(core): set reject stderr to be optional in execOpts
      // reject when execOpts.rejectStderr=true


      if (execOpts.rejectStderr) {
        if (stderr) {
          reject(e);
        }

        resolve(stdout);
      } // case:resolve std err and res


      resolve({
        stdout,
        stderr
      });
    });
  });
  /* eslint-disable camelcase */


  const execOpts = {
    exec: node_child_process.exec
  };

  /**
    * renderTpl v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */

  /**
    * renderTpl v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */

  /** @typedef {{[string]:string|boolean|number|undefined}} data */

  /**
   * @param {string} tpl
   * @param {data} data
   * @returns {Stringimport("typescript").LiteralLike}
   */
  function renderTpl(tpl, data) {
    let res = tpl;
    Object.keys(data).forEach(key => {
      const value = data[key];
      res = res.replace(new RegExp(`{${key}}`, 'ig'), value);
    });
    return res;
  }
  /**
   *
   * @param {string} tpl
   * @param {data} data
   * @returns {string|(data:data)=>string}
   * @sample
   * ```
   * writeTpl('{method} repo/owner',{method:'POST'}) //POST repo/owner
   * ```
   */


  function writeTpl(tpl, data) {
    if (data) {
      return renderTpl(tpl, data);
    }

    return v => renderTpl(tpl, v);
  }

  /* eslint-disable no-param-reassign, */

  /**
   * ini data[key] with val
   * @param {{}} data
   * @param {string} key
   * @param {*} def
   */
  function inidata(data, key, def) {
    if (!data[key]) {
      data[key] = def;
    }
  }
  /**
   * bind val from map to list with keyword
   * @param {[][]} list
   * @param {string} name
   * @param {[][]} map
   * @returns
   */


  function bindVals(list = [], name = 'subject', map = []) {
    if (map.length !== list.length) return; // let map = toArray(s);

    const len = list.length;

    for (let index = 0; index < len; index += 1) {
      const line = list[index];
      line[`${name}`] = map[index];
    }
  }

  function toArray(s) {
    return s.trim().split(/\r?\n/);
  }

  /* eslint-disable no-unused-vars, prefer-const */
  // ggi is short for get-commit-info
  // pkg-design:
  // ggi-api
  // ggi-plugin-changelog
  // too

  /**
   * run git cmd
   * @param {string,string[]} cmd
   * @param {{}} execOption
   * @returns
   */

  async function rungit(cmd, execOption) {
    const {
      stdout,
      stderr
    } = await execWraper(cmd, execOption);
    return stdout;
  }
  /**
   * @description
   * ```
   * why used?
   * - [x] get git commit-msg data
   * - [x] gen changelog with commit-msg data
   * - [x] gen changelog for monorepo pkg
   * ```
   */


  class Store {
    constructor() {
      this.infojson = [];
      this.status = {};
    }
    /**
     *
     * @param {string} name
     * @param {string[]} list
     * @returns {this}
     */


    set(name, list) {
      const {
        infojson,
        status
      } = this; // ini data

      if (!status.initeddata) {
        inidata(infojson, name, {});
        status.initeddata = true;
      } // set


      bindVals(infojson, name, list);
      return this;
    }
    /**
     * get git commit hash
     * @returns {Promise<string>}
     */


    async getHash() {
      let tpl;
      let cmd;
      let res;
      tpl = 'git log --pretty=format:"%H" --abbrev-commit'; // %h

      cmd = writeTpl(tpl, {});
      res = await rungit(cmd, execOpts);
      return res;
    }
    /**
     * get git commit msg subject
     * @returns {Promise<string>}
     */


    async getSubject() {
      let tpl;
      let cmd;
      let res;
      tpl = 'git log --pretty=format:"%s" --abbrev-commit';
      cmd = writeTpl(tpl, {});
      res = await rungit(cmd, execOpts);
      return res;
    }
    /**
     * get git commit msg body
     * @returns {Promise<string>}
     */


    async getBody() {
      let tpl;
      let cmd;
      let res;
      tpl = 'git log --pretty=format:"%b"';
      cmd = writeTpl(tpl, {});
      res = await rungit(cmd, execOpts);
      return res;
    }
    /**
     * get git commit author date
     * @returns {Promise<string>}
     * @description
     * ```
     * author date vs commit date?
     * ```
     */


    async getDate() {
      let tpl;
      let cmd;
      let res; /// /git log --format=format:"%ai, %ci %aE %s"

      tpl = 'git log --pretty=format:"%as"'; // %cs %ci %as %ai

      cmd = writeTpl(tpl, {});
      res = await rungit(cmd, execOpts);
      return res;
    }
    /**
     * get git commit files or other info in a commit
     * @param {string[]} list commit hash
     * @returns {Promise<[string[]]>}
     * @sample
     * ```
     * // get file in a commit
     * let hash = await it.getHash()
     * hash=toArray(hash)
     * let tpl = 'git show --pretty="" --name-only {commit}'
     * await it.getFile(hash,tpl)
     * // get msg body in a commit
     * let body = await this.getFile(hash, `git log --pretty=format:"%b" {commit}`);
     * body = body.map(v=>v.join("\n"))
     * ```
     * @description
     * ```
     * work-flow:
     * each-hash -> get-in-commit -> to-array
     * ```
     */


    async getFile(list, tpl) {
      // let { infojson } = this;
      const res = [];

      for (let index = 0; index < list.length; index += 1) {
        const commit = list[index];
        const file = await getFilesInCommit(commit); // no-await-in-loop

        if (file) {
          res.push(toArray(file));
        }
      }

      return res;

      async function getFilesInCommit(commit) {
        const defalutTpl = 'git show --pretty="" --name-only {commit}';
        const cmd = writeTpl(tpl || defalutTpl, {
          commit
        }); // if (tpl) console.log(cmd);

        return rungit(cmd, execOpts);
      }
    }
    /**
     * get commit msg info
     * @returns {Promise<{commitInfoItem[]>}
     */


    async getinfo() {
      let hash;
      let subject;
      let body;
      let file;
      let date;
      hash = await this.getHash();
      hash = toArray(hash);
      subject = await this.getSubject();
      subject = toArray(subject); // body = await this.getBody();
      // body = toArray(body);

      body = await this.getFile(hash, 'git log -n 1 --pretty=format:"%b" {commit}');
      body = body.map(item => item.join('\n')); // console.log(body);

      date = await this.getDate();
      date = toArray(date);
      file = await this.getFile(hash); // log(body);
      // return [];
      // return {hash,subject,body,date,file}

      let res;
      res = hash.map((item, index) => {
        // const menifest = parsemsg(subject[index], body[index])
        let issue = ['']; // getIssueInFoot(menifest.foot)

        return {
          commit: item.slice(1, 10),
          subject,
          body,
          // ...menifest,
          issue,
          hash: item,
          file: file[index],
          date: date[index] // date[index].split(" ")[0], //2022-08-09 00:00:00 +8000

        };
      });
      this.infojson = res;
      return res;
    }
    /**
     * filter info by file
     * @param {regexp} reg file regexp
     * @returns {commitInfoItem[]}
     * @sample
     * ```
     * store.filterInfoByFile(new RegExp(`packages/${libname}/`, "i"))
     * ```
     */


    filterInfoByFile(reg = /.*/i) {
      const {
        infojson
      } = this;
      return infojson.filter(item => {
        if (item && item.file) {
          return item.file.some(file => reg.test(file));
        }

        return false;
      });
    }
    /**
     * filter info since last commit id
     * @param {commitInfoItem[]} data
     * @param {string} lastId
     * @returns
     */


    filterSinceLastChanglog(data, lastId) {
      const cache = [];

      for (let index = 0; index < data.length; index += 1) {
        const item = data[index];

        if (item.commit === lastId) {
          break;
        }

        cache.push(item);
      }

      return cache;
    }

  }

  const store = new Store();

  exports.Store = Store;
  exports.store = store;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
