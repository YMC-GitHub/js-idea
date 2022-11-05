/* eslint-disable no-unused-vars,prefer-const */
/* eslint-disable max-len */
import { writeTpl } from '@ymc/render-tpl'
import { log, getTplLocByName, getTmpLocByName, readTextSync, writeTextSync, readJsonSync } from './helps'
import { renderLibSize, renderLibName, renderOther, renderLibState } from './renders'

function main(wkd) {
  log(`[info] wkd is: ${wkd}`)
  log('[task] gen pkg readme')
  log('[info] load pkg-json data')
  const packagejson = readJsonSync(`${wkd}/package.json`)

  // read tpl
  let loc
  let tpl
  let data
  let res
  log('[info] load readme tpl')
  loc = getTplLocByName('readme', wkd)
  log(`[info] loc: ${loc}`)
  tpl = readTextSync(loc)

  // load data and render
  log('[info] load lib-size data')
  loc = getTmpLocByName('lib-size', wkd)
  log(`[info] loc: ${loc}`)
  data = readTextSync(loc)
  res = renderLibSize(tpl, data)

  // res = renderLibName(res, libname)
  res = renderLibName(res, packagejson.name)
  res = renderOther(res, packagejson)

  log('[info] load pkgs state data')
  let pkgsstate = readJsonSync('pkgs-info.json')
  pkgsstate = pkgsstate.filter(v => v.name === packagejson.name)
  //   log(pkgsstate)
  ;[pkgsstate] = pkgsstate
  // let keys='lin_state,tes_state'
  log('[info] load pkg-state tpl')
  loc = 'pkgs-state.tpl.tmp.md'
  log(`[info] loc: ${loc}`)
  tpl = readTextSync(loc)
  tpl = writeTpl(tpl, pkgsstate)
  res = `${tpl}\n${res}`
  writeTextSync(`${wkd}/readme.md`, res)
}
export default main
