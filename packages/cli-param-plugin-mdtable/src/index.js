/* eslint-disable prefer-const */
import { camelize } from '@ymc/extend-string'
import { getParamName, getAlignByKeys, getBodyByKeys, getTable } from './helps'
/**
 * param json to markdown table
 * @param {{name:string,type:string,desc:string,value:string}[]} param
 * @param {string} title
 * @param {{keys:string,align:string,slimName:boolean,camelizeName:boolean}} options
 * @return {string}
 * @sample
 * ```
 * main([{name:'help',type:'boolean',value:false,desc:'info help'}])
 * ```
 */
function main(param, title = '## param', options = {}) {
    let res = []
    const option = {
        keys: 'name,type,value,desc,optional',
        align: ':--',
        slimName: true,
        camelizeName: true,
        ...options
    }

    res = param.map(item => {
        let { name, type, value, desc, optional } = item
        let mname = option.slimName ? getParamName(name) : name
        mname = option.camelizeName ? camelize(mname) : mname
        if (!optional) {
            optional = ''
        }
        return {
            name: mname,
            type,
            value,
            desc,
            optional
        }
    })

    let keys
    let head
    let thAlign
    let body
    keys = option.keys.split(',').map(v => v.trim())
    // get head by keys
    head = keys.join('|')
    // get th-align by keys
    thAlign = getAlignByKeys(option.align, keys)
    // get body by keys
    body = getBodyByKeys(res, keys)
    res = getTable({
        title,
        head,
        thAlign,
        body
    })
    return res
}
export default main
