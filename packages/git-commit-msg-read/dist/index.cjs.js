/**
  * gitCommitMsgRead v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

/**
  * gitCommitMsgParse v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

/**
 * is one item of list
 * @param {string} one
 * @param {string[]} list
 * @returns {boolean}
 * @sample
 * ```
 *  let validType = "feat|fix|docs|style|refactor|preform|test|tool|chore|revert";
 * oneOf('feat', validType.slpit("|")) //true
 * ```
 */
function oneOf(one, list) {
  return list.some(v => v === one);
}
/**
 * is valid type
 * @param {string} type
 * @param {string} validTypes
 * @returns {boolean}
 * @sample
 * ```
 * isValidType('feat') //true
 * ```
 */


function isValidType(type, validTypes = 'feat|fix|docs|style|refactor|preform|test|tool|chore|revert') {
  return oneOf(type, validTypes.split('|'));
}

function isDefine(c) {
  return c !== undefined;
}

function toArray$1(s) {
  // console.log(typeof s);
  return s.trim().split(/\r?\n/);
} // fix:fix msg when escape \n with \\n


function fixmsg(s) {
  return s.trim().split(/\r?\n/).map(v => v.trim().split('\\n')).flat(1).map(v => v.trim()); // \\n
  /// \\n/
}
/* eslint-disable prefer-const */

/**
 * get type in subject
 * @param {string} subject
 * @param {string} allowTypes
 * @returns {string}
 * @sample
 * ```
 * getTypeInSubject(`feat(run-bash): change all thing`) //feat
 * ```
 * @description
 * ```
 * ## why use?
 * - [x] parse msg to gen changelog.md
 * - [x] parse msg to gen changset
 * - [x] parse changset to gen changelog.md
 * - [x] ...
 *
 * with scope?
 * without scope?
 * ```
 */


function getTypeInSubject(subject, allowTypes) {
  // with scope
  const reg = /\(.*\):?/gi;
  const match = subject.match(reg);

  if (match) {
    return subject.split(':')[0].replace(reg, '');
  } // without scope


  let res = subject.split(' ')[0].trim().replace(/\(.*\):?/gi, '').trim();

  if (!isValidType(res, allowTypes)) {
    res = '';
  }

  return res;
}
/**
 * get scope in subject
 * @param {string} subject
 * @returns {string}
 * @sample
 * ```
 * getScopeInSubject(`feat(run-bash): change all thing`) //run-bash
 * ```
 */


function getScopeInSubject(subject = '') {
  const match = subject.match(/\(.*\)/gi);
  let res = '';

  if (match) {
    [res] = match;
  }

  res = res.replace(/(^\(|\)$)/gi, '');
  return res;
}
/**
 *
 * @param {string} text
 * @returns {{body:string,foot:string}}
 * @sample
 * ```
 * parseMsgBody(`overide exec function args\nCLOSING ISSUE #1`)
 * //{body:"overide exec function args",foot:"CLOSING ISSUE #1"}
 * ```
 */


function parseMsgBody(text = '') {
  let body;
  const res = {
    body: text,
    foot: ''
  };
  let list;
  body = text.replace(/\\\\n/gi, '\n');
  list = toArray$1(body); // log(list, body);

  let b;
  let c;
  let d;

  for (let index = 0; index < list.length; index += 1) {
    const line = list[index]; // breaking change

    if (!isDefine(b) && line.match(/^BREAKING CHANGE/i)) {
      b = index;
    } // closing issue


    if (!isDefine(c) && line.match(/^CLOSING ISSUE/i)) {
      c = index;
    } // generated by


    if (!isDefine(d) && line.match(/^generated by/i)) {
      d = index;
    }

    if (isDefine(c) && isDefine(b) && isDefine(d)) {
      break;
    }
  }

  let s = -1;

  if (!isDefine(c)) {
    c = -1;
  }

  if (!isDefine(b)) {
    b = -1;
  }

  if (!isDefine(d)) {
    d = -1;
  }

  s = Math.max(c, b, d); // log(`---------------${s}`);

  if (s >= 0 && s <= list.length) {
    // res = list.slice(s).join("\n");
    res.foot = list.slice(s).join('\n').trim();

    if (s > 0) {
      res.body = list.slice(0, s).join('\n').trim();
    } else {
      res.body = '';
    }
  }

  return res;
}
/**
 *
 * @param {string} foot
 * @param {regexp} issueReg
 * @returns {string[]}
 * ```
 * //no:
 * parseMsgBody(`CLOSING ISSUE #1,#2`) //['#1','#2']
 * //please:one issue one commit
 * parseMsgBody(`CLOSING ISSUE #1`) //['#1']
 * ```
 */


function getIssueInFoot(foot, issueReg = /#\d+/gi) {
  const match = foot.match(issueReg);
  let res = [];

  if (match) {
    res = match;
  }

  return res;
}
/**
 * parse commit msg (anglur-style)
 * @param {string} msg
 * @param {string} msgb
 * @param {string} allowTypes
 * @returns {msgJson}
 */


function parse(msg, msgb, allowTypes) {
  let type;
  let scope;
  let subject;
  let body;

  if (msgb) {
    [subject, body] = [msg, msgb]; // (subject = msg), (body = msgb);
  } else {
    // get subject and body (rough)
    const list = fixmsg(msg);
    [subject] = list;
    body = list.slice(1).join('\n'); // feat: set subject as body when no body or body in subject

    if (!body) body = subject;
  } // get type,scope,subject,body,foot (detail)


  const standardBody = parseMsgBody(body); // console.log(subject, body, standardBody);

  type = getTypeInSubject(subject, allowTypes);
  scope = getScopeInSubject(subject); // slim subject
  // idea:del-type -> del-scope -> trim

  subject = subject.replace(type, '').replace(/\(.*\):?/i, '').trim();
  return {
    type,
    scope,
    subject,
    ...standardBody
  };
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
    this.options = {};
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

  getTpl(tpl, options = {}) {
    let res = tpl;
    let option = { ...options,
      ...this.options
    };

    if (option.n) {
      res = `${tpl} -n ${option.n}`;
    }

    return res;
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

    tpl = this.getTpl(tpl); // -n 1

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
    tpl = this.getTpl(tpl);
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
    tpl = this.getTpl(tpl);
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

    tpl = this.getTpl(tpl);
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
    let defalutTpl = 'git show --pretty="" --name-only {commit}'; // defalutTpl = this.getTpl(defalutTpl)

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
      const cmd = writeTpl(tpl || defalutTpl, {
        commit
      }); // if (tpl) console.log(cmd);

      return rungit(cmd, execOpts);
    }
  }
  /**
   * get commit msg info
   * @returns {Promise<commitInfoItem[]>}
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

    let tpl;
    tpl = 'git log -n 1 --pretty=format:"%b" {commit}'; // tpl = this.getTpl(tpl)

    body = await this.getFile(hash, tpl);
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
   * get commit msg info -parsed subject and body
   * @returns {Promise<commitInfoItem[]>}
   */


  async parse() {
    let data = await this.getinfo(); // log(`[task] parse gitlog`)

    data = data.map((item, index) => {
      let {
        subject,
        body
      } = item;
      const menifest = parse(subject[index], body[index]);
      let issue = getIssueInFoot(menifest.foot);
      return { ...item,
        ...menifest,
        issue
      };
    });
    this.infojson = data;
    return data;
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
