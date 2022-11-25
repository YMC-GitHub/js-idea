/**
  * gitCommitMsgParse v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["git-commit-msg-parse"] = {}));
})(this, (function (exports) { 'use strict';

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

  function toArray(s) {
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
    list = toArray(body); // log(list, body);

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

  exports.getIssueInFoot = getIssueInFoot;
  exports.getScopeInSubject = getScopeInSubject;
  exports.getTypeInSubject = getTypeInSubject;
  exports.parse = parse;
  exports.parseMsgBody = parseMsgBody;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
