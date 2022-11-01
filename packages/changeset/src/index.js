/* eslint-disable prefer-const,no-use-before-define,no-unused-vars */
import { createReadStream, createWriteStream } from 'fs'
import { readStream, writeStream } from '@ymc/stream-io'

// function readStream(stream) {
//     return new Promise((resolve, reject) => {
//         let data = ''
//         stream
//             .on('data', chunk => {
//                 data += chunk.toString()
//             })
//             .on('end', () => {
//                 resolve(data)
//             })
//             .on('error', reject)
//     })
// }
// function writeStream({ stream, data }) {
//     return new Promise((resolve, reject) => {
//         // write
//         stream.write(data, 'utf-8')
//         // fire end
//         stream.end()
//         // desc-x-s: handle event finish and err
//         stream
//             .on('finish', () => {
//                 resolve(data)
//             })
//             .on('error', reject)
//         // desc-x-e: handle event finish and err
//     })
// }

// idea:pkg-design
// changeset-{make,write,read,parse}
// @ymc/changeset-make
// @ymc/changeset-io
// @ymc/changeset-parse

/** @typedef {{lib?:string,version?:string,msg?:string,scope?:string}} changesetMakeOption */

// @ymc/changeset-make
/**
 * make changeset - def default .changeset/xx.md
 * @param {changesetMakeOption} option
 * @returns {string}
 * @description
 * ```
 *
 * ```
 */
function makeChangeset(option = {}) {
  const def = {
    // scope:'ymc',
    lib: 'noop',
    version: 'patch',
    msg: 'change all thing'
  }
  const { scope, lib, version, msg } = { ...def, ...option }
  const libname = scope ? `@${scope}/${lib}` : lib
  let res = `
---
"${libname}": ${version}
---

${msg}
`
  res = res.trim()
  return res
}

// idea: read-changeset -> get-version-type
/**
 *
 * @param {string} s
 * @param {string} libname
 * @returns
 * @description
 * ```
 * def-libname-regexp -> match -> slice
 *
 * ```
 * @sample
 * ```
 * let s=`"@ymc/run-bash": patch`
 * let l='run-bash'
 * getVersionTypeInChangeset(s,l) //patch
 * ```
 */
function getVersionTypeInChangeset(s, libname) {
  let res
  let match
  res = ''
  let reg
  reg = new RegExp(`\\".*${libname}\\": .*`, 'ig')
  match = s.match(reg)
  // log(reg, match);
  if (match) {
    // "@ymc/run-bash": patch -> patch
    res = match[0].split(':')[1].trim()
  }
  return res
}

// @ymc/changeset-parse
/**
 *
 * @param {string} s
 * @returns {{front:string,body:string}}
 */
function parseChangeset(s) {
  // front,body
  const menifest = splitLines(s)
  // get front label s and e positon
  const index = getFrontLabelPostion(menifest)
  const front = menifest.slice(0, index + 1).join('\n')
  const body = menifest.slice(index + 1).join('\n')
  return { front, body }
}
/**
 *
 * @param {string} str
 * @returns {string[]}
 */
function splitLines(str) {
  return str.split(/\r?\n/)
}

/**
 *
 * @param {string} menifest
 * @param {string} label
 * @returns {number}
 * @sample
 * ```
 * getFrontLabelPostion(`---\n"@ymc/run-bash": patch\n---\ndocs(run-bash): change all thing\n`)
 * ```
 */
function getFrontLabelPostion(menifest, label = '---') {
  let count = 0
  let position = 0
  for (let index = 0; index < menifest.length; index += 1) {
    const line = menifest[index]
    if (line === label) {
      count += 1
    }
    if (count === 2) {
      position = index
      break
    }
  }
  return position
}

class Changeset {
  constructor(name) {
    this.init(name)
  }

  /**
   * read file async (stream mode)
   * @param {*} def
   * @returns {Prmosie<string>}
   */
  async read(def = '') {
    const { file } = this
    let reader
    let res
    reader = createReadStream(file.name)
    try {
      res = await readStream(reader)
    } catch (error) {
      res = def
    }
    file.data = res
    return res
  }

  /**
   * write file async (stream mode)
   * @param {string|undefined} text
   * @returns {Prmosie<void>}
   */
  async write(text) {
    const { file, option } = this
    let writer
    writer = createWriteStream(file.name)
    let data = text
    if (isString(data)) {
      file.data = data
    } else {
      data = file.data
    }
    await writeStream({ stream: writer, data })
    function isString(s) {
      return typeof s === 'string'
    }
  }

  init(name = 'CHANGELO.md') {
    this.file = {
      name,
      data: ''
    }
    this.option = {}
  }

  // idea: read-changeset -> get-version-type
  /**
   *
   * @param {string} libname
   * @returns
   * @description
   * ```
   * def-libname-regexp -> match -> slice
   *
   * ```
   * @sample
   * ```
   * it.file.data=`"@ymc/run-bash": patch`
   * let l='run-bash'
   * it.getLibVersionType(l) //patch
   * ```
   */
  getLibVersionType(libname) {
    const { file, option } = this
    return getVersionTypeInChangeset(file.data, libname)
  }

  parse() {
    const { file, option } = this
    return parseChangeset(file.data)
  }

  /**
   *
   * @param {changesetMakeOption} option
   * @returns
   */
  make(option) {
    const { file } = this
    const res = makeChangeset(option)
    file.data = res
    return res
  }
}

const changeset = new Changeset()
export { changeset, makeChangeset, parseChangeset }
