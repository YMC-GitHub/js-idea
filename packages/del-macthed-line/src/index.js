/* eslint-disable prefer-const */

import { getHashCode } from './helps'

// @ymc/del-macthed-line
/**
 * del macthed line
 * @param {{text:string,eof:string,deletedLabel:string,reg:regexp}} options
 * @returns {string}
 */
function delMatchedLine(options = {}) {
  const option = {
    text: '',
    eof: '\n',
    deletedLabel: '', // need to make it specail! eg. str-hash
    reg: /^#/,
    ...options
  }

  let { text, eof, reg, deletedLabel } = option
  // only work  one line
  // if (!Array.isArray(text)) {
  //     text = text.split(/\r?\n/)
  // }
  // text = text
  //     .map(line => {
  //         if (reg && reg.test(line)) {
  //             line = deletedLabel
  //         }
  //         return line
  //     })
  //     .filter(line => line != deletedLabel)

  // feat: set matched multi-line able
  // console.log(reg.test(text), reg)

  if (!deletedLabel) {
    deletedLabel = getHashCode(deletedLabel)
  }
  // log(`[info] replace match`)
  let res = text.replace(reg, deletedLabel)

  // log(`[info] replace label`)

  // desc: ignore deleted-label line
  if (!Array.isArray(res)) {
    res = res.split(/\r?\n/)
  }
  // if (deletedLabel) {
  //     res = res.filter(line => {
  //         let index = line.indexOf(deletedLabel)
  //         log(index)
  //         index = index !== -1
  //         if (!index) {
  //             log(`[info] will delete ${line}`)
  //         }
  //         return !index
  //     })
  //     log(res)
  // }

  // bugs: delete all empty line when deletedLabel=''
  if (deletedLabel) {
    res = res.filter(line => line.indexOf(deletedLabel) === -1)
  }
  // res = res.filter(line => line.indexOf(deletedLabel) === -1)
  res = res.join(eof)
  return res
}
export default delMatchedLine
