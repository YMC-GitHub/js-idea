/* eslint-disable prefer-const,no-unused-vars */

import { existsSync, readdirSync, statSync, rmSync } from 'fs'
import ParseHelp from '@ymc/dep-parse'

class DepTreeHelp extends ParseHelp {
  /**
   * get his dep tree for loc
   * @param {*} loc
   */
  async getTree(loc) {
    const ph = new ParseHelp()
    const matchs = await ph.parse(loc)
    // localdep-only-exsits
    const localdepex = matchs.filter(dep => {
      if (/^@/.test(dep)) {
        return false
      }
      return existsSync(dep)
    })

    // log(`[info] local dep - exsits`);
    // log(localdepex);

    // dep-tree
    const deptree = {}
    deptree[loc] = matchs
    const prs = localdepex.map(async match => {
      if (!deptree[match]) {
        const res = await ph.parse(match)
        deptree[match] = res
      }
    })
    await Promise.all(prs)
    this.deptree = deptree
    // return deptree;
  }

  circular() {
    const { deptree } = this
    const res = []
    const names = Object.keys(deptree)
    names.forEach(name => {
      const matchs = deptree[name]
      if (matchs.some(dep => dep === name)) {
        res.push(name)
      }
    })
    return res
  }

  leaves() {
    const { deptree } = this
    const res = []
    const names = Object.keys(deptree)
    let alldeps = names.map(v => deptree[v])
    alldeps.push(names)
    alldeps = alldeps.flat(1)
    alldeps.forEach(name => {
      const matchs = deptree[name]
      // has no dep
      if (!matchs || matchs.length === 0) {
        res.push(name)
      }
    })
    return res
  }

  orphans() {
    const { deptree } = this
    const res = []
    const names = Object.keys(deptree)
    let alldeps = names.map(v => deptree[v])
    alldeps.push(names)
    alldeps = alldeps.flat(1)
    alldeps.forEach(name => {
      const matchs = deptree[name]
      if (!matchs || matchs.length === 0) return
      // no one is depending on
      if (!matchs.some(dep => dep === name)) {
        res.push(name)
      }
    })
    return res
  }
}
export default DepTreeHelp
