const { log } = console

/**
 * format arr-str - set per line
 * @param {string[]} s
 * @param {number} perline the count of per line
 * @param {string} sc
 * @returns {string}
 */
function format(s, perline = 5, sc = '|') {
  let res = ''
  for (let index = 0; index < s.length; index += 1) {
    const item = s[index]
    const mod = index % perline
    if (mod === 0) {
      res = res ? `${res}\n` : ''
    }
    if (mod === 0) {
      res = `${res}${item}`
    } else {
      res = `${res}${sc}${item}`
    }
  }
  return res
}
function noop() {}
export { log, noop, format }
