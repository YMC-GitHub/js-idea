/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */

import { exec, execOpts } from '@ymc/run-bash'
import { writeTpl } from '@ymc/render-tpl'
import { store as gitlog } from '@ymc/git-commit-msg-read'
// import { parse as parsemsg } from '@ymc/git-commit-msg-parse'
import { changelogstyle } from '@ymc/changlog-style'
import { changelogfile as changelogio } from '@ymc/changlog-file-io'
import { jsonstream, readJsonSync, getLibNameFromPath, getPackagesLocFromPath } from './helps'

const { log } = console

async function main() {
    const args = getArgs()

    // cal cnf/var
    const wkd = args[0]
    let file
    let pkg

    let org
    let scope
    org = 'ymc'
    scope = org

    let data
    let loc
    let o
    // log('[task] update gitlog data')
    // log('[info] read gitlog')
    // gitlog.options.n = 1
    // data = await gitlog.parse()
    // // log(data)

    // log('[info] store gitlog')
    // loc = 'gitlog-info.shim.tmp.json'
    // jsonstream.init(loc)
    // o = await jsonstream.read([])
    // data.forEach(v => {
    //     if (!o.some(nv => nv.hash === v.hash)) {
    //         o.unshift(v)
    //     }
    // })

    // await jsonstream.write(o)
    // log(`[info] out: ${loc}`)

    log('[task] filter msg for pkg')
    log('[task] make changelog with tpl')

    const libname = getLibNameFromPath(wkd, { camelize: false })
    const libdir = getPackagesLocFromPath(wkd)
    // let cmds = definecmds(libname);
    // await runcmds(cmds);

    pkg = readJsonSync(`${libdir}/${libname}/package.json`, {})
    const { version } = { version: '0.0.1', ...pkg }

    const chanelogfile = `${libdir}/${libname}/CHANGELOG.md`

    log('[info] load changlog')
    changelogio.init(chanelogfile)
    await changelogio.read()
    const lastId = await changelogio.getLastCommitLabel()

    log('[info] read gitlog')
    // gitlog.options.n = 1
    // data = await gitlog.parse()
    loc = 'gitlog-info.shim.tmp.json'
    jsonstream.init(loc)
    data = await jsonstream.read([])

    // filter pkg
    // data = gitlog.filterInfoByFile(new RegExp(`${libdir}/${libname}/`, 'i'))
    const reg = new RegExp(`${libdir}/${libname}/`, 'i')
    data = data.filter(v => v.file.some(f => reg.test(f)))

    log('[info] filter since last commit id')
    data = gitlog.filterSinceLastChanglog(data, lastId)
    // filter:ignore docs
    // data = gitlog.filterIgnoreScope(data, docsReg);

    log('[info] ignore docs commits')
    data = data.filter(v => v.type !== 'docs')
    // only the latest
    // if (data.length > 0) data = data[0];

    log('[info] render new changlog')
    // get tpl and render
    changelogstyle.data = data
    changelogstyle.option = { style: 'table' }
    data = changelogstyle.render()
    // log(data);
    data = changelogstyle.writeTpl(data, {
        version,
        libname,
        repo: 'https://github.com/ymc-github/js-idea'
    })
    // log(data);
    if (data) {
        log(`[info] out: ${chanelogfile}`)
        await changelogio.write(data)
    }

    // tpl = `git add packages/{libname}/package.json packages/{libname}/CHANGELOG.md`;
    // cmd = writeTpl(tpl, { libname });
    // cmds.push(cmd);

    // log(`[info] git commit packages/{libname}`);
    // tpl = `git commit -m "docs({libname}): bump to {version}\nupdate version in package.json\nupdate CHANGELOG.md"`; //with angular style
    // cmd = writeTpl(tpl, { libname, version });
    // cmds.push(cmd);

    // tpl = 'git log --oneline'
    // cmd = writeTpl(tpl, {})
    // res = await rungit(cmd, execOpts)
    // log(res);
}
/**
 * get cli args and the first args is wkd
 * @param {string} def
 * @returns {string[]}
 */
function getArgs(def = 'packages/noop') {
    const args = process.argv.slice(2)
    if (args.length === 0) args[0] = def
    return args
}
// async function rungit(cmd, execOpts) {
//     const { stdout, stderr } = await exec(cmd, execOpts)
//     return stdout
// }

main()
// run as node script
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/gen-pkg-changelog/src/index.js
