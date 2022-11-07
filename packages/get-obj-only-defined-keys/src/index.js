// @ymc/get-obj-only-defined-keys
/**
 * get obj only define keys
 * @param {{}} option
 * @return {{}}
 */
function getObjOnlyDefinedKeys(option = {}) {
  const res = {}
  Object.keys(option).forEach(v => {
    if (option[v] !== undefined) {
      res[v] = option[v]
    }
  })
  return res
}
export default getObjOnlyDefinedKeys
