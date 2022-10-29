// idea: usage to option
// uo is short for usage-to-option
// get subns
// get subcmd

/**
 * get subns or subcmd from usage text
 * @param {string} s subns or subcmd label
 * @param {string} usage usage text
 * @returns {string}
 * @sample
 * ```
 * getTxtFromUsage("subcmd", usage)
 * getTxtFromUsage("subns", usage)
 * ```
 */
const getTxtFromUsage = (s, usage = '') => {
  const regexp = new RegExp(` *${s}:.*`, 'ig')
  const match = usage.match(regexp)
  if (match) {
    return match[0].replace(new RegExp(` *${s}:`, 'i'), '')
  }
  return ''
}

/**
 *
 * @param {string} ns
 * @param {string} version
 * @param {string} usage
 * @returns {{version:string,ns:string,autoSubCmd:string,autoSubNs:string}}
 * @description
 * ```
 * - [x] define ns
 * - [x] define version
 * - [x] gen auto subcmd with usage text
 * - [x] gen auto subns with usage text
 * ```
 */
const genOptionFromUsage = (ns = 'npm-bin', version = '1.0.0', usage = '') => {
  let option = {}
  option = {
    ...option,
    ...{
      version,
      ns,
      autoSubCmd: getTxtFromUsage('subcmd', usage),
      autoSubNs: getTxtFromUsage('subns', usage)
    }
  }
  return option
}
// export {getTxtFromUsage,genOptionFromUsage}
export default genOptionFromUsage
