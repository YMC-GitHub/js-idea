import { isString, isObject, validString } from './helps'
/**
 * has value but not false then true
 * @param {string} s
 * @returns {boolean}
 * @sample
 * ```
 * truthly(option.noOnce) //option={} -> true
 * truthly(option.noOnce) //option={noOnce} -> true
 * //todo
 * enable(option.once) //--once=true --no-once ////if undefiend , isEmpty , or s!=false then true
 * //if undefiend , isEmpty , or s!=false then true
 * ```
 * @description
 * ```
 * when true?
 * s!=false
 * - and has value
 * - has value ?
 * - warn: here turn-on undefined and empty
 * ```
 */
function truthly(s) {
  return s !== false
  // return !isDefine(s) || isEmpty(s) || s; eq ? s!=false
}

/**
 * @description
 * ```
 * why use?
 * - [x] name alias
 * - [x] optional dup
 * ```
 */
class NameAlias {
  constructor() {
    this.aliasMap = {}
    this.option = {}
  }

  /**
   *
   * @param {string} name
   * @returns {aliasMapItem}
   */
  getAlias(name) {
    return this.aliasMap[name]
  }

  /**
   * check alias in aliasMap
   * @param {string} alias
   * @returns {boolean}
   */
  hasAlias(alias) {
    const { aliasMap } = this
    // console.log(aliasMap);
    const list = Object.keys(aliasMap)

    let res = false
    if (list.length === 0) {
      res = false
    } else {
      res = list.some(name => {
        const db = aliasMap[name]
        return db.includes(alias)
      })
    }
    return res
  }

  /**
   *
   * @param {string} name
   * @returns {this}
   */
  iniAlias(name) {
    const { aliasMap } = this
    if (!aliasMap[name]) {
      aliasMap[name] = []
    }
    return this
  }

  /**
   *
   * @param {string} name
   * @param {string|string[]|{[string]:string}} alias
   * @returns {this}
   */
  addAlias(name, alias) {
    const chain = this
    const { option, aliasMap } = this
    if (!validString(name)) return chain

    if (Array.isArray(alias)) {
      alias.forEach(item => {
        this.addAlias(name, item)
      })
    } else if (isString(alias)) {
      if (validString(alias)) {
        // if (truthly(option.once) && !this.hasAlias(alias)) {
        //   //dup
        //   this.iniAlias(name);
        //   aliasMap[name].push(alias);
        // } else {
        //   //not-dup
        //   this.iniAlias(name);
        //   aliasMap[name].push(alias);
        // }
        if (!(truthly(option.once) && this.hasAlias(alias))) {
          this.iniAlias(name)
          aliasMap[name].push(alias)
        }
      }
    } else if (isObject(alias)) {
      Object.keys(alias).forEach(item => {
        this.addAlias(name, item)
      })
    }
    return chain
  }

  /**
   * get name by alias
   * @param {string} alias
   * @returns {string}
   */
  getName(alias) {
    const { aliasMap } = this // [{name:[alias1,alias2]}]
    const res = []
    const list = Object.keys(aliasMap)
    // order-diff when foreach,map,filter ...
    // list.forEach((name) => {
    //   let db = aliasMap[name];
    //   if (db.includes(alias)) {
    //     res.push(name);
    //   }
    // });
    // alias in list
    if (this.hasAlias(alias)) {
      for (let index = 0; index < list.length; index += 1) {
        const name = list[index]
        const db = aliasMap[name]
        if (db.includes(alias)) {
          res.push(name)
        }
      }
    } else {
      res[0] = alias
    }
    return res[0]
  }
}
export default NameAlias
