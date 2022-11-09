const { log } = console

/* eslint-disable no-bitwise */
/**
 * get str hash - custom fun
 * @param {String} str
 * @param {Boolean} caseSensitive
 * @return {Number} hashCode
 * @description
 * ```
 * //refs:
 * //https://www.cnblogs.com/Silababy/p/5226886.html
 * ```
 */
function getHashCode(str, caseSensitive) {
  let txt = str
  if (!caseSensitive) {
    txt = txt.toLowerCase()
  }
  // 1315423911=b'1001110011001111100011010100111'
  let hash = 1315423911
  let i
  let ch
  for (i = txt.length - 1; i >= 0; i -= 1) {
    ch = txt.charCodeAt(i)
    // right-move-5-pos , left-move-2-pos
    hash ^= (hash << 5) + ch + (hash >> 2)
  }

  return hash & 0x7fffffff
}
/* eslint-enable no-bitwise */

// http://www.zkea.net/blog/detail/javascript-hash.html
// String.prototype.hashCode = function () {
//     let hash = 0,
//         i,
//         chr
//     if (this.length === 0) return hash
//     for (i = 0; i < this.length; i++) {
//         chr = this.charCodeAt(i)
//         hash = (hash << 5) - hash + chr
//         hash |= 0 // Convert to 32bit integer
//     }
//     return hash
// }
// like using md5 in browser ? https://cdn.bootcdn.net/ajax/libs/blueimp-md5/2.19.0/js/md5.js

function noop() {}
export { log, noop, getHashCode }
