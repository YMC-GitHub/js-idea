'use strict';

var node_fs = require('node:fs');
var node_path = require('node:path');

/* eslint-disable no-unused-vars */

const {
  log
} = console; // touch packages/read-diretory/{api,too}.js

const isDiretory = folder => node_fs.statSync(folder).isDirectory();

const isFile = folder => node_fs.statSync(folder).isFile();

/* eslint-disable  no-unused-vars */

/**
 *
 * @param {*} s
 * @returns
 * @description
 * ```
 * warn: not sale!please only use it in gst
 * ```
 * @sample
 * ```
 * isRegExp(/./gi)
 * isRegExp(new RegExp('{hi}'))
 * isRegExp('')
 * isRegExp(1)
 * isRegExp(null)
 * ```
 */
function isRegExp(s) {
  // undefined,null
  if (!s) {
    return false;
  }

  const type = typeof s;
  const falseList = ['boolean', 'string', 'number', 'function'];
  if (falseList.some(v => v === type)) return false;

  if (type === 'object' && s.test) {
    // 'test' in s
    return true;
  } // log(s, typeof s, 'test' in s)
  // return typeof s


  return false;
} // 'getType' is defined but never used                          no-unused-vars

function isArray(s) {
  return Array.isArray(s);
} // feat: custom fn in option

// api-base:isFileMode,isFileTextMode,output

/* eslint-disable no-console */
function isFileMode(s) {
  return s === 'file';
}

function isFileTextMode(s) {
  return s === 'file_text';
}

function output(s) {
  // feat: output dst to console
  // too.log(too.blue(`found in:${s}`))
  console.log(`found in:${s}`);
}

/* eslint-disable max-len,prefer-const,no-use-before-define,no-unused-expressions */
const cache = [];
/** @typedef {{regexp:regexp,mode?:string|null,excludes?:string[],excludesRegexp?:regexp,fileTextRegexp?:regexp,log?:boolean}} option */

/**
 * get dst in dir with regexp
 * @param {string} dst
 * @param {regexp|option} option
 * @returns {undefined|null|string[]}
 * @description
 * ```
 * - [x] find dst with regexp in file text
 * - [x] find dst with regexp in file name and path
 * - [x] excludes some file and path
 * ```
 * @sample
 * ```
 * getDstDir('../',/sha.js$/ig)
 * getDstDir('../',{regexp:/sha.js$/ig})
 * let option = { excludes: [] }
 * option.excludes = ['dist', 'lib', 'libtpl-rollup-plugins', 'vagrant']
 * getDstDir('../',option)
 * ```
 */

function getDstDir(dst, option) {
  // feat: ini function option
  let [regexp, opt] = parseOption(option); // fix: only parse option once\nwith option.parsed=true
  // too.log(regexp, opt)
  // fix(core): fix do nothing\nwith opt to !opt

  if (!regexp || !opt) return cache; // feat(core): set built-in option mode\nset option.mode='file' as default

  const buitlinopt = {
    mode: 'file'
  };
  opt = { ...buitlinopt,
    ...opt
  }; // too.log(regexp, opt)
  // too:basename,isDiretory,readdirSync,isFile,readFileSync
  // cc is short for commom cache
  // const cc = {}
  //
  // feat: register cumtom fun mix\nset opt.registered=true for once
  // if (!opt.registered) {
  //   opt = registerFnToOption(opt, cfm, 'isFileMode,isFileTextMode,output')
  //   opt.registered = true
  // }
  // feat: get cumtom fun mix from option\nto migrate easily\nplease use cfm.xx to call fun
  // getMixFunFromOption(opt, cfm, 'isFileMode,isFileTextMode,output')
  // let stat = stat(dst)

  if (!isDiretory(dst) && !(isFileMode(opt.mode) || isFileTextMode(opt.mode))) {
    return cache;
  }

  const name = node_path.basename(dst); // feat: set excludes to be optional\nwith option.excludes=[]

  if (isArray(opt.excludes) && opt.excludes.includes(name)) {
    return cache;
  } // feat: support excludes regexp\nwith option.excludesRegexp=


  if (opt.excludesRegexp && opt.excludesRegexp.test(name)) {
    return cache;
  } // solution - a
  // feat: find dst with regexp in file name and path\nwith option.mode != 'file_text'


  if (regexp.test(name) && !isFileTextMode(opt.mode)) {
    // Expected an assignment or function call and instead saw an expression  no-unused-expressions
    // feat: output dst to console
    opt.log && output(dst);
    cache.push(dst);
    return cache;
  } // solution - b
  // feat: find dst with regexp in file text\nwith option.mode == 'file_text'\nwith option.fileTextRegexp


  if (isFileTextMode(opt.mode) && isFile(dst)) {
    const text = node_fs.readFileSync(dst);

    if (opt.fileTextRegexp && opt.fileTextRegexp.test(text)) {
      opt.log && output(dst);
      cache.push(dst);
      return cache;
    }
  }

  if (!isDiretory(dst)) {
    return cache;
  } // feat:read diretory recursive


  const files = node_fs.readdirSync(dst);

  if (files.length > 0) {
    files.forEach(file => {
      const fullPath = node_path.join(dst, file);
      getDstDir(fullPath, opt); // getDstDir(fullPath, regexp)
    });
  }

  return cache;
}

function parseOption(option) {
  let regexp;
  let opt;

  if (option) {
    if (isRegExp(option)) {
      // eg:getDstDir('../',/sha.js$/ig)
      regexp = option;
      opt = {
        parsed: true,
        regexp
      }; // option.parsed = true

      log(option, regexp, isRegExp(option));
    } else if (isRegExp(option.regexp)) {
      // eg:getDstDir('../',{regexp:/sha.js$/ig})
      regexp = option.regexp;
      opt = option;
      opt.parsed = true;
    } else {
      return [];
    }
  } else {
    return [];
  }

  return [regexp, opt];
} // custom-api:
// node get-dst-dir.js
// node packages/read-diretory/src/index-fun.js

module.exports = getDstDir;
