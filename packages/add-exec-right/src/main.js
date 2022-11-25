/* eslint-disable prefer-const,no-unused-vars */
/* eslint-disable func-names */

import { readdirSync, statSync } from 'fs'
import { exec, execOpts } from '@ymc/run-bash'
// import { getBuiltinConfig, getCliFlags } from '@ymc/cli-param'
import promiseAll from '@ymc/promise-all'
// import param from './param'

// refer:
// read-directory
// get-cmted-pkgs
// gen-change-log
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
        binPath: 'bin',
        ext: '.js,.sh',
        options
        // ...getBuiltinConfig(param()),
        // ...getCliFlags(options)
    }

    const loginfo = getLogInfo(option.logInfo)
    const logtask = getLogInfo(option.logTask)

    logtask('[task] add exec rights to files')
    loginfo('[info] read file list')
    const dir = option.binPath
    let list = readdirSync(dir)
        .map(f => `${dir}/${f}`)
        .filter(f => statSync(f).isFile())

    loginfo('[info] filter file list when ext passed')
    if (option.ext) {
        const { ext } = option
        const extReg = ext.split(',').map(ex => new RegExp(`${ex}$`))
        list = list.filter(f => extReg.some(reg => reg.test(f)))
    }

    // feat: add file head ? (todo)
    // (may-be-good: extract to a new lib or cli, to keep this to be small)
    // if(option.fileHead){

    // }
    // no-shadow
    const genTaskHandle = opt => {
        // add exec right to file
        const addExecRightToFile = async () => {
            let res
            let cmd = `chmod +x ${opt.file}`
            loginfo(`[info] run: ${cmd}`)
            res = await exec(cmd, execOpts)
            if (opt.updateByGit) {
                cmd = `git update-index --chmod=+x ${opt.file}`
                loginfo(`[info] run: ${cmd}`)
                res = await exec(cmd, execOpts)
            }
            return res
        }
        // return addExecRightToFile()
        return addExecRightToFile
    }

    loginfo('[info] gen task handle')
    let prs
    let tasks
    // gen task list - task - with zero fun args
    tasks = list.map(f => genTaskHandle({ ...option, file: f }))

    // loginfo(`[info] run task handle`)
    prs = await promiseAll(tasks, 3)
    // log(prs);

    let res
    // info file rights in loc
    if (!option.verbose) {
        res = await exec(`ls ${dir} -l`, execOpts)
        log(res)
    }
}

// const run = async () => {
//     await main();
// };
// run();

export default main
// node bin/add-exec-right.js -h
// https://dev.to/ku6ryo/chmod-x-by-git-on-windows-5fjd
// https://m.imooc.com/wenda/detail/417375
