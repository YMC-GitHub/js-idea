/**
  * addExecRight v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import { readdirSync, statSync } from 'node:fs';
import { exec, execOpts } from '@ymc/run-bash';
import { baseParam } from '@ymc/cli-preset-param';
import { getBuiltinConfig, getCliFlags } from '@ymc/cli-param';
import promiseAll from '@ymc/promise-all';

/* eslint-disable prefer-const,no-unused-vars */
const { log } = console;

function param() {
    return [
        ...baseParam(),
        {
            name: '-p,--bin-path',
            type: 'string',
            value: 'bin',
            desc: 'the location of bin path'
        },
        {
            name: '--ext',
            type: 'string',
            value: '.js,.sh',
            desc: 'only for matched file extention'
        },
        {
            name: '--update-by-git',
            type: 'boolean',
            value: false,
            desc: 'run git update-index --chmod=+x xx or not'
        },
        {
            name: '--check-git',
            type: 'boolean',
            value: false,
            desc: 'check if git init'
        },
        {
            name: '--verbose',
            type: 'boolean',
            value: false,
            desc: 'info file right info or not'
        },
        {
            name: '--file-head',
            type: 'string',
            value: '', // #!/usr/bin/env node # default-file-head
            desc: 'add file head, custom file head'
        }
    ]
}

// uni-cli-and-lib - cli and lib use the same code

async function main(options = {}) {
    const option = {
        // help:false,
        ...getBuiltinConfig(param()),
        // ...options,
        ...getCliFlags(options)
    };

    const dir = option.binPath;
    let list = readdirSync(dir)
        .map(f => `${dir}/${f}`)
        .filter(f => statSync(f).isFile());

    if (option.ext) {
        const { ext } = option;
        const extReg = ext.split(',').map(ex => new RegExp(`${ex}$`));
        list = list.filter(f => extReg.some(reg => reg.test(f)));
    }

    // feat: add file head ? (todo) (advice: extract to a new lib or cli, to keep this to be small)
    // if(option.fileHead){

    // }
    // no-shadow
    const genTaskHandle = opt => {
        // add exec right to file
        const addExecRightToFile = async () => {
            let res;
            let cmd = `chmod +x ${opt.file}`;
            log(`[info] run: ${cmd}`);
            res = await exec(cmd, execOpts);
            if (opt.updateByGit) {
                cmd = `git update-index --chmod=+x ${opt.file}`;
                log(`[info] run: ${cmd}`);
                res = await exec(cmd, execOpts);
            }
            return res
        };
        // return addExecRightToFile()
        return addExecRightToFile
    };
    let tasks;
    // gen task list - task - with zero fun args
    tasks = list.map(f => genTaskHandle({ ...option, file: f }));

    //  promise all way 5
    await promiseAll(tasks, 3);
    // log(prs);

    let res;
    // info file rights in loc
    if (!option.verbose) {
        res = await exec(`ls ${dir} -l`, execOpts);
        log(res);
    }
}
// node bin/add-exec-right.js -h
// https://dev.to/ku6ryo/chmod-x-by-git-on-windows-5fjd
// https://m.imooc.com/wenda/detail/417375

export { main, param };
