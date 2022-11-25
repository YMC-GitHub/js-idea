/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */

import { exec, execOpts } from '@ymc/run-bash'
import { writeTpl } from '@ymc/render-tpl'
import { store as gitlog } from '@ymc/git-commit-msg-read'
// import { parse as parsemsg } from '@ymc/git-commit-msg-parse'
import { ChangelogStyle } from '@ymc/changlog-style'
import { changelogfile as changelogio } from '@ymc/changlog-file-io'
import { jsonstream, writeFileSync, readJsonSync, getLibNameFromPath, getPackagesLocFromPath } from './helps'
import render from './helper/render-cmted-msgs-to-pkg-changelog'
// import { rmSync } from 'fs'
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
        cmtedMsgsLoc: 'gitlog-info.shim.tmp.json',
        cmtedPkgsLoc: 'pkgs-cmted.tmp.json',
        changlogLoc: 'CHANGELOG.md',
        outPkgs: true,
        logInfo: false,
        logTask: false,
        ...options
    }

    const loginfo = getLogInfo(option.logInfo)
    const logtask = getLogInfo(option.logTask)

    let loc = option.out

    logtask('[task] filter msg for pkg')
    logtask('[task] make changelog with tpl')

    loginfo('[info] read cmted msgs')
    let cmtedmsgs
    loc = option.cmtedMsgsLoc
    jsonstream.init(loc)
    cmtedmsgs = await jsonstream.read([])
    cmtedmsgs = cmtedmsgs.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date)
    })
    loginfo(`[info] src: ${loc}`)
    // log(cmtedmsgs)

    let cmtedpkgs
    loginfo('[info] read cmted pkgs')
    loc = option.cmtedPkgsLoc
    jsonstream.init(loc)
    cmtedpkgs = await jsonstream.read([])
    loginfo(`[info] src: ${loc}`)
    cmtedpkgs = cmtedpkgs.map(v => ({
        loc: v
    }))
    // log(cmtedpkgs)

    loginfo('[info] write changelog')
    let pkgslogs = []
    pkgslogs = cmtedpkgs.map(v => {
        // log(v.name, v.loc)
        // res.push(render(data, { wkd: v.loc }))
        const txt = render(cmtedmsgs, { wkd: v.loc })
        pkgslogs.push(txt)
        return { loc: v.loc, data: txt }
    })
    if (option.outPkgs) {
        // loginfo('[info] write packages/xx/changelog.md')
        pkgslogs.forEach(v => {
            let txt = v.data
            // txt = setTableStyle(txt)
            writeFileSync(`${v.loc}/${option.changlogLoc}`, txt)
            log(`[info] out: ${v.loc}/${option.changlogLoc}`)
            // rmSync(`${v.loc}/CHANGELOD.md`)
        })
    }
    pkgslogs = pkgslogs.filter(v => v)
    // pkgslogs = pkgslogs.join(`\n`)
    // log(pkgslogs)
    pkgslogs = pkgslogs.map(v => v.data).join('\n\n')

    // pkgslogs = setTableStyle(pkgslogs)
    // loginfo('[info] write root changelog')
    loc = option.changlogLoc
    changelogio.init(loc)
    loginfo(`[info] out: ${loc}`)
    await changelogio.write(pkgslogs)
    // rmSync(`CHANGELOD.md`)
}

export default main
