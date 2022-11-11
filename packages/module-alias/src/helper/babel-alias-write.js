/* eslint-disable no-unused-vars */
import { isOneOfValues } from '../helps'

// help to write babel alias easzier
class BabelbabelAliasHelp {
  constructor() {
    this.data = {}
  }

  /**
   * set the working directory for module resolve
   * @param {string} [cwd=''] the working directory setting
   * @description
   * ```
   * '' - the working directory is the one used for the resolver
   * 'babelrc' - look for the closest babelrc configuration based on the file to parse
   * 'packagejson' - look for the closest package.json based on the file to parse
   *
   * refs:
   * https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md#cwd
   * ```
   */
  cwd(cwd) {
    const { data } = this
    if (!isOneOfValues(cwd, ['packagejson', 'babelrc', ''])) return this
    switch (cwd) {
      case '':
        delete data.cwd
        break
      default:
        data.cwd = cwd
        break
    }
    return this
  }

  /**
   * add a directory to resolve modules
   * @param {string} dir a directory to resolve modules
   */
  root(dir) {
    if (!dir) return this
    let {
      data: { root }
    } = this
    if (!root) root = []
    if (!isOneOfValues(dir, root)) {
      root.push(dir)
      this.data.root = root
    }
    return this
  }

  /**
   * add a alias
   * @param {string} src from where
   * @param {string} des to where
   * @param {string} desc the description of a alias
   */
  alias(src, des, desc) {
    if (!src) return this
    if (!des) return this
    // get and ini alias map
    let {
      data: { alias }
    } = this
    if (!alias) alias = {}

    // add,put,del support
    alias[src] = des
    // log desc

    this.data.alias = alias
    return this
  }
}
export default BabelbabelAliasHelp
