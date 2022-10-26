/* eslint-disable max-len,prefer-const,no-use-before-define,no-unused-expressions */
import * as too from './index-too'
import { isRegExp, isArray } from './index-sha'
import * as cfm from './custom-fun'

const cache = []
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
  let [regexp, opt] = parseOption(option)
  // fix: only parse option once\nwith option.parsed=true

  // too.log(regexp, opt)
  // fix(core): fix do nothing\nwith opt to !opt
  if (!regexp || !opt) return cache
  // feat(core): set built-in option mode\nset option.mode='file' as default
  const buitlinopt = { mode: 'file' }
  opt = { ...buitlinopt, ...opt }
  // too.log(regexp, opt)
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
  if (!too.isDiretory(dst) && !(cfm.isFileMode(opt.mode) || cfm.isFileTextMode(opt.mode))) {
    return cache
  }

  const name = too.basename(dst)
  // feat: set excludes to be optional\nwith option.excludes=[]
  if (isArray(opt.excludes) && opt.excludes.includes(name)) {
    return cache
  }
  // feat: support excludes regexp\nwith option.excludesRegexp=
  if (opt.excludesRegexp && opt.excludesRegexp.test(name)) {
    return cache
  }

  // solution - a
  // feat: find dst with regexp in file name and path\nwith option.mode != 'file_text'
  if (regexp.test(name) && !cfm.isFileTextMode(opt.mode)) {
    // Expected an assignment or function call and instead saw an expression  no-unused-expressions
    // feat: output dst to console
    opt.log && cfm.output(dst)
    cache.push(dst)
    return cache
  }

  // solution - b
  // feat: find dst with regexp in file text\nwith option.mode == 'file_text'\nwith option.fileTextRegexp
  if (cfm.isFileTextMode(opt.mode) && too.isFile(dst)) {
    const text = too.readFileSync(dst)
    if (opt.fileTextRegexp && opt.fileTextRegexp.test(text)) {
      opt.log && cfm.output(dst)
      cache.push(dst)
      return cache
    }
  }

  if (!too.isDiretory(dst)) {
    return cache
  }
  // feat:read diretory recursive
  const files = too.readdirSync(dst)
  if (files.length > 0) {
    files.forEach(file => {
      const fullPath = too.joinPath(dst, file)
      getDstDir(fullPath, opt)
      // getDstDir(fullPath, regexp)
    })
  }
  return cache
}

function parseOption(option) {
  let regexp
  let opt
  if (option) {
    if (isRegExp(option)) {
      // eg:getDstDir('../',/sha.js$/ig)
      regexp = option
      opt = { parsed: true, regexp }
      // option.parsed = true
      too.log(option, regexp, isRegExp(option))
    } else if (isRegExp(option.regexp)) {
      // eg:getDstDir('../',{regexp:/sha.js$/ig})
      regexp = option.regexp
      opt = option
      opt.parsed = true
    } else {
      return []
    }
  } else {
    return []
  }
  return [regexp, opt]
}

// custom-api:
// api-base:isFileMode,isFileTextMode,output
// cfm is short for cumtom fun mix

// idea: extract custom fun to custom-fun.js
// idea: extract node(fs,path) tool to too.js or fs-extra or xx-too.node.js
// Prefer default export
export default getDstDir
// run scr:
// node get-dst-dir.js
// node packages/read-diretory/src/index-fun.js
