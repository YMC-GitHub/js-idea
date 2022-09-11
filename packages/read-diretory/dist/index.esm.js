/**
  * readDiretory v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import { statSync, readFileSync, readdirSync } from 'fs';
import { basename, join } from 'path';

// import { isRegExp } from 'util/types'
const { log } = console;
const isDiretory = folder => statSync(folder).isDirectory();
const isFile = folder => statSync(folder).isFile();

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
  //undefined,null
  if (!s) {
    return false
  }
  let type = typeof s;
  let falseList = ['boolean', 'string', 'number', 'function'];
  if (falseList.some(v => v == type)) return false
  if (type == 'object' && s.test) {
    //'test' in s
    return true
  }
  // log(s, typeof s, 'test' in s)
  // return typeof s
  return false
}
function isArray(s) {
  return Array.isArray(s)
}

//api-base:isFileMode,isFileTextMode,output
function isFileMode(s) {
  return s == 'file'
}
function isFileTextMode(s) {
  return s == 'file_text'
}
function output(s) {
  //feat: output dst to console
  // too.log(too.blue(`found in:${s}`))
  console.log(`found in:${s}`);
}

let cache = [];
/** @typedef {{regexp:regexp,mode?:string|null,excludes?:string[],excludesRegexp?:regexp,fileTextRegexp?:regexp,log?:boolean}} option*/
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
  //feat: ini function option
  let [regexp, opt] = parseOption(option);
  //fix: only parse option once\nwith option.parsed=true

  // too.log(regexp, opt)
  //fix(core): fix do nothing\nwith opt to !opt
  if (!regexp || !opt) return cache
  //feat(core): set built-in option mode\nset option.mode='file' as default
  let buitlinopt = { mode: 'file' };
  opt = { ...buitlinopt, ...opt };
  //

  //feat: register cumtom fun mix\nset opt.registered=true for once
  // if (!opt.registered) {
  //   opt = registerFnToOption(opt, cfm, 'isFileMode,isFileTextMode,output')
  //   opt.registered = true
  // }
  //feat: get cumtom fun mix from option\nto migrate easily\nplease use cfm.xx to call fun
  // getMixFunFromOption(opt, cfm, 'isFileMode,isFileTextMode,output')

  // let stat = stat(dst)
  if (!isDiretory(dst) && !(isFileMode(opt.mode) || isFileTextMode(opt.mode))) {
    return cache
  }

  const name = basename(dst);
  //feat: set excludes to be optional\nwith option.excludes=[]
  if (isArray(opt.excludes) && opt.excludes.includes(name)) {
    return cache
  }
  //feat: support excludes regexp\nwith option.excludesRegexp=
  if (opt.excludesRegexp && opt.excludesRegexp.test(name)) {
    return cache
  }

  //solution - a
  //feat: find dst with regexp in file name and path\nwith option.mode != 'file_text'
  if (regexp.test(name) && !isFileTextMode(opt.mode)) {
    //feat: output dst to console
    opt.log && output(dst);
    cache.push(dst);
    return cache
  }

  //solution - b
  //feat: find dst with regexp in file text\nwith option.mode == 'file_text'\nwith option.fileTextRegexp
  if (isFileTextMode(opt.mode) && isFile(dst)) {
    const text = readFileSync(dst);
    if (opt.fileTextRegexp && opt.fileTextRegexp.test(text)) {
      opt.log && output(dst);
      cache.push(dst);
      return cache
    }
  }

  if (!isDiretory(dst)) {
    return cache
  }
  //feat:read diretory recursive
  const files = readdirSync(dst);
  if (files.length > 0) {
    files.forEach(file => {
      const fullPath = join(dst, file);
      getDstDir(fullPath, opt);
      // getDstDir(fullPath, regexp)
    });
  }
  return cache
}

function parseOption(option) {
  let regexp, opt;
  if (option) {
    if (isRegExp(option)) {
      //eg:getDstDir('../',/sha.js$/ig)
      regexp = option;
      opt = { parsed: true, regexp };
      // option.parsed = true
      log(option, regexp, isRegExp(option));
    } else if (isRegExp(option.regexp)) {
      //eg:getDstDir('../',{regexp:/sha.js$/ig})
      regexp = option.regexp;
      opt = option;
      opt.parsed = true;
    } else {
      return []
    }
  } else {
    return []
  }
  return [regexp, opt]
}
// run scr:
// node get-dst-dir.js
// node packages/read-diretory/src/index-fun.js

export { getDstDir };
