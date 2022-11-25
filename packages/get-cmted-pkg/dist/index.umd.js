/**
  * getCmtedPkg v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node:child_process'), require('node:fs')) :
  typeof define === 'function' && define.amd ? define(['node:child_process', 'node:fs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["get-cmted-pkg"] = factory(global.node_child_process, global.node_fs));
})(this, (function (node_child_process, node_fs) { 'use strict';

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
    * streamIo v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  function readStream(stream) {
    return new Promise((resolve, reject) => {
      let data = '';
      stream.on('data', chunk => {
        data += chunk.toString();
      }).on('end', () => {
        resolve(data);
      }).on('error', reject);
    });
  }

  function writeStream({
    stream,
    data
  }) {
    return new Promise((resolve, reject) => {
      // write
      stream.write(data, 'utf-8'); // fire end

      stream.end(); // desc-x-s: handle event finish and err

      stream.on('finish', () => {
        resolve(data);
      }).on('error', reject); // desc-x-e: handle event finish and err
    });
  }

  /**
    * jsonStreamIo v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /**
   * @sample
   * ```
   * jsonstream.file.name="package.json"
   * //or
   * jsonstream.init("package.json")
   * await jsonstream.read()
   * await jsonstream.write({})
   * ```
   */

  class JsonStream {
    constructor(name, data) {
      this.init(name, data);
    }
    /**
     * read file async (stream mode)
     * @param {{}|[]} def
     * @returns {Prmosie<json>}
     */


    async read(def = {}) {
      const {
        file
      } = this;
      let reader;
      let res;

      try {
        reader = node_fs.createReadStream(file.name);
        res = await readStream(reader);
        res = JSON.parse(res);
      } catch (error) {
        // console.log(error);
        res = def;
      }

      file.data = res;
      return res;
    }
    /**
     * write file async (stream mode)
     * @param {{}|[]|undefined} data
     * @returns {Prmosie<void>}
     */


    async write(data) {
      // no-param-reassign data
      // no-unused-vars option

      /* eslint-disable no-unused-vars */
      const {
        file,
        option
      } = this; // eslint-disable-line

      let writer;
      let content = data;

      try {
        writer = node_fs.createWriteStream(file.name);

        if (data) {
          file.data = data;
        } else {
          content = file.data;
        }

        await writeStream({
          stream: writer,
          data: JSON.stringify(content, null, 2)
        });
      } catch (error) {}
    }

    init(name = 'package.json', data = {}) {
      this.file = {
        name,
        data
      };
      this.option = {};
    }
    /* eslint-disable class-methods-use-this */


    new(...option) {
      return new JsonStream(...option);
    }

  }

  const jsonstream = new JsonStream();

  const {
    log
  } = console;
  /**
   * get loginfo function
   * @param {boolean} enable
   * @returns {()=>void} a function to log info
   */

  function getLogInfo(enable) {
    return function (...msg) {
      if (enable) {
        log(...msg);
      }
    };
  }

  async function main(options = {}) {
    const option = {
      out: `pkgs-cmted.tmp.json`,
      packageslocReg: /^packages\//,
      logInfo: false,
      logTask: false,
      ...options
    };
    const {
      packageslocReg
    } = option;
    const loginfo = getLogInfo(option.logInfo);
    const logtask = getLogInfo(option.logTask);
    logtask(`[task] read commited pkgs from gitlog`);
    loginfo(`[info] read commited pkgs`);
    let pkgcmt;
    pkgcmt = await rumcmd('git ls-tree --full-tree --name-only -r HEAD', execOpts);
    pkgcmt = pkgcmt.split(/\r?\n/).filter(v => v);
    pkgcmt = await getCmtedVcPkgNameInLoc({
      files: pkgcmt,
      for: 'pkg-loc',
      packageslocReg
    });
    log(pkgcmt.join('\n'));
    loginfo(`[info] save commited pkgs`);
    let loc = option.out;
    jsonstream.init(loc);
    await jsonstream.write(pkgcmt);
    loginfo(`[info] out: ${loc}`);
    return pkgcmt;
  }

  async function rumcmd(cmd, execOpts) {
    const {
      stdout,
      stderr
    } = await execWraper(cmd, execOpts);
    return stdout;
  }
  /**
   * get pkg name of version control (vc) - mono repo -cmted
   * @param {{packageslocReg:regexp,pathSplit:string}} options
   * @returns {string[]}
   */


  async function getCmtedVcPkgNameInLoc(options = {}) {
    const option = {
      EOFReg: /\r?\n/,
      pathSplit: '/',
      packageslocReg: /^packages\//,
      files: '',
      for: 'pkg-name',
      ...options
    };
    let {
      files
    } = option;
    if (!files) return []; // only in package loc

    files = files.filter(v => option.packageslocReg.test(v));
    const sep = option.pathSplit; // get name or loc
    // eg. file=packages/noop/xx ; name=noop;loc=packages/noop;

    switch (option.for.toLowerCase()) {
      case 'pkg-loc':
        files = files.map(v => v.split(sep).slice(0, 2).join(sep)).filter(v => v);
        break;

      case 'pkg-name':
      default:
        files = files.map(v => v.split(sep)[1]).filter(v => v);
        break;
    } // del dup


    files = [...new Set(files)];
    return files;
  }

  return main;

}));
