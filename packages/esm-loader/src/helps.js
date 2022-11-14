/* eslint-disable  no-unused-vars,prefer-const */
/* eslint-disable  consistent-return */

// import { readFile } from 'fs/promises'
import { join as joinPath, parse as parsePath, extname, resolve as resolvePath, sep as pathSep } from 'path'
import { URL, pathToFileURL } from 'url'
import { jsonstream } from '@ymc/json-stream-io'
// readFile(new URL(url))

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
    // const content = await readFile(new URL(url))
    jsonstream.init(new URL(url))
    const content = await jsonstream.read('')
    return {
        format: 'module',
        source: `export default ${JSON.stringify(content.toString())};`,
        shortCircuit: true
    }
}

/**
 * get package.json module type from extension
 * @param {string} filePath
 * @returns {string} - 'module' or 'commonjs'
 */
function getFormatFromExtension(filePath) {
    const extension = extname(filePath)
    if (extension === '.mjs' || extension === '.mts') {
        return 'module'
    }
    if (extension === '.cjs' || extension === '.cts') {
        return 'commonjs'
    }
}

/**
 * get index file with order - get packagejson key val
 * @param {{main:string,module:string,jsnext:string,browser:string}} packagejson
 * @param {string} order
 * @param {regexp} sepreg order sep reg
 * @returns {string}
 * @sample
 * ```
 * getIndexByOrder(packagejson)
 * getIndexByOrder(packagejson,'module -> main',/ ?-> ?/)
 * ```
 */
function getIndexByOrder(packagejson, order = 'module -> main', sepreg = / ?-> ?/) {
    return order
        .split(sepreg)
        .filter(v => v)
        .map(v => packagejson[v])
        .filter(v => v)
}

/**
 * get pkg index files
 * @param {string} url
 * @param {*} context
 * @param {*} defaultResolve
 * @returns {Promise<string[]>}
 * @description
 * ```
 * ## feat:
 * -
 * ```
 */
async function getPackageIndexFiles(url, context, defaultResolve) {
    const endswithsep = url.endsWith('/')
    // feat: has package.json

    // let loc = resolvePath(
    //     context.parentURL.replace("file:///", ""),
    //     packagejsonloc
    // );
    // console.log(loc, context);
    // new URL(loc)
    // console.log(context);
    // console.log(text);

    // step-x-s: get packagejson loc
    let packagejsonname
    let packagejsonloc
    let packagejson
    packagejsonname = 'package.json'
    packagejsonloc = endswithsep ? url + packagejsonname : `${url}/${packagejsonname}`

    // packagejsonloc = resolvePath(
    //     context.parentURL.replace("file:///", ""),
    //     packagejsonloc
    // );
    // packagejsonloc = new URL(packagejsonloc);
    packagejsonloc = packagejsonloc.replace('file:///', '')
    // log(`[info] package.json loc : ${packagejsonloc}`);
    // step-x-e: get packagejson loc

    // step-x-s: get packagejson text
    // get packagejson
    jsonstream.init(packagejsonloc)
    packagejson = await jsonstream.read({})
    // textfileio.init(packagejsonloc);
    // let text = await textfileio.read();
    // step-x-e: get packagejson text

    // step-x-s: get index in packagejson
    // feat: support order module -> main
    let files
    // feat: set main first
    files = [packagejson.main, packagejson.module]
    // feat: set module first\nwhen packagejson.type == "module"
    if (packagejson.type === 'module') {
        files = [packagejson.module, packagejson.main]
    }
    // feat: support order module -> main -> jsnext -> browser
    // files=getIndexByOrder(packagejson,"module -> main")
    // files = getIndexByOrder(packagejson,"module -> main -> jsnext -> browser");
    files = [...files, ...getIndexByOrder(packagejson, 'jsnext -> browser')]

    files = files.filter(v => v)
    if (!endswithsep) {
        files = files.map(v => `/${v}`)
    }
    // step-x-e: get index in packagejson

    return files
}

// alias-help

export { getIndexByOrder, getPackageIndexFiles, getFormatFromExtension, wrapTextFileToEsmModule }
