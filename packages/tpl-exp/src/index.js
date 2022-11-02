/* eslint-disable  class-methods-use-this */
import { getTplexp, magicGetTagRegexp } from './help'
import './type'
// /**
//  * built in open label
//  */
// // const builtinTagS = excapeSpecialChar('{{')
// const builtinTagS = '{{'
// /**
//  * built in close label
//  */
// // const builtinTagE = excapeSpecialChar('}}')
// const builtinTagE = '}}'

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
    this.init(option)
  }

  init(option = {}) {
    /** @type tagOption */
    this.option = {
      openLabel: '{{',
      closeLabel: '}}',
      ...option
    }
    return this
  }

  /**
   * define template expression
   * @param {string} name
   * @returns {string}
   */
  defTplExp(name) {
    const { option } = this
    const { openLabel, closeLabel } = option
    return getTplexp(name, openLabel, closeLabel)
  }

  /**
   * get template expression regexp
   * @param {string} name
   * @returns {regexp}
   */
  getTplReg(name) {
    const { option } = this
    const { openLabel, closeLabel, excapeSpecialChars, specialCharsReg } = option
    return magicGetTagRegexp(name, {
      openLabel,
      closeLabel,
      excapeSpecialChars,
      specialCharsReg
    })
  }

  /**
   * custom tag label
   * @param {string} s
   * @param {string} e
   * @returns
   */
  customLabel(s, e) {
    const { option } = this
    this.option = { ...option, openLabel: s, closeLabel: e }
    return this
  }

  tag(...option) {
    return new Tag(...option)
  }
}
// it.getTplexp()
// it.getRegexp()
const tag = new Tag()
// export { builtinTagS,builtinTagE };
// export { excapeSpecialChar, defineTag, magicDefineTag };
// export { builtinTagS, builtinTagE, defineTag, magicDefineTag, getTplexp, tag };
// export { getTagRegexp as defineTag, magicDefineTag, getTplexp, Tag, tag }
export { Tag, tag }
