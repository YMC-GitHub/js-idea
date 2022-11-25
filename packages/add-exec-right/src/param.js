import { baseParam } from '@ymc/cli-preset-param'

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
export default param
