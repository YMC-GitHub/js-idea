/**
 * @description
 * ```
 * ## why ?
 * - [x] easier,faster to write ycs-cli entrys when you clify your lib to ycs-cli
 *
 * ## how ?
 * ge.entrys(entrys).bind(cmd,defFun,'call')
 * ge.entrys(entrys).bind(ns,defFun,'call')
 * ge.entrys(entrys.ns).bind(subcmd,defFun,'call')
 * ge is short for generate-entrys
 * - [x] input entry
 * - [x] define a handle fun
 * - [x] bind a handle fun to ns,cmd
 * ```
 */
class GE {
  // constructor() {}

  /**
   * set or get entry
   * @param {{}} entry
   * @returns {this|entry}
   */
  entrys(entry) {
    // set
    if (entry) {
      this.context = entry
      return this
    }
    // get
    return this.context
  }

  /**
   * bind ns or subcmd with handle fun
   * @param {string} subcmd
   * @param {function} defFun
   * @param {string} bindType call handle fun
   */
  bind(subcmd = '', defFun = () => {}, bindType = '') {
    const entrys = this.entrys()
    if (!entrys) {
      Error('need entrys')
    }

    subcmd.split('|').forEach(cmd => {
      let entry
      switch (bindType.toLowerCase()) {
        case 'call':
          // feat: support call then bind entry
          entry = defFun(cmd)
          break
        default:
          break
      }
      // feat: support bind entry
      entrys[cmd] = entry
    })
  }
}
export default GE
