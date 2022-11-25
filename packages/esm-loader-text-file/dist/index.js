/**
  * esmLoaderTextFile v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

/* eslint-disable max-len,no-unused-vars */
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
    const content = await readFile(new URL(url));
    return {
        format: 'module',
        source: `export default ${JSON.stringify(content.toString())};`,
        shortCircuit: true
    }
}

function matchExts(url, exts) {
    return exts.some(ext => url.endsWith(ext))
}

/* eslint-disable max-len,no-unused-vars,import/prefer-default-export */
const EXTS = ['.md', '.css', '.html', '.htm', '.svg'];
/**
 * custom load handle for esm loader
 * @param {string} url
 * @param {*} context
 * @param {*} defaultLoad
 * @returns {Promise<loaderResult>}
 * @desciption
 * ```
 * ## task
 * - [x] import .css,html,svg file as an esm module
 * ## idea
 * - [x] run custom loader
 * - [x] run defalut loader
 * ```
 */
async function load(url, context, defaultLoad) {
    const checkUrl = url.split('?')[0]; // Cutting the possible search parameters
    // console.log(parsePath(checkUrl));

    // default ext
    // let ext = extname(checkUrl);
    // if (!ext) {
    //     checkUrl = `${checkUrl}.js`;
    // }
    // if (!ext) {
    //     return defaultLoad(checkUrl, context, defaultLoad);
    // }

    // feat: run custom load
    // feat: wrap text file esm module
    if (matchExts(checkUrl, EXTS)) {
        // console.log(url);
        const res = await wrapTextFileToEsmModule(url);
        return res
    }

    // feat: run default load
    return defaultLoad(url, context, defaultLoad)
}

export { load };
