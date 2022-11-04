import { camelize } from '@ymc/extend-string'

/**
 *  get param name - short or long - in name
 * @param {string} name
 * @returns {string}
 */
function getParamName(name) {
  const [s, l] = name.split(/,/).map(i => i.trim().replace(/^-*/gi, ''))
  // 'hasLong' is assigned a value but never used
  const thelong = s.length > 1 ? s : l
  // thelong = camelize(thelong)
  return thelong
}

/**
 * get jsdoc typedef - long
 * @param {string} tname
 * @param {{name:string,type:string,desc:string,value:string}[]} param
 * @return {string}
 * @sample
 * ```
 * main(`baseOption`,[{name:'help',type:'boolean',value:false,desc:'info help'}])
 * ```
 */
function long(tname, param) {
  let res = []
  res = param.map(item => {
    // @property {string?} version - cli version
    const { name, type, desc, value } = item
    const mname = camelize(getParamName(name))
    if (item.optional) {
      if (type === 'string' && value) {
        return ` * @property {${type}} [${mname}="${value}"] - ${desc}`
      }
      if (type === 'number' && value) {
        return ` * @property {${type}} [${mname}=${value}] - ${desc}`
      }
      return ` * @property {${type}} [${mname}] - ${desc}`
    }
    return ` * @property {${type}} ${mname} - ${desc}`
  })
  res = res.join('\n')
  res = `/**\n * @typedef {object} ${tname}\n${res}\n */`
  return res
}

/**
 * get jsdoc typedef - short or long
 * @param {string} tname
 * @param {{name:string,type:string,desc:string,value:string}[]} param
 * @param {{long:boolean}} option
 * @return {string}
 * @sample
 * ```
 * main(`baseOption`,[{name:'help',type:'boolean',value:false,desc:'info help'}])
 * ```
 */
function main(tname, param, options = {}) {
  if (options.long) {
    return long(tname, param)
  }
  let res = []
  res = param.map(iten => {
    const { name, type } = iten
    const mname = camelize(getParamName(name))
    return `${mname}:${type}`
  })
  res = res.join(',')
  res = `/** @typedef {${res}} ${tname}*/`
  return res
}

export default main
