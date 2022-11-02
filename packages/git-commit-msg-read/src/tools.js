/* eslint-disable no-param-reassign, */
/**
 * ini data[key] with val
 * @param {{}} data
 * @param {string} key
 * @param {*} def
 */
function inidata(data, key, def) {
  if (!data[key]) {
    data[key] = def
  }
}
/**
 * bind val from map to list with keyword
 * @param {[][]} list
 * @param {string} name
 * @param {[][]} map
 * @returns
 */
function bindVals(list = [], name = 'subject', map = []) {
  if (map.length !== list.length) return
  // let map = toArray(s);
  const len = list.length
  for (let index = 0; index < len; index += 1) {
    const line = list[index]
    line[`${name}`] = map[index]
  }
}
function toArray(s) {
  return s.trim().split(/\r?\n/)
}
export { inidata, bindVals, toArray }
