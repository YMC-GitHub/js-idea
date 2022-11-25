import { baseParam } from '@ymc/cli-preset-param'

function param() {
    return [
        ...baseParam(),
        {
            name: '--out',
            type: 'string',
            value: 'gitlog-info.shim.tmp.json',
            desc: 'the file path of output'
        },
        {
            name: '--n',
            type: 'number',
            value: 1,
            desc: 'the number of git log'
        }
    ]
}
export default param
