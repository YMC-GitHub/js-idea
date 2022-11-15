/* eslint-disable max-len,no-unused-vars,import/prefer-default-export */
import { wrapTextFileToEsmModule, matchExts } from './helps'
/** @typedef {{format:string,source:string,shortCircuit:boolean}} loaderResult */

const NAME = 'esm-loader-text-file'
const EXTS = ['.md', '.css', '.html', '.htm', '.svg']
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
export async function load(url, context, defaultLoad) {
    const checkUrl = url.split('?')[0] // Cutting the possible search parameters
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
        const res = await wrapTextFileToEsmModule(url)
        return res
    }

    // feat: run default load
    return defaultLoad(url, context, defaultLoad)
}
