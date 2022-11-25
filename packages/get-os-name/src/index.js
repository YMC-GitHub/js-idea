import { toObjectSet, getKWByVal } from './helps'
/**
 * get os name through process.platform
 * @param {string} customNames
 * @returns {string}
 * @sample
 * ```
 * getOsName()
 * getOsName("mac=darwin;win=win32;linux=linux;android=android")//win, mac ,linux or android
 * ```
 * @description
 * ```
 * ## why use?
 * - [x] get os name
 * - [x] custom os names map for returns
 * ```
 */
function getOsName(customNames) {
    const osName = process.platform
    const nameMap = customNames || 'mac=darwin;win=win32;linux=linux;android=android'
    const osMap = toObjectSet(nameMap)
    return getKWByVal(osMap, osName, true)
}

export default getOsName
