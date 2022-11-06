/**
  * cliParamPluginMdtable v1.0.0
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
 * gen table th align by keys
 * @param {string} align
 * @param {string[]} keys
 * @returns {string}
 */
function getAlignByKeys(align, keys) {
  return keys.map(() => align).join('|')
}

/**
 * gen table body by keys
 * @param {{[string]:unknown}[]} data
 * @param {string[]} keys
 * @returns {string}
 */
function getBodyByKeys(data, keys) {
  return data.map(v => keys.map(k => v[k]).join('|')).join('\n')
}
/**
 * get table
 * @param {{title:string, head:string, thAlign:string, body:string}} data
 * @returns
 */
function getTable(data) {
  const { title, head, thAlign, body } = data;
  let res;
  res = `${title}\n${head}\n${thAlign}\n${body}`;
  res = res.trim();
  res = `${res}\n\n`;
  return res
}

/* eslint-disable prefer-const */
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
  let res = [];
  const option = {
    keys: 'name,type,value,desc,optional',
    align: ':--',
    slimName: true,
    camelizeName: true,
    ...options
  };

  res = param.map(item => {
    let { name, type, value, desc, optional } = item;
    let mname = option.slimName ? getParamName(name) : name;
    mname = option.camelizeName ? camelize(mname) : mname;
    if (!optional) {
      optional = '';
    }
    return {
      name: mname,
      type,
      value,
      desc,
      optional
    }
  });

  let keys;
  let head;
  let thAlign;
  let body;
  keys = option.keys.split(',').map(v => v.trim());
  // get head by keys
  head = keys.join('|');
  // get th-align by keys
  thAlign = getAlignByKeys(option.align, keys);
  // get body by keys
  body = getBodyByKeys(res, keys);
  res = getTable({
    title,
    head,
    thAlign,
    body
  });
  return res
}

export { main as default };
