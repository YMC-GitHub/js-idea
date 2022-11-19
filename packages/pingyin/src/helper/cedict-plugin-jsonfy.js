// style or compact:
/* eslint-disable  no-unused-vars,prefer-const */
/* eslint-disable  prefer-destructuring */
/* eslint-disable  max-len */
// define-entry
// entry-to-json
// entry-to-string
// https://github.com/matt-tingen/cedict-json/blob/main/build.ts
// https://github.com/takumif/cedict-lookup

// https://github.com/takumif/cedict-lookup/blob/master/src/parser.ts
import { readFile, writeFile, stat } from 'fs/promises'
import { join, dirname, resolve } from 'path'
import fixMagicVar from './fix-magic-var'
import filesize from './file-size'

const { log } = console
const entryRegex = /([^ ]+) ([^ ]+) \[([^\]]+)\] \/(.+)\//
/**
 *
 * @param {string} line
 * @returns
 */
export function parseEntry(line) {
    const match = line.match(entryRegex)

    if (!match) throw new Error(`Unknown line format: ${line}`)

    const [, traditional, simplified, pinyin, joinedEnglish] = match
    const english = joinedEnglish.split('/')

    return {
        traditional,
        simplified,
        pinyin,
        english
    }
}

// #! version=1
// #! subversion=0
// #! format=ts
// #! charset=UTF-8
// #! entries=121354
// #! publisher=MDBG
// #! license=https://creativecommons.org/licenses/by-sa/4.0/
// #! date=2022-11-17T02:36:44Z
// #! time=1668652604

/** @typedef {{version:string,format:string,charset:string,entries:number,publisher:string,date:string}} baseinfo */
/**
 * get base info json
 * @param {string|string[]} text
 * @returns {{baseinfo}}
 */
export function getBaseInfo(text) {
    const lines = Array.isArray(text) ? text : [text]
    const json = {}
    lines
        .filter(line => line.startsWith('#!'))
        .forEach(v => {
            let [key, val] = v.split('=')
            if (val === undefined) val = ''
            json[key] = val
        })
    return json
}

/**
 * get entry count
 * @param {string|string[]} text
 * @returns {number}
 */
export function getEntryCount(text) {
    // idea:to-lines,get-comment-count,get-entry-count,ignore-comment,parse-entry
    const lines = Array.isArray(text) ? text : [text]
    let entryline = lines.find(line => line.startsWith('#! entries='))
    if (entryline) {
        entryline = entryline.replace('#! entries=', '')
    }
    if (!entryline) {
        entryline = ''
    }
    const count = parseInt(entryline, 10)
    // const count = parseInt(lines.find(line => line.startsWith('#! entries='))?.replace('#! entries=', '') ?? '', 10)
    return count
}

/**
 * cedict-text to cedict-json
 * @param {string} text
 * @returns {[]}
 */
export function text2json(text) {
    // idea:to-lines,get-comment-count,get-entry-count,ignore-comment,parse-entry
    const lines = text.split('\n')
    // const cont = parseInt(lines.find(line => line.startsWith('#! entries='))?.replace('#! entries=', '') ?? '', 10)
    const count = getEntryCount(lines)
    const json = lines.filter(line => !line.startsWith('#')).map(parseEntry)
    if (json.length !== count) throw new Error(`Expected ${count} entries, found ${json.length}`)
    return json
}

/**
 * cedict_ts.u8 to cedict.json
 * @param {string} src
 * @param {string} des
 */
export async function buildCedict(src, des) {
    // idea:
    // read-text-file,parse-cedict-text,write-json-file,
    const fileBuffer = await readFile(src)
    const json = text2json(fileBuffer.toString())
    await writeFile(des, JSON.stringify(json))
}
export async function writeCedict() {
    log('[task] transform cedict_ts.u8 to cedict.json')
    const { __dirname } = fixMagicVar()
    // join or resolve ?
    const dictPath = resolve(__dirname, '../../data/cedict_ts.u8') // cedict.txt
    const jsonPath = resolve(__dirname, '../../data/cedict.json')
    await buildCedict(dictPath, jsonPath)
    let statinfo = await stat(dictPath)
    let size
    size = filesize(statinfo.size).human()
    log(`[info] file size of cedict_ts.u8: ${size}`)
    statinfo = await stat(jsonPath)
    size = filesize(statinfo.size).human()
    log(`[info] file size of cedict.json: ${size}`)
}

/**
 * load cedict.json
 * @returns
 */
export async function loadCedict() {
    log('[task] load cedict.json')
    const { __dirname } = fixMagicVar()
    const jsonPath = resolve(__dirname, '../../data/cedict.json')
    const fileBuffer = await readFile(jsonPath)
    return JSON.parse(fileBuffer.toString())
}
