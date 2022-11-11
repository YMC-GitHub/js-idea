import { fileURLToPath } from 'node:url'
import path from 'node:path'
import http from 'node:http'
import cp from 'node:child_process'
import fs from 'node:fs/promises'
const { log } = console

const loader = function (specifier) {
    // const url = path.resolve(process.cwd(), specifier)
    const url = new URL(specifier, import.meta.url).href
    return code => {
        // let dir = path.dirname(fileURLToPath(url))
        let dir = path.dirname(fileURLToPath(import.meta.url))
        let file = path.join(dir, './run.js')
        let arg = Buffer.from(code).toString('base64')
        let child = cp.fork(file, [arg], {
            cwd: process.cwd(),
            execArgv: [`--experimental-loader=${url}`, '--no-warnings']
        })
        return new Promise((resolve, reject) => {
            child.on('message', data => resolve(data))
        })
    }
}
const main = async () => {
    const run = loader('./loaders/text.js')
    let result = await run(`
    export { default } from './files/string.md'
    `)
    // log(result)
    return result
}
// main()
test(`esm-loader-text-file`, async () => {
    let res = await main()
    expect(res).toBe('txt')
})
// Cannot use 'import.meta' outside a module , jest
// https://github.com/facebook/jest/issues/12183
// babel-plugin-transform-import-meta
// node scr/3.dep.add.babel.js
//

// node packages/esm-loader-text-file/test/test.js
