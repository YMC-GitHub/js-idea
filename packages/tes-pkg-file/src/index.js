import { baseParam } from '@ymc/cli-preset-param'
import { getBuiltinConfig, getCliFlags } from '@ymc/cli-param'
import { log, execOpts, runcmdWithState, setTaskState } from './helps'
// import { cliOptionHelp } from '@ymc/cli-option'
// import parserArgs from '@ymc/nano-parse'
// import { ycsRunner } from '@ymc/cli-runner'
// import { exec, execOpts, setExecOptsForIconv } from '@ymc/run-bash'
// import iconv from 'iconv-lite'

function param() {
    return [
        ...baseParam(),
        {
            name: '--pkg-loc',
            type: 'string',
            value: './packages/noop',
            desc: 'the location of pkg'
        },
        {
            name: '--jest-cmd',
            type: 'string',
            value: 'npx jest', // './node_modules/.bin/jest' | 'npx jest'
            desc: 'the cmd of jest'
        },
        {
            name: '--jest-cnf-loc',
            type: 'string',
            value: 'test/unit/jest.config.json',
            desc: 'the location of jest config'
        },
        {
            name: '--run-cmd',
            type: 'boolean',
            value: false,
            desc: 'run jest cmd or not'
        }
    ]
}
async function main(options = {}) {
    const option = {
        // help:false,
        ...getBuiltinConfig(param()),
        ...getCliFlags(options)
    }
    log(`[task] run unit test for pkg ${option.pkgLoc}`)
    const cmd = `${option.jestCmd} ${option.pkgLoc} --config=${option.jestCnfLoc} --color --passWithNoTests`
    if (option.runCmd) {
        // setExecOptsForIconv(iconv, execOpts) //for dbg when error
        const state = await runcmdWithState(cmd, execOpts)
        await setTaskState({
            pkgLoc: option.pkgLoc,
            key: 'tes_state',
            state,
            storeAt: 'pkgs-info.json'
        })
    }
    return cmd
}
// get usage with @ycs/cli-option
// main.usage = cliOptionHelp.param(param()).usage().replace(`{ns}`, `runjest`)

// parse cli args with nano-parser then run main
// main(parserArgs(process.argv))

// run main trough @ycs/cli-runner
// ycsRunner.ns(`runjest`).version(`1.0.0`).nanoparse(parserArgs).entry(main).run(process.argv)

export { param, main }
