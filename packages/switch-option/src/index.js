/* eslint-disable no-use-before-define,no-param-reassign */
// fix 'isDefine' was used before it was defined              no-use-before-define
// fix Assignment to property of function parameter 'option'  no-param-reassign
// fix Assignment to function parameter 'v'                   no-param-reassign
// fix Expected '!==' and instead saw '!='                    eqeqeq
/**
 * switch option
 * @param {{}} option
 * @param {string} list
 * @param {boolean} def
 * @description
 * ```
 * ## why use?
 * - [x] swicth option for different case
 * - [x] update option easily in a string
 * ```
 * @sample
 * ```
 * let cliOption = {}
 * switchOption(cliOption,'dryrun=false;update=true;defaultmode=copy',true)
 * switchOption(cliOption,'dryrun=false;update;defaultmode=copy',true)
 * ```
 */
function switchOption(option = {}, list = '', def = true) {
  list.split(';').forEach(exp => {
    // console.log(exp);
    // dryrun=false
    // 'key' is never reassigned. Use 'const' instead  prefer-const
    /* eslint-disable prefer-const */
    let [key, val] = exp.split('=')

    const defined = isDefine(val)
    // emptyString?
    // feat(switch-option): use def when val not defined in exp
    if (!defined) {
      val = def
    }

    // booleanString?
    // feat(switch-option): convert boolean string to node.js boolean\n\n with booleanfiy
    if (defined) {
      val = booleanfiy(val)
    }

    // number?string?
    // todo:

    option[key] = val
  })
}
/**
 * convert boolean string to node.js boolean when it is boolean string
 * @param {string} v
 * @returns {boolean|string}
 * @sample
 * ```
 * booleanfiy('false')//false
 * booleanfiy('true')//true
 * booleanfiy('hi')//'hi
 * ```
 */
function booleanfiy(v) {
  let res = v
  if (isBoolString(v, 'false')) {
    res = false
  } else if (isBoolString(v, 'true')) {
    res = true
  }
  return res
}
function isDefine(s) {
  return s !== undefined
}
function isBoolString(s, v = 'false') {
  // console.log(s);
  return s.toLowerCase() === v
  // another case
  // let d = s.toLowerCase();
  // return d == "false" || d == "true";
}
// fix Prefer default export  import/prefer-default-export
export default switchOption
