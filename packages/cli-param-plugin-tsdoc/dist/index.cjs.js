/**
  * cliParamPluginTsdoc v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

/**
  * extendString v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
/**
 *
 * @param {*} s
 * @returns {string}
 * @sample
 * ```
 * humanize('per_page')// Per page
 * humanize('per-page')// Per page
 * ```
 * @description
 * ```
 * ## idea
 * - [x] replace multi - or _ to one space
 * - [x] add space to the char that is uppercase and is not the first index
 * - [x] the first char to upper ,other lowercase
 * ```
 */


function humanize(s) {
  return s.replace(/(?:^\w|[A-Z_-]|\b\w)/g, (word, index) => {
    let res = ''; // log(word, index); //desc: for debug
    // feat: replace multi - or _ to one space

    res = word.replace(/[-_]+/g, ' '); // feat: add space to the char that is uppercase and is not the first index

    res = index !== 0 ? res.replace(/[A-Z]/, ' $&') : res; // feat: the first char to upper ,other lowercase

    return index === 0 ? res.toUpperCase() : res.toLowerCase();
  }).replace(/\s+/g, ' ');
}

function camelize(s) {
  return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
}

/**
 * format text - add some space as prefix of each line
 * @param {string|string[]} text
 * @param {string} prefix
 * @param {string} count
 * @returns {string}
 */
function formatText(text, prefix = '', count = 2) {
  const res = Array.isArray(text) ? text : [text];
  return res.join('\n').replace(/^/gim, Array(count).fill(prefix).join(''));
}
/**
 *  get param name - short or long - in name
 * @param {string} name
 * @returns {string}
 */


function getParamName(name) {
  const [s, l] = name.split(/,/).map(i => i.trim().replace(/^-*/gi, '')); // 'hasLong' is assigned a value but never used

  const thelong = s.length > 1 ? s : l; // thelong = camelize(thelong)

  return thelong;
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
    const {
      name,
      type
    } = item;
    const mname = camelize(getParamName(name));

    if (item.optional) {
      return `${mname}?:${type};`;
    }

    return `${mname}:${type};`;
  });
  res = res.join('\n');
  res = formatText(res, ' ', option.indentSize);
  res = `interface ${head} {\n${res}\n}`;
  return res;
}

module.exports = main;
