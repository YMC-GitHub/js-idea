/**
 * is one item of list
 * @param {string} one
 * @param {string[]} list
 * @returns {boolean}
 * @sample
 * ```
 *  let validType = "feat|fix|docs|style|refactor|preform|test|tool|chore|revert";
 * oneOf('feat', validType.slpit("|")) //true
 * ```
 */
function oneOf(one, list) {
  return list.some(v => v === one)
}

/**
 * is valid type
 * @param {string} type
 * @param {string} validTypes
 * @returns {boolean}
 * @sample
 * ```
 * isValidType('feat') //true
 * ```
 */
function isValidType(type, validTypes = 'feat|fix|docs|style|refactor|preform|test|tool|chore|revert') {
  return oneOf(type, validTypes.split('|'))
}
function isDefine(c) {
  return c !== undefined
}

function toArray(s) {
  // console.log(typeof s);
  return s.trim().split(/\r?\n/)
}
// fix:fix msg when escape \n with \\n
function fixmsg(s) {
  return s
    .trim()
    .split(/\r?\n/)
    .map(v => v.trim().split('\\n'))
    .flat(1)
    .map(v => v.trim())
  // \\n
  /// \\n/
}
export { oneOf, isValidType, isDefine, toArray, fixmsg }
