/**
  * tplExp v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* eslint-disable prefer-const */

const specialCharsReg = /({|})|(\[|\])|(\(|\))/gi; // ok
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

const excapeSpecialChar = (s, scr = specialCharsReg) => s.replace(scr, '\\$&');
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
  };
  let {
    openLabel: s,
    closeLabel: e,
    regexpOption: o
  } = option;

  if (option.excapeSpecialChars) {
    // let scr = option.specialCharsReg ? option.specialCharsReg : 'ig'
    s = excapeSpecialChar(s, option.specialCharsReg);
    e = excapeSpecialChar(e, option.specialCharsReg);
  }

  return new RegExp(`${s}${name}${e}`, o);
};
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
  };
  return getTagRegexp(name, option);
};
/**
 * get tpl expression
 * @param {string} name
 * @param {string} s
 * @param {string} e
 * @returns {string}
 */


const getTplexp = (name, s = '{{', e = '}}') => `${s}${name}${e}`;

/* eslint-disable  class-methods-use-this */
/**
 * @sample
 * ```
 * const tag = new Tag({openLabel,closeLabel})
 * //tag.option.openLabel="{"
 * //tag.option.closeLabel="}"
 * tag.customLabel("{","}")
 * tag.defTplExp("pkg")
 * tag.getTplReg("pkg")
 * ```
 */

class Tag {
  constructor(option) {
    this.init(option);
  }

  init(option = {}) {
    /** @type tagOption */
    this.option = {
      openLabel: '{{',
      closeLabel: '}}',
      ...option
    };
    return this;
  }
  /**
   * define template expression
   * @param {string} name
   * @returns {string}
   */


  defTplExp(name) {
    const {
      option
    } = this;
    const {
      openLabel,
      closeLabel
    } = option;
    return getTplexp(name, openLabel, closeLabel);
  }
  /**
   * get template expression regexp
   * @param {string} name
   * @returns {regexp}
   */


  getTplReg(name) {
    const {
      option
    } = this;
    const {
      openLabel,
      closeLabel,
      excapeSpecialChars,
      specialCharsReg
    } = option;
    return magicGetTagRegexp(name, {
      openLabel,
      closeLabel,
      excapeSpecialChars,
      specialCharsReg
    });
  }
  /**
   * custom tag label
   * @param {string} s
   * @param {string} e
   * @returns
   */


  customLabel(s, e) {
    const {
      option
    } = this;
    this.option = { ...option,
      openLabel: s,
      closeLabel: e
    };
    return this;
  }

  tag(...option) {
    return new Tag(...option);
  }

}

const tag = new Tag();

exports.Tag = Tag;
exports.tag = tag;
