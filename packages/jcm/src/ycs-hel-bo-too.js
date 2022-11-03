/* eslint-disable prefer-destructuring,prefer-const */
export const { log } = console

/**
 * get option name
 * @param {sting} s
 * @param {sting} t
 * @returns {string}
 * @sample
 * ```
 * getOptName('-h,--help','l') //help
 * getOptName('-h,--help','s') //h
 * getOptName('-h,--help') //help
 * getOptName('-h') //h
 * ```
 */
export const getOptName = (s = '', t = 'l') => {
  // idea: get l or loc as name
  // get -l,--loc
  // get l or loc
  let keys = ''
  keys = s
    .split(' ')[0]
    .split(',')
    .map(v => v.replace(/^-*/gi, ''))

  switch (t.toLowerCase()) {
    case 's':
    case 'short':
      ;[keys] = keys
      break
    case 'l':
    case 'long':
    default:
      // feat: if not l , use s
      if (!keys[1]) {
        keys = keys[0]
      } else {
        keys = keys[1]
      }
      break
  }
  return keys
}

/**
 *
 * @param {[]|{}} map
 * @param {string} ns
 * @param {{}|[]} def
 * @returns {{}|[]}
 * @sample
 * ```
 *
 * ```
 */
export const getMapPathValue = (map, ns, def = {}) => {
  let res
  res = map[ns] ? map[ns] : def
  return res
}

/**
 *
 * @param {{}} optionMap
 * @param {string} ns
 * @param {string} cmd
 * @returns
 * @sample
 * ```
 * getMap({},'jcm','add')
 * getMap({},'jcm','get')
 * getMap({},'ini')
 * ```
 */
export const getMap = (optionMap, ns = '', cmd = '') => {
  let map = optionMap
  if (ns && cmd) {
    map = getMapPathValue(map, ns)
    map = getMapPathValue(map, cmd)
    // optionMap[ns]=optionMap[ns]?optionMap[ns]:{}
    // optionMap=[ns]
    // optionMap[cmd]=optionMap[cmd]?optionMap[cmd]:{}
    // optionMap=[cmd]
  } else if (ns) {
    map = getMapPathValue(map, ns)
  } else if (cmd) {
    map = getMapPathValue(map, cmd)
  }
  return map
}
/**
 *
 * @param {string[]} opts
 * @param {string} s
 * @param {number} num
 * @returns {string}
 * @sample
 * ```
 * getFormatOptStr(['aaa'],'0',2)// 00aaa
 * getFormatOptStr(['aaa'],'-',2)// --aaa
 * ```
 */
export const getFormatOptStr = (opts, s = '', num = 2) => {
  const res = Array.isArray(opts) ? opts : [opts]
  return res.join('\n').replace(/^/gim, Array(num).fill(s).join(''))
}
