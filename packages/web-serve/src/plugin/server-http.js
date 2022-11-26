/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

import { createServer } from 'http'
import {
    getPorts,
    setResponseData,
    setResonseToJson,
    getResponseData,
    getResponseHeader,
    getResponseDefaultData
} from './server-helps'

const { log } = console
// desc: create http server
// desc: set header
// desc: set response data

// import config from '../config/server'
// let pro = config.pro

// const args = process.argv.slice(2)

function makeHttpServer(options = {}) {
    const option = {
        ...options
    }
    const { ports, host } = option
    const [tcpPort, httpsPort, httpPort] = getPorts(ports)

    const server = createServer()

    let header
    let data
    server.on('request', (req, res) => {
        setResonseToJson()
        setResponseData(getResponseDefaultData(httpPort, host))
        // set head
        res.writeHead(200, getResponseHeader())
        // set data
        res.write(getResponseData())
        res.end()
    })
    server.listen(httpPort, host)
    // server.listen(3001,"0.0.0.0");
    // server.listen(80,"0.0.0.0");
    server.on('error', e => {
        log(e)
    })
}
export { makeHttpServer }
