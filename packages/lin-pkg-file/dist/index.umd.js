/**
  * linPkgFile v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:child_process'), require('node:fs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'node:child_process', 'node:fs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["lin-pkg-file"] = {}, global.node_child_process, global.node_fs));
})(this, (function (exports, node_child_process, node_fs) { 'use strict';

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
    * extendString v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /**
   *
   * @param {*} s
   * @returns {string}
   * @sample
   * ```
   * humanize('per_page')// Per page
   * humanize('per-page')// Per page
   * ```
   * @description
   * ```
   * ## idea
   * - [x] replace multi - or _ to one space
   * - [x] add space to the char that is uppercase and is not the first index
   * - [x] the first char to upper ,other lowercase
   * ```
   */


  function humanize(s) {
    return s.replace(/(?:^\w|[A-Z_-]|\b\w)/g, (word, index) => {
      let res = ''; // log(word, index); //desc: for debug
      // feat: replace multi - or _ to one space

      res = word.replace(/[-_]+/g, ' '); // feat: add space to the char that is uppercase and is not the first index

      res = index !== 0 ? res.replace(/[A-Z]/, ' $&') : res; // feat: the first char to upper ,other lowercase

      return index === 0 ? res.toUpperCase() : res.toLowerCase();
    }).replace(/\s+/g, ' ');
  }

  function camelize(s) {
    return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
  }

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

  /**
   * mock node.js path.dirname
   * @param {string} wkd
   * @returns
   */
  function dirname(wkd, sep = '/') {
    const list = wkd.split(/\/?\\|\//);
    return list.slice(0, list.length - 1).join(sep);
  }
  /**
   * mock node.js path.basename
   * @param {string} wkd
   * @returns
   */


  function basename(wkd) {
    const list = wkd.split(/\/?\\|\//);
    return list[list.length - 1];
  }

  const {
    log
  } = console;
  /**
   * get lib name with working dir
   * @param {string} wkd
   * @param {{trim?:boolean,camelize?:boolean}} option
   * @returns
   */

  function getLibNameFromPath(wkd, option = {}) {
    let res = basename(wkd);
    const opt = {
      trim: true,
      ...option
    };

    if (opt.trim) {
      res = res.trim();
    }

    if (opt.camelize) {
      res = camelize(res);
    }

    return res;
  }
  /**
   * get lib dir with working dir
   * @param {string} wkd
   * @returns
   */


  function getPackagesLocFromPath(wkd) {
    return dirname(wkd);
  }
  /**
   * get done or fail with condition
   * @param {*} cond
   * @param {string} done
   * @param {string} fail
   * @returns {string}
   */


  function getFailOrDone(cond, done = 'done', fail = 'fail') {
    // get fail or done
    let state = done;

    if (cond) {
      state = fail;
    }

    return state;
  }
  /* eslint-disable no-shadow */

  /**
   * info cmd of lin , run cmd , log err and output,  get fail or done
   * @param {string} cmd
   * @param {{}} execOpts
   * @returns {string}
   */


  async function runeslint(cmd, execOpts) {
    log(`[info] run cmd: ${cmd}`);
    const {
      stderr,
      stdout
    } = await execWraper(cmd, execOpts);

    if (stderr) {
      log(stderr);
    }

    log(stdout);
    return getFailOrDone(stderr || stdout, 'done', 'fail');
  }
  /* eslint-enable no-shadow */

  /**
   * put pkgs-info
   * @param {string} name
   * @param {string} key
   * @param {string} state
   * @param {pkginfo[]} store
   * @returns {pkginfo[]}
   */


  function putPkgsInfo(name, key, state, store) {
    const added = store.some(v => v.name === name);

    if (!added) {
      store.push({
        name,
        [`${key}`]: state
      });
    } else {
      /* eslint-disable no-param-reassign */
      store.forEach(v => {
        if (v.name === name) {
          v[key] = state;
        }
      });
      /* eslint-enable no-param-reassign */
    }

    return store;
  }
  /**
   * get pkg name , set lin state - use pkg name as primate key to match
   * @param {{pkgLoc:string,storeAt:string,key:string,state:string}} options
   */


  async function setLinState(options = {}) {
    // loc, key = 'lin_state', state = 'todo'
    const option = {
      key: 'lin_state',
      state: 'todo',
      storeAt: 'pkgs-info.json',
      ...options
    };
    let loc = option.pkgLoc;
    log('[info] set lint state in store');
    jsonstream.init(`${option.pkgLoc}/package.json`);
    const pkgjson = await jsonstream.read({});
    loc = option.storeAt;
    jsonstream.init(`${loc}`);
    const data = await jsonstream.read([]);
    putPkgsInfo(pkgjson.name, option.key, option.state, data);
    await jsonstream.write(data);
    log(`[info] out: ${loc}`);
  }

  exports.exec = execWraper;
  exports.execOpts = execOpts;
  exports.getFailOrDone = getFailOrDone;
  exports.getLibNameFromPath = getLibNameFromPath;
  exports.getPackagesLocFromPath = getPackagesLocFromPath;
  exports.jsonstream = jsonstream;
  exports.putPkgsInfo = putPkgsInfo;
  exports.runeslint = runeslint;
  exports.setLinState = setLinState;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
