/**
  * genPkgReadme v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

var node_fs = require('node:fs');

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

/* eslint-disable prefer-const */

const specialCharsReg = /({|})|(\[|\])|(\(|\))/gi; // ok
// specialCharsReg = getSpecialCharsReg('{}[]()', 'ig') //ok

/**
 * excape special char for tag open and close label
 * @param {string} s
 * @param {regexp} scr special chars regexp (scr)
 * @returns {string}
 * @description
 * ```
 * - [x] excape {}()[] char - add \ before of them
 * ```
 * @sample
 * ```
 *  customTagS = excapeSpecialChar("{{");
 *  customTagE = excapeSpecialChar("}}");
 * ```
 */

const excapeSpecialChar = (s, scr = specialCharsReg) => s.replace(scr, '\\$&');
/**
 * get tag regexp - tag (template expresssion)
 * @param {string} name
 * @param {tagOption} options
 * @returns {regexp}
 */


const getTagRegexp = (name, options = {}) => {
  const option = {
    regexpOption: 'ig',
    // excapeSpecialChars: true,
    // specialCharsReg: specialCharsReg,
    ...options
  };
  let {
    openLabel: s,
    closeLabel: e,
    regexpOption: o
  } = option;

  if (option.excapeSpecialChars) {
    // let scr = option.specialCharsReg ? option.specialCharsReg : 'ig'
    s = excapeSpecialChar(s, option.specialCharsReg);
    e = excapeSpecialChar(e, option.specialCharsReg);
  }

  return new RegExp(`${s}${name}${e}`, o);
};
/**
 *
 * @param {string} name
 * @param {tagOption} options
 * @returns {regexp}
 */


const magicGetTagRegexp = (name, options = {}) => {
  const option = {
    excapeSpecialChars: true,
    specialCharsReg,
    ...options
  };
  return getTagRegexp(name, option);
};

/* eslint-disable max-len,no-use-before-define, */

function isString(s) {
  return typeof s === 'string';
}

const {
  log
} = console; // @ymc/read-text-sync

/**
 * read text file sync
 * @param {string} loc
 * @param {string} def
 * @returns {string}
 */

function readTextSync(loc, def = '') {
  let text;

  try {
    text = node_fs.readFileSync(loc);
    text = text.toString();
  } catch (error) {
    text = def;
  }

  return text;
}
/**
 * write text file sync
 * @param {string} loc
 * @param {string} def
 */


function writeTextSync(loc, def = '') {
  try {
    node_fs.writeFileSync(loc, def);
  } catch (error) {
  }
} // @ymc/write-text-sync
// @ymc/read-json-sync

/**
 *
 * @param {string} loc
 * @param {{}} def
 * @returns
 */


function readJsonSync(loc, def = {}) {
  let data;

  try {
    data = node_fs.readFileSync(loc);
    data = JSON.parse(data);
  } catch (error) {
    data = def;
  }

  return data;
} // @ymc/load-tpl
// @ymc/get-tpl-loc
// @ymc/def-tpl-exp


const getTplLocByName = (name = 'readme', loc = '.') => `${loc}/${name}.tpl.md`;

const getTmpLocByName = (name = 'readme', loc = '.') => `${loc}/${name}.tmp.md`;
/**
 *
 * @param {string} name
 * @param {string} openLabel
 * @param {string} closeLabel
 * @returns {regexp}
 */


function getTplExpRegByName(name, openLabel = '{{', closeLabel = '}}') {
  return magicGetTagRegexp(name, {
    openLabel,
    closeLabel
  });
} // @ymc/readme-render-help,@ymc/define-readme-render

/**
 * define render handle by name and tpl
 * @param {string} name
 * @param {{tpl:string,joinMode:string}} options
 * @returns {(text:string,data:{})=>string}
 */


