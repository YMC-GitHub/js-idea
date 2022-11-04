/**
  * cliParamPluginTsdoc v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import { camelize } from '@ymc/extend-string';

/**
 * format text - add some space as prefix of each line
 * @param {string|string[]} text
 * @param {string} prefix
 * @param {string} count
 * @returns {string}
 */
function formatText(text, prefix = '', count = 2) {
  const res = Array.isArray(text) ? text : [text];
  return res.join('\n').replace(/^/gim, Array(count).fill(prefix).join(''))
}
/**
 *  get param name - short or long - in name
 * @param {string} name
 * @returns {string}
 */
function getParamName(name) {
  const [s, l] = name.split(/,/).map(i => i.trim().replace(/^-*/gi, ''));
  // 'hasLong' is assigned a value but never used
  const thelong = s.length > 1 ? s : l;
  // thelong = camelize(thelong)
  return thelong
}

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
  let res = [];
  const option = {
    indentSize: 2,
    ...options
  };
  res = param.map(item => {
    const { name, type } = item;
    const mname = camelize(getParamName(name));
    if (item.optional) {
      return `${mname}?:${type};`
    }
    return `${mname}:${type};`
  });
  res = res.join('\n');
  res = formatText(res, ' ', option.indentSize);
  res = `interface ${head} {\n${res}\n}`;
  return res
}

export { main as default };
