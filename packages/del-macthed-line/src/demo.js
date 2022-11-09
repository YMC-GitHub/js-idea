import main from './index'
import { log, getHashCode } from './helps'

const input = `
ad
//
#
/**  */
--
abc # -
abc //
abc /* xas */
/**
 * 
 *  asd 
 */

# -
`

// del sh-line comment

const shLineCommentReg = /(?:#.*)/gim // \r?\n *#/gim
const jsLineCommentReg = [/((?:\/\*(?:[^*]|(?:\*+[^*/]))*\*+\/)|(?:\/\/.*))/gim]
const otherReg = [/(?:abc.*)/gim]

// /\r?\n *\/\//gim - js line comment -ok
// /(?:\/\/.*)/igm - js line comment -ok
// /(\/)([*])+(.|\r|\n)+?(\2\1)/gim - -ok
// /((?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/))/gim

//
// /((?:\/\*(?:[^*]|(?:\*+[^*\/]))*\*+\/)|(?:\/\/.*))/gim
function task(regs) {
  let res = input
  const list = Array.isArray(regs) ? regs : [regs]
  for (let index = 0; index < list.length; index += 1) {
    const reg = list[index]
    log('[info] match line comment in multi-line text')
    const match = res.match(reg)
    log(match)
    if (match) {
      log('[info] delete it')
      res = main({ text: res, reg })
    }
  }
  log(res)
}
log(input)
task(shLineCommentReg)
task(jsLineCommentReg)
task(otherReg)

log(getHashCode(input))
// log([input, res])

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/del-macthed-line/src/demo.js
