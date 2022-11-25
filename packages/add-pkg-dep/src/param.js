import { baseParam } from '@ymc/cli-preset-param'

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
            name: '--pnpm-cmd',
            type: 'string',
            value: 'pnpm add --filter',
            desc: 'the cmd of npm'
        },
        {
            name: '--pkg-src-loc',
            type: 'string',
            value: 'src',
            undefined, // 'src'
            desc: 'the location of pkg source '
        }
    ]
}
export default param
