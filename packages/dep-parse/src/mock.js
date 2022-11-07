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

/**
 * mock node.js path.join (expect join.sep ='/')
 * @param {string[]} likepath
 * @returns {string}
 */
function join(...likepath) {
  const list = [...likepath]
    .map(v => v.split(/\/?\\|\//))
    .flat(Infinity)
    .filter(v => v)
  return list.join(join.sep ? join.sep : '/')
}
// join.sep = '/'
// let abs = joinPath(dirname(fileloc), dep)
// // \ to /
// abs = abs.replace(/\\/gi, '/')
// return abs
export { dirname, basename, join }
