import { Ujc, Gsc, readConf } from './jcm-sha.js'
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
    let { option, tool } = this
    let filename = name ? name : option.name
    let flags = option
    if (flags.usd || flags.u) {
      return tool.joinPath(tool.getUserHome(), filename)
    }
    if (flags.crd || flags.c) {
      return filename
    }
    if (flags.wkd /*|| flags.w*/) {
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
    let { option } = this
    let list = [['usd', 'u'], ['crd', 'c'], ['wkd']]
    loclist = list
      .map(keys => {
        let flag = keys.some(key => option[key])
        if (flag) {
          return this.getFileLoc(name)
        }
        return false
      })
      .filter(v => v)
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
    let { tool } = this
    let loclist = this.getFileLocList(name)
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
    let { option, tool } = this
    let { name } = option
    let data = {}
    switch (cmd) {
      case 'add':
        //add
        data = this.magicReadConfig(name)
        data = this.magicDefineConfig(data)
        tool.addDirs(option.wkd)
        let loc = tool.joinPath(wkd, name)
        tool.saveJson(loc, data)
        break
      case 'del':
        //del
        // todo:it.deleteConfFile(flags)
        break
      case 'get':
      default:
        data = magicReadConfig(name)
        break
    }
    return data
  }
}
const jcm = new Jcm()
export { Jcm, jcm }
