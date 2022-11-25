/**
  * addExecRight v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import { readdirSync, statSync } from 'node:fs';
import { exec, execOpts } from '@ymc/run-bash';
import promiseAll from '@ymc/promise-all';
import { TextStream } from '@ymc/text-stream-io';

/* eslint-disable func-names */

const { log } = console;

/**
 * get loginfo function
 * @param {boolean} enable
 * @returns {()=>void} a function to log info
 */
function getLogInfo(enable) {
    return function (...msg) {
        if (enable) {
            log(...msg);
        }
    }
}

/* eslint-disable prefer-const */
// import { getLogInfo } from '../helps'
// const log = getLogInfo(true)

async function main$1(options = {}) {
    const option = {
        fileHead: '#!/usr/bin/env node',
        ...options
    };
    // log(option)
    let text;
    let head;
    const textfileio = new TextStream();
    textfileio.init(option.loc);
    text = await textfileio.read('');
    text = text.split(/\r?\n/)
    ;[head] = text;
    if (head) {
        if (!/^#!/i.test(head)) {
            switch (option.action) {
                case 'del':
                    text.shift();
                    break
                case 'add':
                default:
                    text.unshift(option.fileHead);
                    break
            }
        }
    }
    text = text.join('\n');
    textfileio.init(option.loc);
    await textfileio.write(text);
}

/* eslint-disable prefer-const,no-unused-vars */

// refer:
// read-directory
// get-cmted-pkgs
// gen-change-log
const logout = getLogInfo(true);
async function main(options = {}) {
    const option = {
        binPath: 'bin',
        ext: '.js,.sh',
        ...options
        // ...getBuiltinConfig(param()),
        // ...getCliFlags(options)
    };
    // logout(option)
    const loginfo = getLogInfo(option.logInfo);
    const logtask = getLogInfo(option.logTask);

    logtask('[task] add exec rights to files');
    loginfo('[info] read file list');
    const dir = option.binPath;
    let list = readdirSync(dir)
        .map(f => `${dir}/${f}`)
        .filter(f => statSync(f).isFile());

    loginfo('[info] filter file list when ext passed');
    if (option.ext) {
        const { ext } = option;
        const extReg = ext.split(',').map(ex => new RegExp(`${ex}$`));
        list = list.filter(f => extReg.some(reg => reg.test(f)));
    }

    // no-shadow
    const genTaskHandle = opt => {
        // add exec right to file
        const addExecRightToFile = async () => {
            // feat: add file head ? (todo)
            // (may-be-good: extract to a new lib or cli, to keep this to be small)
            if (opt.onFileHead) {
                await main$1({ loc: opt.file, ...(opt.fileHead ? { fileHead: opt.fileHead } : {}) });
            }

            let res;
            let cmd = `chmod +x ${opt.file}`;
            loginfo(`[info] run: ${cmd}`);
            res = await exec(cmd, execOpts);
            if (opt.updateByGit) {
                cmd = `git update-index --chmod=+x ${opt.file}`;
                loginfo(`[info] run: ${cmd}`);
                res = await exec(cmd, execOpts);
            }
            return res
        };
        // return addExecRightToFile()
        return addExecRightToFile
    };

    loginfo('[info] gen task handle');
    let tasks;
    // gen task list - task - with zero fun args
    tasks = list.map(f => genTaskHandle({ ...option, file: f }));

    // loginfo(`[info] run task handle`)
    await promiseAll(tasks, 3);
    // log(prs);

    let res;
    // info file rights in loc
    if (!option.verbose) {
        res = await exec(`ls ${dir} -l`, execOpts);
        logout(res);
    }
}
// node bin/add-exec-right.js -h
// https://dev.to/ku6ryo/chmod-x-by-git-on-windows-5fjd
// https://m.imooc.com/wenda/detail/417375

export { main as default };
