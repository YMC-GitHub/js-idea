/**
 * mock node.js path.dirname
 * @param {string} wkd
 * @returns
 */
function dirname(wkd, sep = '/') {
  const list = wkd.split(/\/?\\|\//)
  return list.slice(0, list.length - 1).join(sep)
}
/**
 * mock node.js path.basename
 * @param {string} wkd
 * @returns
 */
function basename(wkd) {
  const list = wkd.split(/\/?\\|\//)
  return list[list.length - 1]
}
export { dirname, basename }
