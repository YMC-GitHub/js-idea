/* eslint-disable prefer-const */
import { TextStream } from '@ymc/text-stream-io'
// import { getLogInfo } from '../helps'
// const log = getLogInfo(true)

async function main(options = {}) {
    const option = {
        fileHead: '#!/usr/bin/env node',
        ...options
    }
    // log(option)
    let text
    let head
    const textfileio = new TextStream()
    textfileio.init(option.loc)
    text = await textfileio.read('')
    text = text.split(/\r?\n/)
    ;[head] = text
    if (head) {
        if (!/^#!/i.test(head)) {
            switch (option.action) {
                case 'del':
                    text.shift()
                    break
                case 'add':
                default:
                    text.unshift(option.fileHead)
                    break
            }
        }
    }
    text = text.join('\n')
    textfileio.init(option.loc)
    await textfileio.write(text)
}
export default main
