/**
  * cliParamPluginJsdoc v1.0.0
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
  let res = [];
  res = param.map(item => {
    // @property {string?} version - cli version
    const {
      name,
      type,
      desc,
      value
    } = item;
    const mname = camelize(getParamName(name));

    if (item.optional) {
      if (type === 'string' && value) {
        return ` * @property {${type}} [${mname}="${value}"] - ${desc}`;
      }

      if (type === 'number' && value) {
        return ` * @property {${type}} [${mname}=${value}] - ${desc}`;
      }

      return ` * @property {${type}} [${mname}] - ${desc}`;
    }

    return ` * @property {${type}} ${mname} - ${desc}`;
  });
  res = res.join('\n');
  res = `/**\n * @typedef {object} ${tname}\n${res}\n */`;
  return res;
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
    return long(tname, param);
  }

  let res = [];
  res = param.map(iten => {
    const {
      name,
      type
    } = iten;
    const mname = camelize(getParamName(name));
    return `${mname}:${type}`;
  });
  res = res.join(',');
  res = `/** @typedef {${res}} ${tname}*/`;
  return res;
}

module.exports = main;
