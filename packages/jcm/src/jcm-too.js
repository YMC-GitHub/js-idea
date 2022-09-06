import { writeFileSync, readFileSync } from 'fs'
import { parse as parsePath, join as joinPath } from 'path'
import { makeDirs as addDirs, rmDirs as delDirs } from './curd-dirs-sync.js'

const { log } = console
/**
 * read json sync
 * @param {string} jsonLoc
 * @param {{}|[]} def
 * @returns {{}|[]}
 */
function readJson(jsonLoc, def = {}) {
  let data
  try {
    data = readFileSync(jsonLoc)
    data = JSON.parse(data)
  } catch (error) {
    data = def
  }
  return data
}
/**
 * write json sync
 * @param {string} jsonLoc
 * @param {{}|[]} data
 */
function saveJson(jsonLoc, data) {
  writeFileSync(jsonLoc, JSON.stringify(data, null, 2))
}
/**
 * get user home dir
 * @returns {string}
 * @description
 * ```
 * warn:to test in different platform
 * ```
 */
function getUserHome() {
  return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME']
}
export { readJson, saveJson, getUserHome, addDirs, delDirs, parsePath, joinPath }
