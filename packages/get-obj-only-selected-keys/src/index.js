/* eslint-disable prefer-const */

// @ymc/get-obj-only-selected-keys
/**
 * get obj only selected keys
 * @param {{}} data
 * @param {string} keys
 * @param {string|regexp} sc
 * @returns {{}}
 * @sample
 * ```
 * selectDataKeys(option, 'commentReg, ignoreComment')
 * selectDataKeys(option, '{text:filetext,commentReg, ignoreComment}')
 * ```
 */
function getObjOnlySelectedKeys(data, keys, sc = /,/) {
  const res = {}
  keys
    .replace(/(^ ?{)|(} ?$)/gi, '')
    .split(sc)
    .forEach(key => {
      // keys=''
      let [alias, name] = key
        .trim()
        .split(':')
        .map(v => v.trim())

      // get val by key
      const val = name ? data[name] : data[alias]
      if (val !== undefined) {
        // feat: set val bind new name
        res[alias] = val
      }
    })
  return res
}

export default getObjOnlySelectedKeys
