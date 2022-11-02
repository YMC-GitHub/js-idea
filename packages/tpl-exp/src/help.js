/* eslint-disable prefer-const */
import './type'

// function oneOf(s, list) {
//     return list.some(v => v === s)
// }
// /**
//  * get special char regexp with special str
//  * @param {string} s
//  * @param {string} o
//  * @returns {regexp}
//  * @sample
//  * ```
//  * specialCharsReg = getSpecialCharsReg('{}[]()', 'ig')
//  * ```
//  */
// const getSpecialCharsReg = (s, o = 'ig') => {
//     let list = s.split('')
//     list = list.map(v => {
//         if (oneOf(v, ['{', '}'])) {
//             return v
//         }
//         if (oneOf(v, `[]()`.split(''))) {
//             return `\\${v}`
//         }
//     })
//     list = list.map(v => `(${v})`).join('|')
//     list = new RegExp(`${list}`, o)
//     return list
// }

const specialCharsReg = /({|})|(\[|\])|(\(|\))/gi // ok
// specialCharsReg = getSpecialCharsReg('{}[]()', 'ig') //ok
/**
 * excape special char for tag open and close label
 * @param {string} s
 * @param {regexp} scr special chars regexp (scr)
 * @returns {string}
 * @description
 * ```
 * - [x] excape {}()[] char - add \ before of them
 * ```
 * @sample
 * ```
 *  customTagS = excapeSpecialChar("{{");
 *  customTagE = excapeSpecialChar("}}");
 * ```
 */
const excapeSpecialChar = (s, scr = specialCharsReg) => s.replace(scr, '\\$&')

// /**
//  * get tag regexp - tag (template expresssion)
//  * @param {string} name tag name
//  * @param {string} s tag open label
//  * @param {string} e tag clsoe label
//  * @param {string} o regexp option
//  * @returns {regexp}
//  */
// const getTagRegexp = (name, s, e, o = 'ig') => new RegExp(`${s}${name}${e}`, o)

// /**
//  * get tag regexp - tag (template expresssion)
//  * @param {string} name tag name
//  * @param {string} s tag open label
//  * @param {string} e tag clsoe label
//  * @param {string} o regexp option
//  * @returns {regexp}
//  */
/**
 * get tag regexp - tag (template expresssion)
 * @param {string} name
 * @param {tagOption} options
 * @returns {regexp}
 */
const getTagRegexp = (name, options = {}) => {
  const option = {
    regexpOption: 'ig',
    // excapeSpecialChars: true,
    // specialCharsReg: specialCharsReg,
    ...options
  }
  let { openLabel: s, closeLabel: e, regexpOption: o } = option
  if (option.excapeSpecialChars) {
    // let scr = option.specialCharsReg ? option.specialCharsReg : 'ig'
    s = excapeSpecialChar(s, option.specialCharsReg)
    e = excapeSpecialChar(e, option.specialCharsReg)
  }
  return new RegExp(`${s}${name}${e}`, o)
}

/**
 *
 * @param {string} name
 * @param {tagOption} options
 * @returns {regexp}
 */
const magicGetTagRegexp = (name, options = {}) => {
  const option = {
    excapeSpecialChars: true,
    specialCharsReg,
    ...options
  }
  return getTagRegexp(name, option)
}
/**
 * get tpl expression
 * @param {string} name
 * @param {string} s
 * @param {string} e
 * @returns {string}
 */
const getTplexp = (name, s = '{{', e = '}}') => `${s}${name}${e}`
export { excapeSpecialChar, getTagRegexp, magicGetTagRegexp, getTplexp }
