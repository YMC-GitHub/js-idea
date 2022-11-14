/* eslint-disable no-unused-vars,prefer-const */
/* eslint-disable no-param-reassign,no-unreachable-loop */
/* eslint-disable no-return-await,consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable  no-shadow */
/* eslint-disable  no-await-in-loop,no-restricted-syntax */

import { join as joinPath, parse as parsePath, extname, resolve as resolvePath, sep as pathSep } from 'path'
import { URL, pathToFileURL } from 'url'
// import createLoader from './esm-loader-create.js'
import { jsonstream } from '@ymc/json-stream-io'
import { textstream } from '@ymc/text-stream-io'
import compareVersion from '@ymc/compare-version'
import loadAlias from './helper/load-alias'
import resolveAlias from './helper/resolve-alias'

const { log } = console

const aliasmap = loadAlias()
const { extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue'] } = aliasmap
const fileProtocol = 'file://'
const isPathPattern = /^\.{0,2}\//
const tsExtensionsPattern = /\.([cm]?ts|[tj]sx)$/
const supportsNodePrefix =
    compareVersion(process.version, '14.13.1') >= 0 || compareVersion(process.version, '12.20.0') >= 0

function debug(msg) {
    if (debug.enable) {
        log(msg)
    }
}
debug.enable = false

export async function resolve(specifier, context, next, recursiveCall) {
    debug('[info] compact node lib expression')
    // feat: compact node lib expression
    // desc: del node lib prefix
    // Added in v12.20.0
    // https://nodejs.org/api/esm.html#esm_node_imports
    if (!supportsNodePrefix && specifier.startsWith('node:')) {
        specifier = specifier.slice(5)
    }
    // console.log(specifier);

    debug('[info] reslove alias')
    // feat: reslove alias
    // todo: extract to esm-loader-alias or esm-reslover-alias
    // const aliasmap = await loadAlias()
    specifier = resolveAlias(specifier, aliasmap)
    // log(`[info] info url ${specifier}`);
    // log(specifier);

    debug('[info] reslove dirs')
    // feat: support reslove diretory
    // If directory, can be index.js, index.ts, etc.
    if (specifier.endsWith('/')) {
        return await tryDirectory(specifier, context, next)
    }

    // todo: support reslove ts
    // const isPath = specifier.startsWith(fileProtocol) || isPathPattern.test(specifier)
    // if (
    //     tsconfigPathsMatcher &&
    //     !isPath && // bare specifier
    //     !context.parentURL?.includes("/node_modules/")
    // ) {
    //     const possiblePaths = tsconfigPathsMatcher(specifier);
    //     for (const possiblePath of possiblePaths) {
    //         try {
    //             return await resolve(
    //                 pathToFileURL(possiblePath).toString(),
    //                 context,
    //                 defaultResolve
    //             );
    //         } catch {}
    //     }
    // }

    // /**
    //  * Typescript gives .ts, .cts, or .mts priority over actual .js, .cjs, or .mjs extensions
    //  */
    // if (tsExtensionsPattern.test(context.parentURL)) {
    //     const tsPath = resolveTsPath(specifier);

    //     if (tsPath) {
    //         try {
    //             return await resolve(tsPath, context, defaultResolve, true);
    //         } catch (error) {
    //             const { code } = error;
    //             if (
    //                 code !== "ERR_MODULE_NOT_FOUND" &&
    //                 code !== "ERR_PACKAGE_PATH_NOT_EXPORTED"
    //             ) {
    //                 throw error;
    //             }
    //         }
    //     }
    // }

    debug('[info] reslove next')
    // feat:compose next, recursive resovle dirs and exts
    let resolved
    try {
        resolved = await next(specifier, context, next)
    } catch (error) {
        if (error instanceof Error && !recursiveCall) {
            if (error.code === 'ERR_UNSUPPORTED_DIR_IMPORT') {
                debug('[info] recursive reslove dirs')
                return await tryDirectory(specifier, context, next)
            }

            // feat: support reslove extentions
            if (error.code === 'ERR_MODULE_NOT_FOUND') {
                debug('[info] recursive reslove exts')

                return await tryExtensions(specifier, context, next)
            }
        }
        throw error
    }

    // desc: get format
    // feat: set format for json file
    if (resolved.url.endsWith('.json')) {
        return {
            ...resolved,
            format: 'json'
        }
    }

    // feat: set format for module , commonjs or other
    let { format } = resolved
    if (resolved.url.startsWith(fileProtocol)) {
        // ??
        // format = getFormatFromExtension(resolved.url) ?? format
        const tmpformat = getFormatFromExtension(resolved.url)
        format = tmpformat || format
    }
    // console.log(resolved, format);
    return {
        ...resolved,
        format
    }
}

/**
 * try exts - resolve exts
 * @param {string} url
 * @param {{}} context
 * @param {()=>{}} next
 * @returns
 */
async function tryExtensions(url, context, next) {
    // feat: use builtin exts
    const builtinExts = ['.js', '.json', '.ts', '.tsx', '.jsx']
    // feat: use exts from context
    const { extensions = builtinExts } = context
    // feat: use resolve from context (todo)
    // const {reslove} = context
    // feat: use next as resolve (todo)

    let res
    let error
    for (const extension of extensions) {
        try {
            debug(`[info] try reslove ${url + extension}`)
            // res= await resolve(url + extension, context, next, true)
            res = await next(url + extension, context, next)
            return res
        } catch (_error) {
            if (error === undefined) {
                const { message } = _error
                _error.message = _error.message.replace(`${extension}'`, "'")
                _error.stack = _error.stack.replace(message, _error.message)
                error = _error
            }
        }
    }
    throw error
}

/**
 * try dirs - resolve dirs
 * @param {string} url
 * @param {{}} context
 * @param {()=>{})} next
 * @returns
 */
async function tryDirectory(url, context, next) {
    let res
    // feat: reslove packagejson index file in dirs
    res = await tryPackagejsonIndex(url, context, next)
    if (res) {
        return res
    }

    // feat: reslove index file in dirs

    // feat: set default index to index
    let defalutIndex = 'index'

    // feat: set default index to index.esm
    // defalutIndex = 'index.esm'
    const appendIndex = url.endsWith('/') ? defalutIndex : `/${defalutIndex}`

    try {
        // feat: try extensions in diretory
        res = await tryExtensions(url + appendIndex, context, next)
        return res
    } catch (error) {
        const { message } = error
        error.message = error.message.replace(`${appendIndex.replace('/', pathSep)}'`, "'")
        error.stack = error.stack.replace(message, error.message)
        throw error
    }
}

/**
 * try packagejson - resolve module,main,browser, in package.json
 * @param {string} url
 * @param {{}} context
 * @param {()=>{}} next
 * @returns
 */
async function tryPackagejsonIndex(url, context, next) {
    debug('[info] try resolve module,main,browser and other key in package.json')
    let res
    const files = await getPackageIndexFiles(url, context, next)
    let error
    if (files.length < 0) return res

    for (const file of files) {
        try {
            // log(url + file);
            debug(`[info] try resolve ${url + file}`)
            // res = await resolve(url + file, context, next, true)
            res = await next(url + file, context, next)
            return res
        } catch (_error) {
            if (error === undefined) {
                const { message } = _error
                _error.message = _error.message.replace(`${file}'`, "'")
                _error.stack = _error.stack.replace(message, _error.message)
                error = _error
            }
            throw error
        }
    }
}
/**
 * get pacakgejson index files with order
 * @param {string} url
 * @param {{}} context
 * @param {()=>{}} defaultResolve
 * @returns
 */
async function getPackageIndexFiles(url, context, defaultResolve) {
    const { packagejsonIndexOrder = 'jsnext -> browser' } = context
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

    // get packagejson loc
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
    // if(!packagejsonloc.startsWith(fileProtocol)) return []
    packagejsonloc = packagejsonloc.replace('file:///', '')
    // log(`[info] package.json loc : ${packagejsonloc}`);

    // get packagejson
    jsonstream.init(packagejsonloc)
    packagejson = await jsonstream.read({})
    // textfileio.init(packagejsonloc);
    // let text = await textfileio.read();

    // get index in packagejson
    // feat: support order module -> main
    let files
    // feat: set main first
    files = [packagejson.main, packagejson.module]
    // feat: set module first\nwhen packagejson.type == "module"
    if (packagejson.type === 'module') {
        files = [packagejson.module, packagejson.main]
    }
    // feat: support order module -> main -> jsnext -> browser
    // files=getIndexByOrder("module -> main")
    // files = getIndexByOrder("module -> main -> jsnext -> browser");
    files = [...files, ...getIndexByOrder(packagejsonIndexOrder)]

    files = files.filter(v => v)
    if (!endswithsep) {
        files = files.map(v => `/${v}`)
    }
    return files

    function getIndexByOrder(order = 'module -> main', sepreg = / ?-> ?/) {
        return order
            .split(sepreg)
            .filter(v => v)
            .map(v => packagejson[v])
            .filter(v => v)
    }
}

/**
 * esm loader
 * @param {*} url
 * @param {*} context
 * @param {*} defaultLoad
 * @returns
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

    // feat: run custom load
    // feat: wrap text file esm module
    const txtExt = ['.md', '.css', '.html', '.htm', '.svg']
    if (txtExt.some(ext => checkUrl.endsWith(ext))) {
        // console.log(url);
        return await wrapTextFileToEsmModule(url)
    }
    // if (!ext) {
    //     return defaultLoad(checkUrl, context, defaultLoad);
    // }

    // feat: run default load
    return defaultLoad(url, context, defaultLoad)
}
// https://foxeyes.github.io/cv/pulse/custom_node_esm_loader.html

/**
 * wrap text file to es module
 * @param {*} url
 * @returns
 */
async function wrapTextFileToEsmModule(url) {
    // console.log(new URL(url))
    // const content = await readFile(new URL(url))
    textstream.init(new URL(url))
    const content = await textstream.read('')
    // log(content)
    return {
        format: 'module',
        source: `export default ${JSON.stringify(content.toString())};`,
        shortCircuit: true
    }
}

/**
 * get format from path extension
 * @param {string|undefined} filePath
 * @returns
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

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/esm-loader-alias/src/index.js
