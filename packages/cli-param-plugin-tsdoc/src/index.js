import { camelize } from '@ymc/extend-string'
import { getParamName, formatText } from './helps'
/**
 * param json to ts interface
 * @param {{name:string,type:string,desc:string,value:string}[]} param
 * @param {string} head
 * @param {{indentSize:number}} options
 * @return {string}
 * @sample
 * ```
 * main([{name:'help',type:'boolean',value:false,desc:'info help'}])
 * ```
 */
function main(param, head = 'baseOptions', options = {}) {
  let res = []
  const option = {
    indentSize: 2,
    ...options
  }
  res = param.map(item => {
    const { name, type } = item
    const mname = camelize(getParamName(name))
    if (item.optional) {
      return `${mname}?:${type};`
    }
    return `${mname}:${type};`
  })
  res = res.join('\n')
  res = formatText(res, ' ', option.indentSize)
  res = `interface ${head} {\n${res}\n}`
  return res
}
export default main
