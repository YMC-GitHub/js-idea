/**
  * gitCommitMsgWrite v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["git-commit-msg-write"] = {}));
})(this, (function (exports) { 'use strict';

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

  function isString(s) {
    return typeof s === 'string';
  }
  function isEmpty(s) {
    return s === '';
  }
  function validString(s) {
    return isString(s) && !isEmpty(s);
  }

  /* eslint-disable no-param-reassign,func-names */
  /**
   * extend class
   * @param {function} cls
   * @param {string} name
   * @param {()=>{}} fun
   * @description
   * ```
   * set clss.prototype[name] = fun
   * ```
   */

  function extendClass(cls, name, fun) {
    cls.prototype[name] = fun;
  }
  /**
   * access ctx[ns]
   * @param {{}} ctx
   * @param {string} ns
   * @param {string} key
   * @param {*} val
   * @returns
   */


  function magincAccess(ctx, ns, key, val) {
    // let store = ctx.data
    // let data = store[ns]
    const data = ctx[ns];
    if (!validString(key)) return ctx;

    if (val || isString(val)) {
      data[key] = val;
      return ctx;
    }

    return data[key];
  } // wmd.type().scope().subject().body().foot().issue()
  // - [x] extract commom logic fun
  // - [x] register fun to avoid writing many method
  // - [ ] register fun to define fun alias
  // define class constructor


  class WriteMsgData {
    constructor() {
      this.data = {};
    }

  } // define class method


  'type|scope|subject|body|foot|issue'.split('|').forEach(method => {
    extendClass(WriteMsgData, method, function (...args) {
      return magincAccess(this, 'data', method, ...args);
    });
  });
  const writemsgdata = new WriteMsgData();

  /**
   * gen msg tpl with option (support angular style)
   * @param {genMsgTplOption} options
   * @returns
   * @description
   * ```
   *  ## angluar style
   *  `{type}({scope}): {subject}\n\n{body}\n\n{footer}`;
   *
   *  ## why head ?
   *  - [x] with type ,scope ,subject
   *
   *  ## why body ?
   *  - [x] detail about commit
   *
   *  ## why foot?
   *  - [x] BREAKING CHANGE eg. `BREAKING CHANGE:{detail}`
   *  - [x] Closes issue eg. `CLOESE ISUUE:#1,#2`
   *  ## revert?
   *
   *  'https://developer.aliyun.com/article/441408'
   *
   * ```
   */

  function writemsgtpl(options = {}) {
    // gen default tpl with option
    const option = {
      // type: false,
      // scope: false,
      // body: false,
      // foot: false,
      eof: '\n',
      ...options
    };
    const {
      eof
    } = option;
    const res = [];
    let tpl = ''; // set head

    if (option.type) {
      tpl = `${tpl}{type}`;
    }

    if (option.scope) {
      tpl = `${tpl}({scope})`;
    }

    if (option.colon || option.scope) {
      tpl = `${tpl}:`;
    }

    tpl = tpl ? `${tpl} {subject}` : '{subject}';
    res.push(tpl); // body

    if (option.body) {
      res.push(`${eof}{body}`);
    } // foot


    if (option.foot) {
      res.push(`${eof}{foot}`);
    }

    return res.join(eof);
  }
  /**
   * define msg tpl or render tpl
   * @param {string} tpl
   * @param {{[string]:unknown}|undefined} data
   * @returns
   */


  function writemsg(tpl, data) {
    return writeTpl(tpl, data);
  }

  exports.writemsg = writemsg;
  exports.writemsgdata = writemsgdata;
  exports.writemsgtpl = writemsgtpl;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
