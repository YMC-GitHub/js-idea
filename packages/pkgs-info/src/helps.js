/* eslint-disable camelcase,max-len */ // data-requires

import './types'
import { camelize } from '@ymc/extend-string'

import { statSync, readdirSync, existsSync } from 'fs'
import { jsonstream } from '@ymc/json-stream-io'
import chaintask from '@ymc/chain-task'
import { dirname, basename } from './mock'

const { log } = console

/**
 * get lib name with working dir
 * @param {string} wkd
 * @param {{trim?:boolean,camelize?:boolean}} option
 * @returns
 */
function getLibNameFromPath(wkd, option = {}) {
  let res = basename(wkd)
  const opt = {
    trim: true,
    ...option
  }
  if (opt.trim) {
    res = res.trim()
  }
  if (opt.camelize) {
    res = camelize(res)
  }
  return res
}

/**
 * get lib dir with working dir
 * @param {string} wkd
 * @returns
 */
function getPackagesLocFromPath(wkd) {
  return dirname(wkd)
}

/**
 * get file modified and created date
 * @param {string} loc
 * @returns {{modifiedAt:string,createdAt}}
 */
function getFileDatedAt(loc) {
  // log(`[info] get created_at, modified_at`)
  const stat = statSync(loc)
  const { birthtime: created, mtime: modifedData_at, ctime: modifiedStat_at } = stat
  let modified = [modifedData_at, modifiedStat_at]
  // https://futurestud.io/tutorials/node-js-get-a-files-created-date
  modified = modified.sort((a, b) => new Date(b) - new Date(a))

  // .formatDate(`yyyy-MM-dd`)

  // log(
  //     `b:${formatDate('yyyy-MM-dd', new Date(created))} m:${formatDate(
  //         'yyyy-MM-dd',
  //         new Date(modifedData_at)
  //     )} c:${formatDate('yyyy-MM-dd', new Date(modifiedStat_at))} loc:${loc}`
  // )
  return { modifiedAt: modified[0], createdAt: created }
}

/**
 * @param {{wkd:string}} options
 * @returns {pkginfo}
 */
async function getPkgInfo(options = {}) {
  const option = {
    wkd: './private-pkgs/noop',
    ...options
  }
  const libname = getLibNameFromPath(option.wkd)
  const libdir = getPackagesLocFromPath(option.wkd)

  const loc = `${libdir}/${libname}/package.json`
  jsonstream.init(loc)
  const data = await jsonstream.read({})

  // log(`[info] get name,desciption`)
  const { name, description } = data
  // log(libname, libdir)
  // log(data)
  let modified_at = []
  let created_at = []

  const list = [`${libdir}/${libname}/package.json`, `${libdir}/${libname}/src/index.js`]
  list
    .filter(v => existsSync(v))
    .forEach(v => {
      const { modifiedAt, createdAt } = getFileDatedAt(v)
      modified_at.push(modifiedAt)
      created_at.push(createdAt)
    })
  // .flat(Infinity)

  modified_at = modified_at.sort((a, b) => new Date(b) - new Date(a))
  created_at = created_at.sort((a, b) => new Date(a) - new Date(b))
  ;[modified_at] = modified_at
  ;[created_at] = created_at

  return {
    name,
    description,
    created_at,
    modified_at,
    loc
  }
}

/**
 *
 * @param {{packagesLoc:string|string[],split:string|regexp}} options
 * @returns {{wkd:stirng,libname:string,packagesLoc:string}[]}
 */
async function getPkgLocListInDir(options = {}) {
  const option = {
    packagesLoc: ['packages'],
    split: ',',
    ...options
  }
  // log(`[info] get pkg loc list`)

  // feat: split string to array when packagesLoc is string
  const dirs = Array.isArray(option.packagesLoc) ? option.packagesLoc : option.packagesLoc.split(option.split)
  let list = dirs
    .map(dir =>
      readdirSync(dir).map(name => ({
        wkd: `${dir}/${name}`,
        libname: name,
        packagesLoc: dir
        // libdir: dir
      }))
    )
    .flat(Infinity)
  // feat: only diretory
  list = list.filter(opt => statSync(opt.wkd).isDirectory())
  return list
}

export { log, jsonstream, chaintask, getPkgInfo, getPkgLocListInDir }
