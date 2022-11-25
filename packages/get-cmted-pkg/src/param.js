import { baseParam } from '@ymc/cli-preset-param'

function param() {
    return [
        ...baseParam(),
        {
            name: '--packages-loc-reg',
            type: 'regexp',
            value: undefined, /// ^packages\//,
            desc: 'the regexp of packages location'
        },
        {
            name: '--out',
            type: 'string',
            value: 'pkgs-cmted.tmp.json',
            desc: 'the file path of output'
        },
        {
            name: '--log-info',
            type: 'boolean',
            value: false,
            desc: 'set true to log [info] msg'
        },
        {
            name: '--log-task',
            type: 'boolean',
            value: false,
            desc: 'set true to log [task] msg'
        }
    ]
}
export default param
