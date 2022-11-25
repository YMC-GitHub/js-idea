import { formatText, beautyText } from './helps'
/**
 *
 * @param {{name:string,type:string,desc:string,value:string}[]} param
 * @param {string} head
 * @return {string}
 * @sample
 * ```
 * main([{name:'help',type:'boolean',value:false,desc:'info help'}])
 * ```
 */
function main(param, head = '') {
    let res = []
    res = param.map(iten => {
        const { name, value, desc } = iten
        return `${name} ${desc} (default:${value})`
    })
    res = res.join('\n')
    res = `${head}\noption:\n${res}`
    res = res.trim()
    res = beautyText(res)
    res = formatText(res, ' ', 2)
    return res
}

export default main
