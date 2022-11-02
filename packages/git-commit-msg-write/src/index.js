import { writeTpl } from '@ymc/render-tpl'
import { writemsgdata } from './write-msg-data'

/**
 * gen msg tpl with option (support angular style)
 * @param {genMsgTplOption} options
 * @returns
 * @description
 * ```
 *  ## angluar style
 *  `{type}({scope}): {subject}\n\n{body}\n\n{footer}`;
 *
 *  ## why head ?
 *  - [x] with type ,scope ,subject
 *
 *  ## why body ?
 *  - [x] detail about commit
 *
 *  ## why foot?
 *  - [x] BREAKING CHANGE eg. `BREAKING CHANGE:{detail}`
 *  - [x] Closes issue eg. `CLOESE ISUUE:#1,#2`
 *  ## revert?
 *
 *  'https://developer.aliyun.com/article/441408'
 *
 * ```
 */
function writemsgtpl(options = {}) {
  // gen default tpl with option
  const option = {
    // type: false,
    // scope: false,
    // body: false,
    // foot: false,
    eof: '\n',
    ...options
  }
  const { eof } = option
  const res = []
  let tpl = ''
  // set head
  if (option.type) {
    tpl = `${tpl}{type}`
  }
  if (option.scope) {
    tpl = `${tpl}({scope})`
  }
  if (option.colon || option.scope) {
    tpl = `${tpl}:`
  }
  tpl = tpl ? `${tpl} {subject}` : '{subject}'
  res.push(tpl)

  // body
  if (option.body) {
    res.push(`${eof}{body}`)
  }
  // foot
  if (option.foot) {
    res.push(`${eof}{foot}`)
  }
  return res.join(eof)
}
/**
 * define msg tpl or render tpl
 * @param {string} tpl
 * @param {{[string]:unknown}|undefined} data
 * @returns
 */
function writemsg(tpl, data) {
  return writeTpl(tpl, data)
}
export { writemsgtpl, writemsg, writemsgdata }
