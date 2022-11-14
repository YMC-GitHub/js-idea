/* eslint-disable  no-return-assign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */

import { resolve as resolvePath } from 'path'
// const { log } = console
/**
 * replace alias - update url with alias map
 * @param {string} url
 * @param {{}} options
 * @returns {string}
 */
function replaceAlias(url, options) {
    const map = resloveAlias(options)

    const aliaskeys = Object.keys(map)

    for (let index = 0; index < aliaskeys.length; index += 1) {
        const aliaskey = aliaskeys[index]
        const alias = map[aliaskey]
        // if(option.resolve){
        //     alias=option.resolve(alias)
        // }
        if (url.startsWith(aliaskey)) {
            const reg = new RegExp(`^${aliaskey}`)
            const name = url.replace(reg, '')
            // url = `${alias}${name}`;
            url = `${alias}/${name}`
            // url = url.replace(/\//gi, pathSep);
            // url = url.replace(/\\\\/gi, pathSep);
            url = url.replace(/\\/gi, '/')

            // log(`[info] get url by url.hrel - URL`)
            // // url = new URL(url).href;
            // log(new URL(url).href)

            // fix: file url protocol warn in window
            // Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only file and data URLs are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'h:'
            url = `file:///${url}`

            // console.log(new URL(url));
            // log(`[info] alias url ${url}`);
        }
    }
    return url
}
/**
 * reslove alias to root dir
 * @param {{}} data
 * @returns {{}}
 */
function resloveAlias(data) {
    // std 1.1 get root path
    const root = resolvePath(process.cwd(), '.')

    const { alias = {} } = data
    // std 1.3 replace <root> expression
    Object.keys(alias).forEach(k => {
        const val = alias[k]
        // <root> -> .
        alias[k] = replaceRootExp(val)
        // ./ -> abs
        alias[k] = resolvePath(root, alias[k])
    })
    return alias
}
/**
 * replace root expression to string
 * @param {string} s
 * @param {string} rootvalue
 * @param {regexp} rootreg
 * @returns {string}
 */
function replaceRootExp(s, rootvalue = '.', rootreg = /^<root>/i) {
    return s.replace(rootreg, rootvalue)
}
export default replaceAlias
