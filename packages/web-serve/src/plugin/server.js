/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

import { makeHttpServer } from './server-http'
import { makeHttpsServer } from './server-https'
import { proxyHttp } from './server-net'
import config from '../config/server'

const { log } = console
// const args = process.argv.slice(2)
function main(options) {
    const { pro } = config
    makeHttpServer(pro)
    makeHttpsServer(pro)
    proxyHttp(pro)
}
main()
//  node --no-warnings --loader ./scr/lib/esm-loader.js  packages/web-serve/src/plugin/server.js
