/* eslint-disable max-len,no-unused-vars */
import { readFile } from 'fs/promises'
import { URL, pathToFileURL } from 'url'
// import { jsonstream } from '@ymc/json-stream-io'

/** @typedef {{format:string,source:string,shortCircuit:boolean}} resloveResult */
/**
 * wrap text file to es module
 * @param {string} url
 * @returns {resloveResult}
 * @description
 * ```
 * ## idea
 * read-file-text -> wrap-esm-expression -> set-module-format
 * ```
 */
async function wrapTextFileToEsmModule(url) {
  // console.log(new URL(url));
  // idea: read-file-text -> wrap-esm-expression -> set-module-format
  const content = await readFile(new URL(url))
  return {
    format: 'module',
    source: `export default ${JSON.stringify(content.toString())};`,
    shortCircuit: true
  }
}

function matchExts(url, exts) {
  return exts.some(ext => url.endsWith(ext))
}

function noop() {}
export { noop, wrapTextFileToEsmModule, matchExts }
