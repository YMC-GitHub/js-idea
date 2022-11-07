import { camelize } from '@ymc/extend-string'
import { dirname, basename } from './mock'
/**
 * get lib name with working dir
 * @param {string} wkd
 * @param {{trim?:boolean,camelize?:boolean}} option
 * @returns
 */
function getLibNameFromPath(wkd, option = {}) {
  let res = basename(wkd)
  const opt = {
    trim: true,
    ...option
  }
  if (opt.trim) {
    res = res.trim()
  }
  if (opt.camelize) {
    res = camelize(res)
  }
  return res
}

/**
 * get lib dir with working dir
 * @param {string} wkd
 * @returns
 */
function getPackagesLocFromPath(wkd) {
  return dirname(wkd)
}
/**
 * parse pkg loc exp
 * @param {string} loc
 * @returns {string[]}
 */
function parse(loc) {
  return [dirname(loc), basename(loc)]
}

export { getLibNameFromPath, getPackagesLocFromPath, parse }
