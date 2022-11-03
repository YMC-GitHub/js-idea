/**
  * gitCommitTypeLang v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * del reg in exp
 * @param {string} exp
 * @param {regexp} reg
 * @returns {string}
 * @sample
 * ```
 * deletemulti("tool(chore)") //tool
 * ```
 */
function deletemulti(exp, reg = /\(.*\)/gi) {
  let res = exp;
  const match = res.match(reg); // log(reg, many, reg.test(exp));

  if (match && match[0]) {
    res = res.replace(match[0], '');
  }

  return res;
}
/**
 * get valid-msg types - delete msg type alias
 * @param {string} entype
 * @param {string} sc split char
 * @returns {string}
 * @sample
 * ```
 * validType("feat|fix|tool(chore)") //=>feat|fix|tool
 * ```
 */


function validType(entype, sc = '|') {
  let res = '';
  res = entype.split(sc).map(exp => deletemulti(exp)).join(sc);
  return res;
}
/**
 * valid-msg types to array map
 * @param {string} entype
 * @param {string} sc split char
 * @returns {string[]}
 * @sample
 * ```
 * toArray("feat|fix") // [["feat","feat"],["fix","fix"]]
 * ```
 */


function toArray(entype, sc = '|') {
  return validType(entype, sc).split(sc).map(exp => [exp, exp]);
}
/**
 * valid-msg types to json map
 * @param {string} entype
 * @param {string} sc split char
 * @returns {{[string]:string}}
 */


function toJson(entype, sc = '|') {
  const json = {};
  validType(entype, sc).split(sc).forEach(exp => {
    json[exp] = exp;
  });
  return json;
}
/**
 * link valid-msg type between en and other language
 * @param {string|string[]} en
 * @param {string|string[]} otherlang
 * @param {boolean} valid get valid-msg types before link
 * @param {string} sc split char
 * @returns {[string,string][]} [['en','zh']]
 */


function linkMap(en, otherlang, valid, sc = '|') {
  let kw;
  let val;

  switch (valid) {
    case true:
      kw = validType(en).split(sc);
      val = validType(otherlang).split(sc);
      break;

    default:
      kw = en;
      val = otherlang;
      break;
  }

  return kw.map((exp, index) => [exp, val[index]]);
}
/**
 * split multi-line text to array
 * @param {string} s
 * @returns {string[]}
 */


function multiLineTextToArray(s) {
  return s.split(/\r?\n/);
}
/**
 * parse two language in multi-line-text to array map
 * @param {string} s
 * @param {string} sc split char
 * @returns {[string[],string[]]}
 * @sample
 * ```
 * let s=`
 * feat|fix
 * xx|fixx
 * a|b
 * xa|xb
 * `
 * parseMap(s) //
 * ```
 */


function parseMap(s, sc = '|') {
  // trim text , ignore js line comment
  const list = multiLineTextToArray(s.trim()).filter(line => !/^\/\//.test(line));
  const resEn = [];
  const resOt = [];

  for (let index = 0; index < list.length; index += 2) {
    const en = list[index];
    const ot = list[index + 1];
    resEn.push(...en.split(sc));
    resOt.push(...ot.split(sc));
  }

  return [resEn, resOt]; // {{en:string,ot:string}}
  // return {
  //   en: res_en,
  //   ot: res_ot,
  // };
}

exports.linkMap = linkMap;
exports.parseMap = parseMap;
exports.toArray = toArray;
exports.toJson = toJson;
exports.validType = validType;