function defineRender(name, options = {}) {
  return (text = '', data = '') => {
    const opt = isString(options) ? {
      tpl: options
    } : options;
    const option = {
      tpl: '',
      joinMode: 'foot',
      ...opt
    };
    let res = text;
    const reg = getTplExpRegByName(name);
    const hasExpInTpl = reg.test(res);

    if (!hasExpInTpl) {
      // if (option.joinMode.toLowerCase() === 'head') {
      //     res = `${option.tpl}\n${res}\n`
      // } else {
      //     res = `${res}\n${option.tpl}`
      // }
      res = option.tpl;
    }

    res = res.replace(reg, data);
    return res;
  };
}

function renderLibSize(text = '', data = '') {
  let res = text;
  const name = 'LIB_SIZE_INFO';
  const reg = getTplExpRegByName(name);
  const hasTag = reg.test(res); // add exp to tpl

  if (!hasTag) {
    res = `
${res}
## Lib size  
{{LIB_SIZE_INFO}}
`.trim();
  } // render


  res = res.replace(reg, data);
  return res;
} // @ymc/readme-render-lib-name
// const renderLibName = (text = '', data = '') => {
//     // define tag , load tpl / define tpl , render tpl
//     const name = 'LIB_NAME'
//     const reg = getTplExpRegByName(name)
//     const hasTag = reg.test(text)
//     // defineTag
//     if (!hasTag) {
//         text = `
//         # Pkg {{${name}}}
//         ${text}
//         `.trim()
//     }
//     text = text.replace(reg, data)
//     return text
// }


function renderLibName(text, data) {
  const name = 'LIB_NAME';
  const tpl = ` # Pkg {{${name}}}\n${text}`;
  return defineRender('LIB_NAME', tpl)(text, data);
} // @ymc/readme-render-help
// @ymc/readme-render-other


const renderOther = (text, data) => {
  let res = text;
  let key;
  let cache;
  let defaultTpl; // render description with packagejson

  key = 'description';

  if (key in data && data[key]) {
    cache = data[key];
    defaultTpl = `
## Desc
{{PKG_DESC}}
`.trim();
    res = defineRender('PKG_DESC', defaultTpl)(res, cache);
  } // render liense with packagejson


  key = 'license';

  if (key in data && data[key]) {
    cache = data[key];
    defaultTpl = `
## License
{{LICENSE}}
`.trim();
    res = defineRender('LICENSE', defaultTpl)(res, cache);
  } // render author with packagejson


  key = 'author';

  if (key in data && data[key]) {
    cache = data[key];
    const {
      name
    } = cache;
    const {
      email
    } = cache;
    cache = email ? `${name} <${email}>` : `${name}`;
    defaultTpl = `
## Author
{{AUTHOR_LIST}}
`.trim();
    res = defineRender('AUTHOR_LIST', defaultTpl)(res, cache);
  }

  return res;
};

/* eslint-disable no-unused-vars,prefer-const */

function main(wkd) {
  log(`[info] wkd is: ${wkd}`);
  log('[task] gen pkg readme');
  log('[info] load pkg-json data');
  const packagejson = readJsonSync(`${wkd}/package.json`); // read tpl

  let loc;
  let tpl;
  let data;
  let res;
  log('[info] load readme tpl');
  loc = getTplLocByName('readme', wkd);
  log(`[info] loc: ${loc}`);
  tpl = readTextSync(loc); // load data and render

  log('[info] load lib-size data');
  loc = getTmpLocByName('lib-size', wkd);
  log(`[info] loc: ${loc}`);
  data = readTextSync(loc);
  res = renderLibSize(tpl, data); // res = renderLibName(res, libname)

  res = renderLibName(res, packagejson.name);
  res = renderOther(res, packagejson);
  log('[info] load pkgs state data');
  let pkgsstate = readJsonSync('pkgs-info.json');
  pkgsstate = pkgsstate.filter(v => v.name === packagejson.name) //   log(pkgsstate)
  ;
  [pkgsstate] = pkgsstate; // let keys='lin_state,tes_state'

  log('[info] load pkg-state tpl');
  loc = 'pkgs-state.tpl.tmp.md';
  log(`[info] loc: ${loc}`);
  tpl = readTextSync(loc);
  tpl = writeTpl(tpl, pkgsstate);
  res = `${tpl}\n${res}`;
  writeTextSync(`${wkd}/readme.md`, res);
}

module.exports = main;
