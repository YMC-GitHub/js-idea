import {
  existsSync,
  unlinkSync,
  createReadStream,
  createWriteStream,
  statSync,
  readdirSync,
  rmdirSync,
  readFileSync
} from 'fs'
import { join as joinPath, basename } from 'path'
// import { isRegExp } from 'util/types'
const { log } = console

//touch packages/read-diretory/{api,too}.js
function blue(str) {
  // feat: info blue msg
  return `\x1b[1m\x1b[34m${str}\x1b[39m\x1b[22m`
}
const isDiretory = folder => statSync(folder).isDirectory()
const isFile = folder => statSync(folder).isFile()

export { isDiretory, isFile, readFileSync, readdirSync, basename, joinPath, blue, log }
