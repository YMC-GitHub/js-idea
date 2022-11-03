/* eslint-disable consistent-return */
/* eslint-disable no-unused-vars,prefer-destructuring */
/* eslint-disable class-methods-use-this */

import { Gsc, readConf } from './jcm-sha'

const { log } = console

// idea:
// get des dir
// log msg
// load pkg json
// update pkg json
class Jcm {
  constructor() {
    this.option = {}
    this.tool = {}
  }

  /**
   *
   * @param {string} name
   * @returns {string}
   */
  getFileLoc(name) {
    const { option, tool } = this
    const filename = name || option.name
    const flags = option
    if (flags.usd || flags.u) {
      // log(tool.getUserHome(), filename, option)
      return tool.joinPath(tool.getUserHome(), filename)
    }
    if (flags.crd || flags.c) {
      return filename
    }
    if (flags.wkd /* || flags.w */) {
      log(filename, option)
      return tool.joinPath(flags.wkd, filename)
    }
    return filename
  }

  /**
   *
   * @param {string} name
   * @returns {string[]}
   * @description
   * ```
   * user-path-> project-path -> des-path
   * ```
   */
  getFileLocList(name) {
    let loclist = []
    const { option } = this
    const list = [['usd', 'u'], ['crd', 'c'], ['wkd']]
    loclist = list
      .map(keys => {
        let ukey
        let uVal
        let flag
        for (let index = 0; index < keys.length; index += 1) {
          const key = keys[index]
          if (option[key]) {
            uVal = option[key]
            ukey = key
            flag = true
            break
          }
        }

        if (flag) {
          this.option = { [`${ukey}`]: uVal, name: option.name }
          return this.getFileLoc(name)
        }
        return false
      })
      .filter(v => v)
    this.option = option
    return loclist
  }

  /**
   * read config
   * @param {string} name
   * @returns {[]|{}}
   * @description
   * ```
   * user-path -> project-path -> des-path
   * read-conf -> read-json
   * ```
   */
  magicReadConfig(name = '.ymcrc.json') {
    const { tool } = this
    const loclist = this.getFileLocList(name)
    return readConf(loclist, tool.readJson)
  }

  /**
   * @param {{}} data
   * @param {string} key
   * @param {string} val
   * @returns {{}}
   * @description
   * ```
   * ## why use?
   * - [x] easy to write json config in node.js
   *
   * - [x] idea: bind-cache-data -> define-json-data
   * ```
   */
  magicDefineConfig(data, key, val) {
    const gsc = new Gsc()
    gsc.bind(data)
    // preset - 1. set spilt char different with key 2. use one level
    gsc.split('/')
    // gsc.conf('npm.user', 'hualei')
    gsc.conf(key, val)
    return gsc.data
  }

  /**
   * get val with key
   * @param {string} key
   * @param {string} val
   * @returns {string}
   * @sample
   * ```
   * getJsonVal(data,'key','val')
   * ```
   */
  getJsonVal(key = 'key', val = 'val') {
    const { data } = this
    let res
    // if (option[keyname]) {
    //   // case:get key eg. jcm get --key=username
    //   res = data[option[keyname]]
    //   log(res)
    //   return res
    // }
    if (key) {
      // case:get key eg. jcm get --key=username
      res = data[val]
      log(res)
      return res
    }
  }

  /**
   *
   * @param {string} key
   * @param {string} val
   */
  setJsonVal(key, val, hasval) {
    const { option, tool } = this
    const self = this
    const { name } = option
    let data
    data = self.magicReadConfig(name)
    // if (option[keyname] && valname in option) {
    //   // case:set key eg. jcm add --key=username --val=ymc
    //   data = self.magicDefineConfig(data, option[keyname], option[valname])
    // }
    if (key && hasval) {
      // case:set key eg. jcm add --key=username --val=ymc
      data = self.magicDefineConfig(data, key, val)
    }
    // tool.addDirs(option.wkd)
    // let loc = tool.joinPath(wkd, name)
    let loc
    // loc = self.getFileLoc(name)
    loc = self.getFileLocList(name)
    loc = loc[loc.length - 1]
    const locdir = tool.parsePath(loc).dir
    if (locdir) {
      tool.addDirs(locdir)
    }
    if (!option.dryrun) {
      tool.saveJson(loc, data)
    }
    this.data = data
  }

  /**
   *
   * @param {string} cmd
   * @returns {{}}
   * @description
   * ```
   * idea:genreate config to des dir
   * make dir
   * mgnt cnf
   * ```
   */
  comEntry(cmd) {
    const { option, tool } = this
    const self = this
    const { name } = option
    let data = {}
    let res
    const keyname = 'key'
    const valname = 'val'
    let key
    let val
    let hasval
    let cmdn = cmd
    if (cmd === 'cnf') {
      // eg.jcm cnf --org=ymc
      // eg.jcm cnf --org
      const arglist = Object.keys(option)
      const builtinlist = 'name|wkd|usd|crd|w|u|c'.split('|')
      key = arglist.filter(v => !builtinlist.includes(v))[0]
      val = option[key]
      hasval = key in option
      if (hasval) {
        cmdn = 'add'
      } else {
        cmdn = 'get'
      }
    } else {
      // eg.jcm add --key=org --val=ymc
      // eg.jcm get --key=org
      key = option[keyname]
      val = option[valname]
      hasval = valname in option
    }
    switch (cmdn) {
      case 'add':
        // add
        this.setJsonVal(key, val, hasval)
        break
      case 'del':
        // del
        // todo:it.deleteConfFile(flags)
        break
      case 'get':
      default:
        data = this.magicReadConfig(name)
        res = this.getJsonVal(key, val)
        // case:get key eg. jcm get
        log('[info] info data:')
        log(data)
        break
    }
    return data
    // key,val
    // jcm get --key=username
    // key=option[keyname]
    // val=option[valname]
  }
}
const jcm = new Jcm()
// jcm.tool = {
//   parsePath,
//   joinPath,
//   addDirs,
//   delDirs,
//   readJson,
//   saveJson,
//   getUserHome
// }
// const builtinFlags = { name: '.ymcrc.json', wkd: 'packages/noop', usd: true, crd: true }
// jcm.option = builtinFlags
// log(jcm.getFileLoc())
// log(jcm.getFileLocList())
// log(jcm.tool.parsePath(jcm.getFileLoc()))
export { Jcm, jcm }
