/* eslint-disable prefer-const */
/* eslint-disable no-return-await */ // to fix
/* eslint-disable no-param-reassign */ // i do know

import './types'
import { log, jsonstream, chaintask, getPkgInfo, getPkgLocListInDir } from './helps'

/**
 * put pkgs-info
 * @param {string} name
 * @param {string} key
 * @param {string} state
 * @param {pkginfo[]} store
 * @returns {pkginfo[]}
 */
function putPkgsInfo(name, key, state, store) {
  let added = store.some(v => v.name === name)
  if (!added) {
    store.push({ name, [`${key}`]: state })
  } else {
    store.forEach(v => {
      if (v.name === name) {
        v[key] = state
      }
    })
  }
  return store
}

/**
 * merge pkgs-info
 * @param {pkginfo[]} now
 * @param {pkginfo[]} data
 * @returns {pkginfo[]}
 */
function mergPkgsInfo(now, data) {
  const res = {}

  now.forEach(v => {
    const { name } = v
    res[name] = v
  })
  data.forEach(v => {
    const { name } = v
    if (res[name]) {
      res[name] = {
        ...res[name],
        ...v
      }
    } else {
      res[name] = v
    }
  })
  return Object.values(res)
}

/**
 * pull pkgs-info
 * @param {{packagesLoc:string|string[]storeAt:string}} options
 */
async function pullPkgsInfo(options = {}) {
  let list
  let tasks
  let inPackagejson
  let loc
  list = await getPkgLocListInDir(options)
  tasks = list.map(opt => async () => await getPkgInfo(opt))

  let inPkgsInfo
  inPackagejson = await chaintask(tasks)
  // log(data)

  loc = options.storeAt ? options.storeAt : 'pkgs-info.json'
  jsonstream.init(loc)
  inPkgsInfo = await jsonstream.read([])

  const res = mergPkgsInfo(inPkgsInfo, inPackagejson)
  await jsonstream.write(res)
  log(`[info] out: ${loc}`)
}

/**
 * code pkgs-info
 * @param {{packagesLoc:string|string[],storeAt:string}} options
 */
async function codePkgsInfo(options = {}) {
  let list
  let tasks
  let inPackagejson
  let loc
  // codePkgsInfo({ packagesLoc: 'packages,private-pkgs' })
  list = await getPkgLocListInDir(options)
  tasks = list.map(opt => async () => await getPkgInfo(opt))

  let inPkgsInfo
  inPackagejson = await chaintask(tasks)
  // log(inPackagejson)

  loc = options.storeAt ? options.storeAt : 'pkgs-info.json'
  jsonstream.init(loc)
  inPkgsInfo = await jsonstream.read([])
  // log(inPkgsInfo)
  const res = mergPkgsInfo(inPackagejson, inPkgsInfo)
  await jsonstream.write(res)
  log(`[info] out: ${loc}`)
}

/**
 * push pkgs-info - update pkg.description
 * @param {{storeAt:string}} options
 */
async function pushPkgsInfo(options = {}) {
  let tasks
  let data
  let loc
  loc = options.storeAt ? options.storeAt : 'pkgs-info.json'
  jsonstream.init(loc)
  data = await jsonstream.read([])
  tasks = data.map(pkg => async () => {
    jsonstream.init(pkg.loc)
    let cache = await jsonstream.read({})
    cache.description = pkg.description
    await jsonstream.write(cache)
    cache = null
    // return cache
  })
  log(`[info] out: ${loc}`)
  await chaintask(tasks)
}

export { putPkgsInfo, pullPkgsInfo, codePkgsInfo, pushPkgsInfo }
