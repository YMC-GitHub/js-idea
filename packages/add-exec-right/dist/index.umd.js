/**
  * addExecRight v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:fs'), require('node:child_process')) :
  typeof define === 'function' && define.amd ? define(['exports', 'node:fs', 'node:child_process'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["add-exec-right"] = {}, global.node_fs, global.node_child_process));
})(this, (function (exports, node_fs, node_child_process) { 'use strict';

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
  /**
   * get config from param - call it built-in
   * @param {cliParam[]} param
   * @param {{}} options
   * @returns
   */


  function getBuiltinConfig(param, options = {}) {
    return getValFromParam(param, options);
  }
  /**
   * get config from flags - prefer using nano-parse 's flags
   * @param {{}} flags
   * @param {{}} options
   * @returns {{}}
   */


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
    * limitAsyncHandle v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  // @ymc/promise-all # @ymc/limit-all-promise
  // @ymc/limit-async-handle

  /* eslint-disable no-underscore-dangle */
  const {
    log: log$1
  } = console;
  /**
   * @desciption
   * ```
   * ## why use?
   * - [x] limit a handle with limit max
   * - [x] run task with limit max
   * ```
   */

  class LimitAsyncHandle {
    constructor(max) {
      this.init(max);
    }

    init(max) {
      this._max = max;
      this._count = 0;
      this._taskQueue = [];
      this._debug = false;
      this._cb = null;
      return this;
    }
    /**
     * call handle - caller - passed args to it
     * @param {()=>Promise<unknown>} handle
     * @param {*} args
     * @returns {Promise<unknown>} return a new promise
     * @description
     * ```
     * ## idea
     * - [x] limit a handle by max
     * ```
     * @sample
     * ```
     * if._max=3
     * function get (url, param){lf.call(equest.get, url, param)}
     * await get(url,param)
     * ```
     */


    call(handle, ...args) {
      return new Promise((resolve, reject) => {
        const task = this._createTask(handle, args, resolve, reject);

        if (this._count >= this._max) {
          // console.log('count >= max, push a task to queue')
          this._taskQueue.push(task);
        } else {
          task();
        }
      });
    }
    /**
     * create a task
     * @param {()=>{}} handle
     * @param {*} args
     * @param resolve
     * @param reject
     * @returns {()=>{}}
     * @private
     */


    _createTask(handle, args, resolve, reject) {
      return () => {
        handle(...args).then(resolve).catch(reject).finally(() => {
          this._next();
        });

        this._nextTick();
      };
    }

    _next() {
      // next in final
      this._count -= 1; // Unary operator '--' used                  no-plusplus

      if (this._taskQueue.length) {
        // console.log('a task run over, pop a task to run')
        const task = this._taskQueue.shift();

        task();
      } else {
        if (this._debug) {
          log$1('task count = ', this._count);
        }

        if (this._cb) {
          this._cb();
        }
      }
    }

    _nextTick() {
      this._count += 1; // Unary operator '++' used                  no-plusplus

      if (this._debug) {
        log$1('task count = ', this._count);
      }
    }

  }

  new LimitAsyncHandle();

  /**
    * kindOf v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  // @ymc/kind-of # @ymc/type-of
  // @ymc/is-type # @ymc/is
  const {
    toString
  } = Object.prototype;
  /**
   * get kind of thing
   * @param {*} thing
   * @returns {string}
   * @description
   * ```
   * ## good ?
   * - [x] cache result
   * - [x] zero middle var with iifn
   * ```
   */

  const kindOf = (cache => thing => {
    const str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase()); //eslint-disable-line
    // Return statement should not contain assignment        no-return-assign
    // Assignment to property of function parameter 'cache' no-param-reassign
  })(Object.create(null));

  /**
    * promiseAll v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */

  /* eslint-disable no-underscore-dangle,no-unused-vars */
  // promise all promise with limit (idea 2)

  /**
   *
   * @param {Promise[]} all
   * @param {number|undefined} max
   * @returns {Promise[]}
   */

  function promiseAll(all, max) {
    return new Promise((resolve, reject) => {
      // 'reject' is defined but never used  no-unused-vars
      const num = max || all.length;
      const lah = new LimitAsyncHandle(num);
      const data = []; // limit max , create task , run task

      const storeHandleResult = i => {
        let promise = all[i]; // feat: all is async functions

        if (kindOf(promise) === 'asyncfunction') {
          promise = promise();
        } else if (kindOf(promise) === 'function') {
          // feat: all is functions
          promise = Promise.resolve(promise());
        }

        return promise.then(res => {
          if (lah._debug) {
            data[i] = {
              index: i,
              data: res,
              state: 'ok'
            };
          } else {
            data[i] = res;
          }
        }, error => {
          if (lah._debug) {
            data[i] = {
              index: i,
              state: 'no',
              error
            };
          } else {
            data[i] = error;
          }
        }).finally(() => {
          // promise has been settled
          // if (!this._taskQueue.length && this._count===1) {
          //     resolve(data);
          // }
          // or:
          lah._cb = () => {
            //! this._taskQueue.length && this._count===0
            if (lah._count === 0) {
              resolve(data);
            }
          };
        });
      };

      for (let i = 0; i < all.length; i += 1) {
        // call handle storeHandleResult with limit number
        lah.call(storeHandleResult, i);
      } // or:
      // all.forEach((v,i)=>{
      //     lah.call(storeHandleResult, i);
      // })

    });
  }

  /* eslint-disable prefer-const,no-unused-vars */

  const {
    log
  } = console;

  function param() {
    return [...baseParam(), {
      name: '-p,--bin-path',
      type: 'string',
      value: 'bin',
      desc: 'the location of bin path'
    }, {
      name: '--ext',
      type: 'string',
      value: '.js,.sh',
      desc: 'only for matched file extention'
    }, {
      name: '--update-by-git',
      type: 'boolean',
      value: false,
      desc: 'run git update-index --chmod=+x xx or not'
    }, {
      name: '--check-git',
      type: 'boolean',
      value: false,
      desc: 'check if git init'
    }, {
      name: '--verbose',
      type: 'boolean',
      value: false,
      desc: 'info file right info or not'
    }, {
      name: '--file-head',
      type: 'string',
      value: '',
      // #!/usr/bin/env node # default-file-head
      desc: 'add file head, custom file head'
    }];
  } // uni-cli-and-lib - cli and lib use the same code


  async function main(options = {}) {
    const option = { // help:false,
      ...getBuiltinConfig(param()),
      // ...options,
      ...getCliFlags(options)
    };
    const dir = option.binPath;
    let list = node_fs.readdirSync(dir).map(f => `${dir}/${f}`).filter(f => node_fs.statSync(f).isFile());

    if (option.ext) {
      const {
        ext
      } = option;
      const extReg = ext.split(',').map(ex => new RegExp(`${ex}$`));
      list = list.filter(f => extReg.some(reg => reg.test(f)));
    } // feat: add file head ? (todo) (advice: extract to a new lib or cli, to keep this to be small)
    // if(option.fileHead){
    // }
    // no-shadow


    const genTaskHandle = opt => {
      // add exec right to file
      const addExecRightToFile = async () => {
        let res;
        let cmd = `chmod +x ${opt.file}`;
        log(`[info] run: ${cmd}`);
        res = await execWraper(cmd, execOpts);

        if (opt.updateByGit) {
          cmd = `git update-index --chmod=+x ${opt.file}`;
          log(`[info] run: ${cmd}`);
          res = await execWraper(cmd, execOpts);
        }

        return res;
      }; // return addExecRightToFile()


      return addExecRightToFile;
    };
    let tasks; // gen task list - task - with zero fun args

    tasks = list.map(f => genTaskHandle({ ...option,
      file: f
    })); //  promise all way 5

    await promiseAll(tasks, 3); // log(prs);

    let res; // info file rights in loc

    if (!option.verbose) {
      res = await execWraper(`ls ${dir} -l`, execOpts);
      log(res);
    }
  } // const run = async () => {
  // https://dev.to/ku6ryo/chmod-x-by-git-on-windows-5fjd
  // https://m.imooc.com/wenda/detail/417375

  exports.main = main;
  exports.param = param;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
