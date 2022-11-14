/* eslint-disable no-param-reassign */

/* eslint-disable no-await-in-loop,no-return-await */
/* eslint-disable  no-unused-vars,prefer-const,import/prefer-default-export */

import { wrapTextFileToEsmModule } from './helps'
/** @typedef {{format:string,source:string,shortCircuit:boolean}} loaderResult */

const builtinloaders = [
    {
        name: 'load-text-file',
        rules: ['.md', '.css', '.html', '.htm', '.svg'],
        async load(url) {
            const { rules } = this
            const checkUrl = url.split('?')[0]
            // ['.md', '.css', '.html', '.htm', '.svg']
            let match
            // match = rules.some(rule => rule.test(checkUrl))
            match = rules.some(rule => checkUrl.endsWith(rule))
            if (match) {
                return await wrapTextFileToEsmModule(url)
            }
            return undefined
        }
    }
]

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
    // let ext = extname(checkUrl);
    // if (!ext) {
    //     checkUrl = `${checkUrl}.js`;
    // }

    // feat: wrap text file esm module
    // const txtExt = ['.md', '.css', '.html', '.htm', '.svg']
    // if (txtExt.some(ext => checkUrl.endsWith(ext))) {
    //     // console.log(url);
    //     return await wrapTextFileToEsmModule(url)
    // }

    // feat: run custom load
    let res
    for (let index = 0; index < builtinloaders.length; index += 1) {
        const ld = builtinloaders[index]
        res = await ld.load(url)
        if (res) {
            break
        }
    }
    if (res) return res

    // if (!ext) {
    //     return defaultLoad(checkUrl, context, defaultLoad);
    // }

    // feat: run default load
    return defaultLoad(url, context, defaultLoad)
}
// https://foxeyes.github.io/cv/pulse/custom_node_esm_loader.html
