/**
  * readDiretory v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs'), require('path')) :
  typeof define === 'function' && define.amd ? define(['exports', 'fs', 'path'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["read-diretory"] = {}, global.fs, global.path));
})(this, (function (exports, fs, path) { 'use strict';

  const {
    log
  } = console; //touch packages/read-diretory/{api,too}.js

  const isDiretory = folder => fs.statSync(folder).isDirectory();

  const isFile = folder => fs.statSync(folder).isFile();

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

    if (!s) {
      return false;
    }

    let type = typeof s;
    let falseList = ['boolean', 'string', 'number', 'function'];
    if (falseList.some(v => v == type)) return false;

    if (type == 'object' && s.test) {
      //'test' in s
      return true;
    } // log(s, typeof s, 'test' in s)
    // return typeof s


    return false;
  }

  function isArray(s) {
    return Array.isArray(s);
  } //feat: custom fn in option

  //api-base:isFileMode,isFileTextMode,output
  function isFileMode(s) {
    return s == 'file';
  }

  function isFileTextMode(s) {
    return s == 'file_text';
  }

  function output(s) {
    //feat: output dst to console
    // too.log(too.blue(`found in:${s}`))
    console.log(`found in:${s}`);
  }

  /** @typedef {{regexp:regexp,mode?:string|null,excludes?:string[],excludesRegexp?:regexp,fileTextRegexp?:regexp}} option*/

  /**
   * get dst in dir with regexp
   * @param {string} dst
   * @param {regexp|option} option
   * @returns {undefined|null}
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
    let [regexp, opt] = parseOption(option); //fix: only parse option once\nwith option.parsed=true
    // too.log(regexp, opt)
    //fix(core): fix do nothing\nwith opt to !opt

    if (!regexp || !opt) return;
    let buitlinopt = {
      mode: 'file'
    };
    opt = { ...buitlinopt,
      ...opt
    }; // too.log(regexp, opt)
    //feat: register cumtom fun mix\nset opt.registered=true for once
    // if (!opt.registered) {
    //   opt = registerFnToOption(opt, cfm, 'isFileMode,isFileTextMode,output')
    //   opt.registered = true
    // }
    //feat: get cumtom fun mix from option\nto migrate easily\nplease use cfm.xx to call fun
    // getMixFunFromOption(opt, cfm, 'isFileMode,isFileTextMode,output')
    // let stat = stat(dst)

    if (!isDiretory(dst) && !(isFileMode(opt.mode) || isFileTextMode(opt.mode))) {
      return;
    }

    const name = path.basename(dst); //feat: set excludes to be optional\nwith option.excludes=[]

    if (isArray(opt.excludes) && opt.excludes.includes(name)) {
      return;
    } //feat: support excludes regexp\nwith option.excludesRegexp=


    if (opt.excludesRegexp && opt.excludesRegexp.test(name)) {
      return;
    } //solution - a
    //feat: find dst with regexp in file name and path\nwith option.mode != 'file_text'


    if (regexp.test(name) && !isFileTextMode(opt.mode)) {
      //feat: output dst to console
      output(dst);
      return;
    } //solution - b
    //feat: find dst with regexp in file text\nwith option.mode == 'file_text'\nwith option.fileTextRegexp


    if (isFileTextMode(opt.mode) && isFile(dst)) {
      const text = fs.readFileSync(dst);

      if (opt.fileTextRegexp && opt.fileTextRegexp.test(text)) {
        output(dst);
        return;
      }
    }

    if (!isDiretory(dst)) {
      return;
    } //feat:read diretory recursive


    const files = fs.readdirSync(dst);

    if (files.length > 0) {
      files.forEach(file => {
        const fullPath = path.join(dst, file);
        getDstDir(fullPath, opt); // getDstDir(fullPath, regexp)
      });
    }
  }

  function parseOption(option) {
    let regexp, opt;

    if (option) {
      if (isRegExp(option)) {
        //eg:getDstDir('../',/sha.js$/ig)
        regexp = option;
        opt = {
          parsed: true,
          regexp
        }; // option.parsed = true

        log(option, regexp, isRegExp(option));
      } else if (isRegExp(option.regexp)) {
        //eg:getDstDir('../',{regexp:/sha.js$/ig})
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
  } //custom-api:
  // node get-dst-dir.js
  // node packages/read-diretory/src/index-fun.js

  exports.getDstDir = getDstDir;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
