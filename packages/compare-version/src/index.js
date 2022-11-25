// https://github.com/leohihimax/node-version-compare/blob/master/index.js
import { split, convertToNumber } from './helps'
/**
 * compare version - result -1 lt, 0 eq, 1 gt
 * @param {string|number} ve1
 * @param {string|number} ve2
 * @returns {number}
 * @sample
 * ```
 * compare('1.0.0-beta.2','1.0.0')//-1
 * compare('1.0.0','1.0.0')//0
 * compare('1.0.0','1.0.0-beta.2')//1
 * ```
 */
function compare(ve1, ve2) {
    // number to string
    const v1 = `${ve1}`
    const v2 = `${ve2}`

    // has - char
    const flag1 = v1.indexOf('-') > -1
    const flag2 = v2.indexOf('-') > -1

    //
    let arr1 = split(flag1, v1)
    let arr2 = split(flag2, v2)

    arr1 = convertToNumber(arr1)
    arr2 = convertToNumber(arr2)
    // get max len
    const len = Math.max(arr1.length, arr2.length)
    for (let i = 0; i < len; i += 1) {
        // 1.0.0 > 1.0.0-beta.2
        // case: with tail and the val of index x one undefined
        if (i === 3 && (arr1[i] === undefined || arr2[i] === undefined)) {
            if (arr1[i] === undefined && Number.isNaN(arr2[i])) {
                return 1
            }
            if (Number.isNaN(arr1[i]) && arr2[i] === undefined) {
                return -1
            }
        }

        // case: the val of index x one undefined
        if (arr1[i] === undefined) {
            return -1
        }
        if (arr2[i] === undefined) {
            return 1
        }

        // case: the val of index x both defined
        if (arr1[i] > arr2[i]) {
            return 1
        }
        if (arr1[i] < arr2[i]) {
            return -1
        }
    }
    return 0
}

export default compare
