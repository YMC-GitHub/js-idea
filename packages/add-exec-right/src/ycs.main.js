/* eslint-disable no-unused-vars */
import { getMainOptions } from '@ymc/cli-param'
import param from './param'
import handle from './main'

async function main(options = {}) {
    const option = getMainOptions(param(), options)
    // log(option, options)
    // process.exit(0)
    return handle(option)
}
export { param, main }
// xx -> xx.main -> xx.cli
