/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */ // need to know what you do

import { getObjOnlyDefinedKeys } from '../helps'

const defaultOption = {
  wrapper: true
}

/**
 * babel-alias to eslint-alias
 * @param {*} map
 * @param {*} opts
 * @returns
 */
function babel2eslint(map, opts = {}) {
  let res = {}
  res = map
  const option = getObjOnlyDefinedKeys({ ...defaultOption, ...opts })

  const { wrapper } = option
  if (wrapper) {
    res = { 'babel-module': res }
  }
  // https://www.npmjs.com/package/eslint-import-resolver-babel-module
  // https://github.com/import-js/eslint-plugin-import#resolvers
  return res
}

/**
 * babel-alias to jest-alias
 * @param {*} map
 * @param {*} opts
 * @returns
 */
function babel2jest(map, opts = {}) {
  let res = {}

  const option = getObjOnlyDefinedKeys({ ...defaultOption, ...opts })
  let { rootDirSymbol, wrapper } = option
  if (!rootDirSymbol) rootDirSymbol = '<rootDir>'

  Object.keys(map).forEach(key => {
    let nk = key
    nk = nk.trim()
    // only do with key
    if (!nk) return

    // only do with val
    let val = map[nk]
    if (!val) return

    // key del ^
    nk = nk.replace(/^\^/, '')
    // key del /
    //
    // key replace (.+) to (.*)
    nk = nk.replace('(.+)', '(.*)')

    // val replace rootdir
    val = val.replace('.', rootDirSymbol)
    // val replace regexp
    // val=val.replace('\\1','$1')
    val = val.replace('\\', '$')

    res[nk] = val
  })

  if (wrapper) {
    res = { moduleNameMapper: res }
  }
  return res
}

/**
 * babel-alias to ts-alias
 * @param {{}} map
 * @param {{}} opts
 * @returns
 */
function babel2ts(map, opts = {}) {
  let res = {}

  const option = getObjOnlyDefinedKeys({ ...defaultOption, ...opts })
  let { rootDirSymbol, wrapper } = option
  if (!rootDirSymbol) rootDirSymbol = '.'
  Object.keys(map).forEach(key => {
    let nk = key
    nk = nk.trim()
    // only do with key
    if (!nk) return

    // only do with val
    let val = map[nk]
    if (!val) return

    // key del ^
    nk = nk.replace(/^\^/, '')
    // key replace (.+)$ to *
    nk = nk.replace('(.+)$', '*')

    // val replace rootdir
    val = val.replace('.', rootDirSymbol)
    // val replace \\1 to *
    val = val.replace('\\1', '*')

    // make val to arr
    val = [val]

    res[nk] = val
  })
  //
  if (wrapper) {
    // res={paths:res}
    res = { baseUrl: rootDirSymbol, paths: res }
  }
  return res
}
export { babel2eslint, babel2jest, babel2ts, babel2ts as babel2jsconfig, babel2ts as babel2tsconfig }
// refs:
// https://medium.com/@justintulk/solve-module-import-aliasing-for-webpack-jest-and-vscode-74007ce4adc9
// https://code.visualstudio.com/docs/languages/jsconfig
