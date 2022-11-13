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
    // if ((list.length = 1)) return list.join(sep)
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
    const reg = /^\/|(\\\\)|([A-Z]:)|([a-z]:)/
    ///^\/|(\\\\)|([A-Z]:)|([a-z]:)/
    if (!wkd) return false
    return reg.test(wkd)
}
/**
 * mock node.js path.parse
 * @param {string} wkd
 * @returns {{root:string,dir:string,base:string,name:string,ext:string}}
 */
function parse(wkd) {
    let root, dir, base, name, ext
    base = basename(wkd)
    ext = extname(base)
    name = ext ? basename(wkd, ext) : base
    root = getRoot(wkd)
    dir = wkd.replace(new RegExp(`${base}$`, 'i'), '')
    // not ends with / for unix when dir.length !==1
    if (dir.length !== 1) dir = dir.replace(/\/$/, '')

    return { root, dir, base, name, ext }
    /**
     *
     * @param {string} dir
     * @returns {string}
     */
    function getRoot(dir) {
        if (!isAbsolute(dir)) return ''
        let res = ''
        // res = dir.replace(/(\/?\/)|\\.*/gi, '')
        res = dir.split(/(\/?\/)|\\/)[0]
        // win
        if (res) {
            let tmp = `${res}/`
            if (dir.indexOf(tmp) === 0) return tmp
            return `${res}\\`
        }
        // unix
        return '/'
        // if (!res) return '/'
    }
}
// todo:()
// normalize,reslove,relative
export { dirname, basename, extname, format, isAbsolute, join, parse }
