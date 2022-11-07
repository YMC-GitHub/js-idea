/* eslint-disable prefer-const,no-unused-vars */
/* eslint-disable max-len */
import {
  log,
  textstream,
  getObjOnlyDefinedKeys,
  delComment,
  getRequriesExp,
  getLocalDeps,
  getOutProjectDeps,
  resolveLocalDep
} from './helps'

/**
 *
 * @description
 * ```
 * ## why use?
 * - [x] get a file 's dep
 * - [x] get a pkg 's dep
 * - [x] to install out-lib dep automation when it compile
 * - [x] to copy in-lib dep automation when it migrate
 * ```
 */
class ParseHelp {
  constructor() {
    this.init()
  }

  init() {
    this.option = {}
    this.filetext = ''
    this.matchs = []
    this.inLibDeps = []
    this.outlibDeps = []
    this.alldeps = []
    this.deptree = {}
    this.option.inlibdepReg = [/^\./, /@src/]
    // this.option.outlibReg = [/@ymc/];
    this.option.parsetasks = ['in', 'out']
    this.option.nodedeps = ['fs', 'path', 'os']
  }

  /**
   * read text file
   * @param {string} loc
   * @return {this}
   */
  async read(loc) {
    textstream.init(loc)
    this.filetext = await textstream.read()
    return this
  }

  /**
   * del comment if ignore-comment
   */
  delComment() {
    let { option, filetext } = this
    const { commentReg, ignoreComment } = option
    // filetext = delComment({ text: filetext, ...{ commentReg, ignoreComment } })
    // filetext = delComment({ text: filetext, commentReg, ignoreComment }) //no when no commentReg
    // filetext = delComment({ text: filetext, ...selectDataKeys(option, '{commentReg, ignoreComment}') })//ok
    // filetext = delComment({ text: filetext, ...option }) //ok
    filetext = delComment(getObjOnlyDefinedKeys({ text: filetext, commentReg, ignoreComment }))
    this.filetext = filetext
    return this
  }

  getMatchs() {
    const { option, filetext } = this
    // const { requireReg } = option
    const matchs = getRequriesExp({ text: filetext, ...option })
    this.matchs = matchs
    return matchs
  }

  getInLibDeps() {
    const { option, matchs } = this
    const { inlibdepReg } = option

    // const inlibdep = getLocalDeps({ data: matchs, ...getObjOnlySelectedKeys(option, '{localDepReg: inlibdepReg}') })
    const inlibdep = getLocalDeps(getObjOnlyDefinedKeys({ data: matchs, localDepReg: inlibdepReg }))
    this.inLibDeps = inlibdep
    return inlibdep
  }

  /**
   * get out lib dep
   * @description
   * ```
   * ## task
   *  - [x] filter in lib dep
   *  - [x] filter node builtin dep
   * ```
   */
  getOutlibDes() {
    const { option, matchs } = this
    const { inlibdepReg, nodedeps } = option
    const outlibdep = getOutProjectDeps(
      getObjOnlyDefinedKeys({
        data: matchs,
        localDepReg: inlibdepReg,
        // localDep: inLibDeps,
        builintDep: nodedeps
      })
    )
    this.outlibDeps = outlibdep
    return this
  }

  // excludeNodeDep() {}
  /**
   * reslove in lib dep path
   * @param {*} loc
   * @description
   * ```
   * ## task
   * - [x] ignore private pkgs -- start with private-pkgs
   * - [x] ignore scope pkg
   * - [x] with unix path format
   * ```
   */
  resolveInLibDeps(loc) {
    // resolve-local-dep-file
    let localdep = this.inLibDeps
    localdep = resolveLocalDep({ data: localdep, fileloc: loc })
    this.inLibDeps = localdep
  }

  /**
   * parse his dep for loc
   * @param {string} loc
   * @returns
   */
  async parse(loc) {
    const { option } = this
    const { parsetasks } = option
    await this.read(loc)
    this.delComment()
    this.getMatchs()
    if (parsetasks.includes('in')) {
      this.getInLibDeps()
      this.resolveInLibDeps(loc)
    }
    if (parsetasks.includes('out')) {
      this.getOutlibDes()
    }

    const { inLibDeps, outlibDeps } = this
    this.alldeps = [...inLibDeps, ...outlibDeps]
    return this.alldeps
  }
}
export default ParseHelp
