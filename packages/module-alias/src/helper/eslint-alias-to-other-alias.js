/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */ // need to know what you do
/* eslint-disable import/prefer-default-export */

import { getObjOnlyDefinedKeys } from '../helps'

const defaultOption = {
  wrapper: true
}

function eslint2babel(map, opts = {}) {
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
export { eslint2babel }
