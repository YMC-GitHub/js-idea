import * as too from './index-too.js'
import { isRegExp, isArray, isFunction, isString, registerFnToOption, getMixFunFromOption } from './index-sha.js'
import * as cfm from './custom-fun.js'

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
  let [regexp, opt] = parseOption(option)
  //fix: only parse option once\nwith option.parsed=true

  // too.log(regexp, opt)
  //fix(core): fix do nothing\nwith opt to !opt
  if (!regexp || !opt) return
  let buitlinopt = { mode: 'file' }
  opt = { ...buitlinopt, ...opt }
  // too.log(regexp, opt)
  //too:basename,isDiretory,readdirSync,isFile,readFileSync
  //cc is short for commom cache
  let cc = {}
  //

  //feat: register cumtom fun mix\nset opt.registered=true for once
  // if (!opt.registered) {
  //   opt = registerFnToOption(opt, cfm, 'isFileMode,isFileTextMode,output')
  //   opt.registered = true
  // }
  //feat: get cumtom fun mix from option\nto migrate easily\nplease use cfm.xx to call fun
  // getMixFunFromOption(opt, cfm, 'isFileMode,isFileTextMode,output')

  // let stat = stat(dst)
  if (!too.isDiretory(dst) && !(cfm.isFileMode(opt.mode) || cfm.isFileTextMode(opt.mode))) {
    return
  }

  const name = too.basename(dst)
  //feat: set excludes to be optional\nwith option.excludes=[]
  if (isArray(opt.excludes) && opt.excludes.includes(name)) {
    return
  }
  //feat: support excludes regexp\nwith option.excludesRegexp=
  if (opt.excludesRegexp && opt.excludesRegexp.test(name)) {
    return
  }

  //solution - a
  //feat: find dst with regexp in file name and path\nwith option.mode != 'file_text'
  if (regexp.test(name) && !cfm.isFileTextMode(opt.mode)) {
    //feat: output dst to console
    cfm.output(dst)
    return
  }

  //solution - b
  //feat: find dst with regexp in file text\nwith option.mode == 'file_text'\nwith option.fileTextRegexp
  if (cfm.isFileTextMode(opt.mode) && too.isFile(dst)) {
    const text = too.readFileSync(dst)
    if (opt.fileTextRegexp && opt.fileTextRegexp.test(text)) {
      cfm.output(dst)
      return
    }
  }

  if (!too.isDiretory(dst)) {
    return
  }
  //feat:read diretory recursive
  const files = too.readdirSync(dst)
  if (files.length > 0) {
    files.forEach(file => {
      const fullPath = too.joinPath(dst, file)
      getDstDir(fullPath, opt)
      // getDstDir(fullPath, regexp)
    })
  }
}

function parseOption(option) {
  let regexp, opt
  if (option) {
    if (isRegExp(option)) {
      //eg:getDstDir('../',/sha.js$/ig)
      regexp = option
      opt = { parsed: true, regexp }
      // option.parsed = true
      too.log(option, regexp, isRegExp(option))
    } else if (isRegExp(option.regexp)) {
      //eg:getDstDir('../',{regexp:/sha.js$/ig})
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

//custom-api:
//api-base:isFileMode,isFileTextMode,output
//cfm is short for cumtom fun mix

//idea: extract custom fun to custom-fun.js
//idea: extract node(fs,path) tool to too.js or fs-extra or xx-too.node.js

export { getDstDir }
// run scr:
// node get-dst-dir.js
// node packages/read-diretory/src/index-fun.js
