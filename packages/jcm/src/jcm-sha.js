// import { readJson, saveJson, getUserHome } from './jcm-too.js'

const { log } = console
/**
 * @description
 * ```
 * idea: use json conf
 * uc is short for using conf
 * ```
 */
class Ujc {
  constructor() {
    this.list = []
    this.index = -1
    this.freeze = false
  }
  /**
   * add config to config list by order
   * @param {{}} config
   * @param {numbber} order
   * @returns {this} why ? to chain
   */
  use(config = {}, order) {
    let { list, index } = this

    // feat: support index and order
    const useIndex = !order

    // feat: auto increase index
    if (useIndex || index == order) {
      index++
    } else if (index < order) {
      index = order
    }
    // warn: update index in this (when number,string,boolean)
    this.index = index

    index = useIndex ? index : order
    if (config) {
      list[index] = config
    }
    return this
  }
  /**
   *
   * @returns {{}}
   * @description
   * ```
   * - [x] get config by index in config list
   * - [x] simple merge config
   * - [x] freeze result optionally
   * ```
   */
  load() {
    const { list } = this
    let res = {}
    for (let index = 0; index < list.length; index++) {
      const config = list[index]
      if (config) {
        // res=Object.assign(res,config)
        res = { ...res, ...config }
      }
    }
    const { freeze } = this
    if (freeze) {
      return Object.freeze(res)
    }
    return res
    // return Object.freeze(Object.assign({}, config, dotenv, node_env, argv))
  }
}

/**
 * @description
 * ```
 * idea: get or set conf
 * gsc is short for get-set-conf
 * gsc.bind(data).split('.').conf(key,val)
 * ```
 */
class Gsc {
  constructor() {
    this.data = {}
    this.option = {
      splitChar: '.'
    }
  }
  /**
   * bind data to ctx.data
   * @param {*} data
   * @returns {this} why ? to chain
   *
   */
  bind(data) {
    if (data) {
      this.data = data
    }
    return this
  }
  /**
   * set split char
   * @param {string} s
   * @returns {this} why ? to chain
   */
  split(s = '.') {
    if (s) {
      this.option.splitChar = s
    }
    return this
  }
  /**
   * get or set value with key
   * @param {string} key
   * @param {*} val
   * @returns {val|this}
   * @description
   * ```
   * ```
   */
  conf(key = '', val) {
    if (!key) return this
    // note: extract com var
    let { data, option } = this
    let last

    // note: get name list
    key = key.split(option.splitChar)

    // note: get last name
    last = key[key.length - 1]

    // note: get prev data
    const { length } = key
    for (let index = 0; index < length - 1; index++) {
      const name = key[index]
      // note: ini data in key when not dedfining
      if (!data[name]) {
        data[name] = {}
      }
      data = data[name]
      // data=data[name]?data[name]:{}
    }
    // log(key,data)

    // feat: get val
    if (val == undefined) {
      return data[last]
    }
    // feat: set val
    data[last] = val
    log(`set ${last} ${val}`)
    // feat: support chain when setting
    return this
  }
}

/**
 * read conf in file list
 * @param {string[]} cnfLocList
 * @param {function(loc,def):json} readJson
 * @returns {json}
 * @description
 * ```
 * idea: read conf
 * a sam for rc
 * rc is short for reading conf
 * ``
 */
function readConf(cnfLocList = ['.ymcrc.json'], readJson) {
  // let name='.ymcrc.json'
  // let userLoc=joinPath(getUserHome(),name)
  const rc = new Ujc()
  // rc.use(readJson(userLoc))
  // rc.use(readJson(name))
  // rc.use(readJson(joinPath(wkd,name)))
  // data = rc.load()
  // let cnfLocList = [joinPath(getUserHome(),name),name,joinPath(wkd,name)]
  for (let index = 0; index < cnfLocList.length; index++) {
    const cnfLoc = cnfLocList[index]
    rc.use(readJson(cnfLoc))
  }
  return rc.load()
}
const ujc = new Ujc()
const gsc = new Gsc()
export { Ujc, ujc, Gsc, readConf }
