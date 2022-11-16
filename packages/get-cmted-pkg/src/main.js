import { exec, execOpts, jsonstream } from './helps'

const { log } = console

/**
 * get loginfo function
 * @param {boolean} enable
 * @returns {()=>void} a function to log info
 */
function getLogInfo(enable) {
    return function (...msg) {
        if (enable) {
            log(...msg)
        }
    }
}
async function main(options = {}) {
    const option = {
        out: `pkgs-cmted.tmp.json`,
        packageslocReg: /^packages\//,
        logInfo: false,
        logTask: false,
        ...options
    }
    const { packageslocReg } = option

    const loginfo = getLogInfo(option.logInfo)
    const logtask = getLogInfo(option.logTask)

    logtask(`[task] read commited pkgs from gitlog`)
    loginfo(`[info] read commited pkgs`)
    let pkgcmt
    pkgcmt = await rumcmd('git ls-tree --full-tree --name-only -r HEAD', execOpts)
    pkgcmt = pkgcmt.split(/\r?\n/).filter(v => v)
    pkgcmt = await getCmtedVcPkgNameInLoc({ files: pkgcmt, for: 'pkg-loc', packageslocReg })
    log(pkgcmt.join('\n'))

    loginfo(`[info] save commited pkgs`)

    let loc = option.out
    jsonstream.init(loc)
    await jsonstream.write(pkgcmt)
    loginfo(`[info] out: ${loc}`)
    return pkgcmt
}
async function rumcmd(cmd, execOpts) {
    const { stdout, stderr } = await exec(cmd, execOpts)
    return stdout
}
/**
 * get pkg name of version control (vc) - mono repo -cmted
 * @param {{packageslocReg:regexp,pathSplit:string}} options
 * @returns {string[]}
 */
async function getCmtedVcPkgNameInLoc(options = {}) {
    const option = {
        EOFReg: /\r?\n/,
        pathSplit: '/',
        packageslocReg: /^packages\//,
        files: '',
        for: 'pkg-name',
        ...options
    }

    let { files } = option
    if (!files) return []
    // only in package loc
    files = files.filter(v => option.packageslocReg.test(v))

    const sep = option.pathSplit
    // get name or loc
    // eg. file=packages/noop/xx ; name=noop;loc=packages/noop;
    switch (option.for.toLowerCase()) {
        case 'pkg-loc':
            files = files.map(v => v.split(sep).slice(0, 2).join(sep)).filter(v => v)
            break
        case 'pkg-name':
        default:
            files = files.map(v => v.split(sep)[1]).filter(v => v)
            break
    }

    // del dup
    files = [...new Set(files)]
    return files
}
export default main
