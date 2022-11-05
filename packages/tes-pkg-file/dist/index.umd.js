/**
  * tesPkgFile v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:child_process'), require('node:fs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'node:child_process', 'node:fs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["tes-pkg-file"] = {}, global.node_child_process, global.node_fs));
})(this, (function (exports, node_child_process, node_fs) { 'use strict';

  /**
    * cliPresetParam v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  // plan:
  // @ymc/ycs-plugin-param
  // @ymc/ycs-preset-param
  // @ymc/ycs-preset-base-param
  // @ymc/ycs-preset-token-param
  // @ymc/ycs-preset-page-param
  // @ymc/ycs-preset-user-param
  // @ymc/ycs-preset-github-param

  /** @typedef {{name:string,type:string,value:string|boolean,desc:string}[]} param */

  /**
   * ysc param preset - base - for help and version
   * @returns {param}
   */
  function baseParam() {
    return [{
      name: '-h,--help',
      type: 'boolean',
      value: false,
      desc: 'info help'
    }, {
      name: '-v,--version',
      type: 'string',
      value: '1.0.0',
      desc: 'info version'
    }];
  }

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
    * cliParam v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /* eslint-disable no-unused-vars */
  // const { log } = console;

  /** @typedef {{linkKeyAndVal:string,span:string}} pathParamTransferOption */

  /** @typedef {{noAutoCamelize?:boolean,slim?:boolean,mode?:string,modeStyle:string}} getBuiltinFlagsOption */

  /* eslint-disable-line  max-len */

  /** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} camelizeFlagsOption */

  /** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} likeCamelizeFlagsOption */

  /** @typedef {{name:string,type:string,value:string|boolean,desc:string}} cliParam */

  /** @typedef {string} cliArgsStringExp */

  /** @typedef {string} httpQueryStringExp */

  /** @typedef {string} swithOptionStringExp */

  /** @typedef {object|cliArgsStringExp|httpQueryStringExp|swithOptionStringExp} getValFromParamResult */

  /* eslint-disable-line  max-len */

  /**
   * get param-string from param-json
   * @param {{[string]:string}} json
   * @param {{modeStyle:string}} options
   * @returns {string}
   */

  function paramJsonToString(json, options) {
    const option = {
      modeStyle: 'cli',
      ...options
    };
    let res = ''; // param json to cli string exp

    if (option.mode === 'string' && option.modeStyle === 'cli') {
      res = Object.keys(json).map(v => {
        if (v.length > 1) {
          return `--${v}=${json[v]}`;
        }

        return `-${v}=${json[v]}`;
      }).join(' ');
    } // param json to httpquery string exp


    if (option.mode === 'string' && option.modeStyle === 'httpquery') {
      res = Object.keys(json).map(v => `${v}=${json[v]}`).join('&');
    } // param json to swithoption string exp


    if (option.mode === 'string' && option.modeStyle === 'swithoption') {
      res = Object.keys(json).map(v => `${v}=${json[v]}`).join(';');
    }

    return res;
  }
  /**
   * get value from param-json
   * @param {cliParam[]} param
   * @param {getBuiltinFlagsOption} options
   * @returns {getValFromParamResult}
   */


  function getValFromParam(param, options = {}) {
    let res = {};
    const list = Object.keys(param).map(k => param[k]);
    const option = {
      slim: true,
      modeStyle: 'cli',
      ...options
    };

    if (option.mode === 'string') {
      option.slim = true;
    }

    for (let index = 0; index < list.length; index += 1) {
      const v = list[index];
      const {
        name,
        type,
        value,
        desc
      } = v;
      const [s, l] = name.split(/,/).map(i => i.trim().replace(/^-*/gi, '')); // 'hasLong' is assigned a value but never used

      const thelong = s.length > 1 ? s : l; // desc: set value for the long name

      if (thelong) {
        // feat: auto camelize
        if (!option.noAutoCamelize) {
          // res[camelize(thelong.replace(/-+/gi, " "))] = value;
          // res[thelong.camelize()] = value
          res[camelize(thelong)] = value;
        } // feat: slim them

        /* eslint-disable no-continue */


        if (option.slim) continue; // Unexpected use of continue statement

        /* eslint-enable no-continue */

        res[thelong] = value;
      } // desc: set value for the short name


      res[s] = value;
    }

    if (option.mode === 'string') {
      res = paramJsonToString(res, option);
    }

    return res;
  }
  /**
   * camelize param-json - nano-parser-flags
   * @param {object} flags
   * @param {camelizeFlagsOption} options
   * @returns
   */


  function camelizeFlags(flags = {}, options = {}) {
    // let res = {}
    const option = {
      slim: true,
      ...options
    };
    if (option.noAutoCamelize) return flags;
    Object.keys(flags).forEach(k => {
      const ck = camelize(k); // res[ck]=flags[k]

      if (ck !== k) {
        flags[ck] = flags[k]; // eslint-disable-line no-param-reassign
        // Assignment to property of function parameter

        if (option.slim) {
          delete flags[k]; // eslint-disable-line no-param-reassign
          // Assignment to property of function parameter
        }
      }
    });
    return flags;
  }

  function getBuiltinConfig(param, options = {}) {
    return getValFromParam(param, options);
  }

  function getCliFlags(flags, options = {}) {
    let cliFlags;
    const {
      entrys
    } = options;

    if (flags.flags || entrys && entrys.notOnlyFlags) {
      cliFlags = flags.flags;
    } else {
      cliFlags = flags;
    }

    return camelizeFlags(cliFlags, options);
  }

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
   * info cmd of tes , run cmd , log err and output,  get fail or done
   * @param {string} cmd
   * @param {{}} execOpts
   * @returns {string}
   */


  async function runcmdWithState(cmd, execOpts) {
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
   * get pkg name , set task state - use pkg name as primate key to match
   * @param {{pkgLoc:string,storeAt:string,key:string,state:string}} options
   */


  async function setTaskState(options = {}) {
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

  // import parserArgs from '@ymc/nano-parse'
  // import { ycsRunner } from '@ymc/cli-runner'
  // import { exec, execOpts, setExecOptsForIconv } from '@ymc/run-bash'
  // import iconv from 'iconv-lite'

  function param() {
    return [...baseParam(), {
      name: '--pkg-loc',
      type: 'string',
      value: './packages/noop',
      desc: 'the location of pkg'
    }, {
      name: '--jest-cmd',
      type: 'string',
      value: 'npx jest',
      // './node_modules/.bin/jest' | 'npx jest'
      desc: 'the cmd of jest'
    }, {
      name: '--jest-cnf-loc',
      type: 'string',
      value: 'test/unit/jest.config.json',
      desc: 'the location of jest config'
    }, {
      name: '--run-cmd',
      type: 'boolean',
      value: false,
      desc: 'run jest cmd or not'
    }];
  }

  async function main(options = {}) {
    const option = { // help:false,
      ...getBuiltinConfig(param()),
      ...getCliFlags(options)
    };
    log(`[task] run unit test for pkg ${option.pkgLoc}`);
    const cmd = `${option.jestCmd} ${option.pkgLoc} --config=${option.jestCnfLoc} --color --passWithNoTests`;

    if (option.runCmd) {
      // setExecOptsForIconv(iconv, execOpts) //for dbg when error
      const state = await runcmdWithState(cmd, execOpts);
      await setTaskState({
        pkgLoc: option.pkgLoc,
        key: 'tes_state',
        state,
        storeAt: 'pkgs-info.json'
      });
    }

    return cmd;
  } // get usage with @ycs/cli-option

  exports.main = main;
  exports.param = param;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
