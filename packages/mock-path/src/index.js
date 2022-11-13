/* eslint-disable prefer-const */
// https://nodejs.org/api/path.html

// const path = {}
// path.sep = '/'
// let defSep = '/'

/**
 * mock node.js path.dirname
 * @param {string} wkd
 * @returns {string}
 */
function dirname(wkd) {
    const sep = dirname.sep ? dirname.sep : '/'
    const list = wkd.split(/\/?\\|\//)
    return list.slice(0, list.length - 1).join(sep)
}

/**
 * mock node.js path.basename
 * @param {string} wkd
 * @param {string} [suffix] an optional suffix to remove
 * @returns {string}
 */
function basename(wkd, suffix) {
    const list = wkd.split(/\/?\\|\//)
    const res = list[list.length - 1]
    if (!suffix) return res
    return res.replace(new RegExp(`${suffix}$`), '')
}

/**
 * mock node.js path.join (expect join.sep ='/')
 * @param {string[]} likepath
 * @returns {string}
 */
function join(...likepath) {
    const sep = join.sep ? join.sep : '/'
    const list = [...likepath]
        .map(v => v.split(/\/?\\|\//))
        .flat(Infinity)
        .filter(v => v)
    return list.join(sep)
}
/**
 * mock node.js path.extname
 * @param {string} wkd
 * @returns {string}
 */
function extname(wkd) {
    const reg = /(.*)?\./gi
    if (!reg.test(wkd)) return ''
    const res = wkd.trim().replace(/(.*)?\./gi, '')
    return res ? `.${res}` : ''
}
// /**@typedef {string|null|undefined} ps */
/**
 * mock node.js path.format
 * @param {{root:string,dir:string,base:string,name:string,ext:string}} obj
 * @returns {string}
 */
function format(obj) {
    let { root, dir, base, name, ext } = obj
    const sep = format.sep ? format.sep : '/'
    // add dot when ext
    // if (ext) {
    //     let ext = ext.trim()
    //     if (ext.indexOf('.') !== 0) {
    //         ext = `.${ext}`
    //     }
    // }
    if (ext) ext = ext.replace(/^ ?\.? ?/, '.')

    if (!base) {
        base = `${name}${ext}`
    }
    if (dir) {
        return `${dir}${sep}${base}`
    }
    if (root) {
        return `${root}${base}`
    }
    return base
}

/**
 * mock node.js path.isAbsolute
 * @param {string} wkd
 * @returns {boolean}
 */
function isAbsolute(wkd) {
    const reg = /^\/|(\\\\)|([A-Z]:)/
    if (!wkd) return false
    return reg.test(wkd)
}
// todo:()
// normalize,parse,reslove,relative
export { dirname, basename, extname, format, isAbsolute, join }
