/**
  * addExecRight v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

var node_fs = require('node:fs');
var node_child_process = require('node:child_process');

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

/* eslint-disable func-names */
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
  * textStreamIo v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
/* eslint-disable prefer-const,class-methods-use-this */

/**
 * @sample
 * ```
 * textstream.file.name="CHANGELO.md"
 * //or
 * textstream.init("CHANGELO.md")
 * await textstream.read()
 * textstream.option.writemode='overide'
 * await textstream.write('')
 * ```
 */

class TextStream {
  constructor(name = 'CHANGELO.md') {
    this.init(name);
  }
  /**
   * read file async (stream mode)
   * @param {string|undefined} def
   * @returns {Prmosie<string>}
   */


  async read(def = '') {
    const {
      file
    } = this;
    let reader;
    let res;

    try {
      reader = node_fs.createReadStream(file.name);
      res = await readStream(reader);
    } catch (error) {
      res = def;
    }

    file.data = res;
    return res;
  }
  /**
   * write file async (stream mode)
   * @param {string} data
   * @returns {Prmosie<void>}
   */


  async write(data) {
    // prefer-const writer,old
    // no-param-reassign data
    // no-fallthrough
    const {
      file,
      option
    } = this;
    let writer;
    let old;
    writer = node_fs.createWriteStream(file.name);
    old = file.data; // insert-head?append?override?
    // let writemode = "override";

    let text;

    switch (option.writemode) {
      case 'override':
        text = `${data}`;
        break;
      // case "head":
      //   text = `${data}\n${old}`;
      //   break;

      case 'append':
        text = `${old}\n${data}`;
        break;
      // case "override":
      //   text = `${data}`;

      case 'head':
        text = `${data}\n${old}`;
        break;

      default:
        text = `${data}`;
        break;
    }

    file.data = text;
    await writeStream({
      stream: writer,
      data: text
    });
  }
  /**
   *
   * @param {string} name
   * @param {string} data
   * @returns {this}
   */


  init(name = 'CHANGELO.md', data = '') {
    this.file = {
      name,
      data
    };
    this.option = {};
    return this;
  }
  /**
   * ceate a new instance
   * @param  {...any} option
   * @returns
   */


  new(...option) {
    return new TextStream(...option);
  }

}

new TextStream();

/* eslint-disable prefer-const */
// const log = getLogInfo(true)

async function main$1(options = {}) {
  const option = {
    fileHead: '#!/usr/bin/env node',
    ...options
  }; // log(option)

  let text;
  let head;
  const textfileio = new TextStream();
  textfileio.init(option.loc);
  text = await textfileio.read('');
  text = text.split(/\r?\n/);
  [head] = text;

  if (head) {
    if (!/^#!/i.test(head)) {
      switch (option.action) {
        case 'del':
          text.shift();
          break;

        case 'add':
        default:
          text.unshift(option.fileHead);
          break;
      }
    }
  }

  text = text.join('\n');
  textfileio.init(option.loc);
  await textfileio.write(text);
}

/* eslint-disable prefer-const,no-unused-vars */
// read-directory
// get-cmted-pkgs
// gen-change-log

const logout = getLogInfo(true);

async function main(options = {}) {
  const option = {
    binPath: 'bin',
    ext: '.js,.sh',
    ...options // ...getBuiltinConfig(param()),
    // ...getCliFlags(options)

  }; // logout(option)

  const loginfo = getLogInfo(option.logInfo);
  const logtask = getLogInfo(option.logTask);
  logtask('[task] add exec rights to files');
  loginfo('[info] read file list');
  const dir = option.binPath;
  let list = node_fs.readdirSync(dir).map(f => `${dir}/${f}`).filter(f => node_fs.statSync(f).isFile());
  loginfo('[info] filter file list when ext passed');

  if (option.ext) {
    const {
      ext
    } = option;
    const extReg = ext.split(',').map(ex => new RegExp(`${ex}$`));
    list = list.filter(f => extReg.some(reg => reg.test(f)));
  } // no-shadow


  const genTaskHandle = opt => {
    // add exec right to file
    const addExecRightToFile = async () => {
      // feat: add file head ? (todo)
      // (may-be-good: extract to a new lib or cli, to keep this to be small)
      if (opt.onFileHead) {
        await main$1({
          loc: opt.file,
          ...(opt.fileHead ? {
            fileHead: opt.fileHead
          } : {})
        });
      }

      let res;
      let cmd = `chmod +x ${opt.file}`;
      loginfo(`[info] run: ${cmd}`);
      res = await execWraper(cmd, execOpts);

      if (opt.updateByGit) {
        cmd = `git update-index --chmod=+x ${opt.file}`;
        loginfo(`[info] run: ${cmd}`);
        res = await execWraper(cmd, execOpts);
      }

      return res;
    }; // return addExecRightToFile()


    return addExecRightToFile;
  };

  loginfo('[info] gen task handle');
  let tasks; // gen task list - task - with zero fun args

  tasks = list.map(f => genTaskHandle({ ...option,
    file: f
  })); // loginfo(`[info] run task handle`)

  await promiseAll(tasks, 3); // log(prs);

  let res; // info file rights in loc

  if (!option.verbose) {
    res = await execWraper(`ls ${dir} -l`, execOpts);
    logout(res);
  }
} // const run = async () => {
// https://dev.to/ku6ryo/chmod-x-by-git-on-windows-5fjd
// https://m.imooc.com/wenda/detail/417375

module.exports = main;
