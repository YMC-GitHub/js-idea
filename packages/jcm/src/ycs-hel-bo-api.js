import { log, getOptName, getMapPathValue, getMap, getFormatOptStr } from './ycs-hel-bo-too.js'

/**
 * @description
 * ```
 * ## why use?
 * - [x] easier,faster to write ycs-cli usage when you clify your lib to ycs-cli
 * - [x] write cli option in node.js
 * - [x] when many options is the same in subcmd or other cmd
 *
 * ## how ?
 * - [x] add or get option
 * - [x] bind option to ns or cmd
 * - [x] make usage text with option
 * ```
 * @sample
 * ```
 * //bo is short for bind-option
 * const bo = new BO();
 * //define option
 * bo.addOpt(`-l,--loc the des file location`);
 * bo.addOpt(`-h,--help get help`);
 * bo.addOpt(`-v,--version get version`);
 *
 * // feat:bind option to another subns,subcmd
 * bo.getOpt("loc").bindOpt("eslint", "add");
 *
 * // logMap()
 * // log(getMap(bo.optionMap))
 * // feat:option to usage
 * log(bo.usage());
 * // log(bo.usage('eslint','add'))
 * ```
 */
class BO {
  constructor() {
    this.optionMap = {}
    this.opt = ''
    this.relationMap = {}
    this.cmd = new Set()
    this.ns = new Set()
  }

  // get(name,ns='',cmd=''){
  //   this.opt=getOpt(name,ns,cmd)
  //   return this
  // }
  /**
   * add option
   * @param {string} s
   * @param {string} ns
   * @param {string} cmd
   * @returns {this}
   */
  addOpt(s = '', ns = '', cmd = '') {
    const { optionMap, relationMap } = this
    const name = getOptName(s)

    // log(`add option ${name}`)
    let map = optionMap
    map[name] = s

    // log(`add relation ${name}`)
    map = getMap(relationMap, ns, cmd)
    map[name] = true

    // log(`label ns and cmd`)
    this.cmd.add(cmd)
    this.ns.add(ns)
    return this
  }

  getOpt(name, ns = '', cmd = '') {
    const { optionMap, relationMap } = this
    const map = optionMap
    this.opt = map[name]
    // map = getMap(optionMap,ns,cmd)
    return this
  }

  logOpt() {
    log(this.opt)
    return this
  }

  /**
   * bind option to ns or cmd
   * @param {string} ns
   * @param {string} cmd
   * @returns
   */
  bindOpt(ns = '', cmd = '') {
    // log(`bind option to ns or cmd`)
    this.addOpt(this.opt, ns, cmd)
    return this
  }

  /**
   * to usage with cli option
   * @param {string} ns
   * @param {string} cmd
   * @returns
   */
  usage(ns = '', cmd = '') {
    const { optionMap, relationMap } = this
    let map
    // log(`get relation`)
    map = getMap(relationMap, ns, cmd)

    // log(`get option name`)

    let optNameList
    optNameList = Object.keys(map)
    // feat: filter cmd
    optNameList = optNameList.filter(name => !this.cmd.has(name))
    // feat: filter ns
    optNameList = optNameList.filter(name => !this.ns.has(name))
    // optNameList=optNameList.join(`\n`)

    // idea: option part
    let opts
    map = optionMap
    opts = Object.keys(map)
      .filter(name => optNameList.includes(name))
      .map(name => map[name])
    opts = getFormatOptStr(opts, ' ', 2)
    opts = `option:\n${opts}`
    // opts=getFormatOptStr(opts,' ',2)

    let subns = [...this.ns].filter(v => v.trim()).join('|')
    subns = subns ? `subns:${subns}` : ''

    // log([...this.cmd].filter(v=>v.trim()))
    let subcmd = [...this.cmd].filter(v => v.trim()).join('|')
    subcmd = subcmd ? `subcmd:${subcmd}` : ''

    let usage = 'usage:ns [option]'
    if (subns) {
      usage = usage.replace(/\[option\]$/, '[subns] [option]')
    }
    if (subcmd) {
      usage = usage.replace(/\[option\]$/, '[subcmd] [option]')
    }

    if (subcmd) {
      opts = `${subcmd}\n${opts}`
    }
    if (subns) {
      opts = `${subns}\n${opts}`
    }
    opts = getFormatOptStr(opts, ' ', 2)
    if (usage) {
      opts = `${usage}\n${opts}`
    }
    // opts=getFormatOptStr(opts,' ',2)
    return opts
  }
}

export default BO
// option.ns,option.cmd
