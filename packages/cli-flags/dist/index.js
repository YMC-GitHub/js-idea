/**
  * cliFlags v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
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
  return s
    .replace(/(?:^\w|[A-Z_-]|\b\w)/g, (word, index) => {
      let res = '';
      // log(word, index); //desc: for debug
      // feat: replace multi - or _ to one space
      res = word.replace(/[-_]+/g, ' ');
      // feat: add space to the char that is uppercase and is not the first index
      res = index !== 0 ? res.replace(/[A-Z]/, ' $&') : res;
      // feat: the first char to upper ,other lowercase
      return index === 0 ? res.toUpperCase() : res.toLowerCase()
    })
    .replace(/\s+/g, ' ')
}

function camelize(s) {
  return humanize(s)
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
    .replace(/\s+/g, '')
}

function underscoped(s) {
  return humanize(s)
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toLowerCase())
    .replace(/\s+/g, '_')
}

/* eslint-disable no-param-reassign */

/** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} camelizeFlagsOption */
/** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} likeCamelizeFlagsOption */

/** @typedef {{style:string,styleHandle:()=>string}} stylizeOption */

/**
 * stylize param-json - nano-parser-flags
 * @param {object} flags
 * @param {likeCamelizeFlagsOption & stylizeOption} options
 * @returns
 */
function stylizeFlags(flags = {}, options = {}) {
  // let res = {}
  const option = {
    slim: true,
    style: 'camelize', // get more infomation on extend-string
    styleHandle: camelize,
    ...options
  };
  const stylize = option.styleHandle;
  if (option[camelize(`noAuto-${options.style}`)]) return flags
  // typeof ''[options.style]==="function"
  Object.keys(flags).forEach(str => {
    const ck = stylize(str);
    // res[ck]=flags[k]
    if (ck !== str) {
      flags[ck] = flags[str];
      if (option.slim) {
        delete flags[str];
      }
    }
  });
  return flags
}
/**
 * camelize param-json - nano-parser-flags
 * @param {object} flags
 * @param {camelizeFlagsOption} options
 * @returns
 */
function camelizeFlags(flags = {}, options = {}) {
  // let res = {}
  const option = {
    slim: true,
    ...options
  };
  if (option.noAutoCamelize) return flags
  Object.keys(flags).forEach(k => {
    const ck = camelize(k);
    // res[ck]=flags[k]
    if (ck !== k) {
      flags[ck] = flags[k];
      if (option.slim) {
        delete flags[k];
      }
    }
  });
  return flags
}
/**
 * underscoped param-json - nano-parser-flags
 * @param {object} flags
 * @param {likeCamelizeFlagsOption} options
 * @returns
 */
function underscopedFlags(flags = {}, options = {}) {
  return stylizeFlags(flags, { ...options, style: 'underscoped', styleHandle: underscoped })
}

export { camelizeFlags, stylizeFlags, underscopedFlags };
