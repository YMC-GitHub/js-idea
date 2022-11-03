/**
  * getLocInDifferentOs v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import getOsName from '@ymc/get-os-name';

/**
 *
 * @param {{win?:string,linux?:string,mac?:string,name?:string}} option
 * @returns {string}
 * @description
 * ```
 * - [x] custom os name map in option.name
 * - [x] custom loc in diferent os with option[osname]
 * ```
 * @sample
 * ```
 * getLocInDifferentOs({win,mac,linux,android})
 * ```
 */
function getLocInDifferentOs(option = {}) {
  const defaulOsName = 'mac=darwin;win=win32;linux=linux;android=android';
  return option[getOsName(option.name ? option.name : defaulOsName)]
}

export { getLocInDifferentOs as default };
