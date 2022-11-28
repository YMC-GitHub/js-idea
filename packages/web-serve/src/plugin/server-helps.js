/* eslint-disable max-len */

import { createServer as createHttpServer } from 'http'

import { createServer as createHttpsServer } from 'https'
import { readFileSync } from 'fs'

const { log } = console
let data = {}
const header = {}

function json2string(json) {
    return JSON.stringify(json, null, 0)
}
function setResonseToJson() {
    header['content-type'] = 'application/json'
}
function getResponseData() {
    let res
    const type = header['content-type']
    switch (type) {
        case 'application/json':
            res = json2string(data)
            break

        default:
            res = data
            break
    }
    return res
}
function getResponseHeader() {
    return header
}
function setResponseData(value) {
    data = value
}
function getResponseDefaultData(host, port) {
    return { host, port, date: new Date() }
}
function getPorts(ports) {
    const { tcp, https, http } = ports
    return [tcp, https, http]
}
function addKeySuffix(ports, suff = 'Port') {
    // const { tcp, https, http } = ports
    const res = {}
    Object.keys(ports).forEach(v => {
        res[`${v}${suff}`] = ports[v]
    })
    return res
}

function makeHttpServer(options, app) {
    const option = {
        ...options
    }
    const { ports, host } = option
    // const [tcpPort, httpsPort, httpPort] = getPorts(ports)
    const { httpPort } = addKeySuffix(ports, 'Port')
    const server = app ? createHttpServer(app) : createHttpServer()
    server.listen(httpPort, host, () => log(`app ${host} listening on ${httpPort}!`))
    return server
}
function makeHttpsServer(options, app) {
    const option = {
        ...options
    }
    const { ports, host, ssl } = option
    // const [tcpPort, httpsPort, httpPort] = getPorts(ports)
    const { httpsPort } = addKeySuffix(ports, 'Port')

    const sslOption = {
        key: readFileSync(`./${ssl}-key.pem`),
        cert: readFileSync(`./${ssl}.pem`),
        ca: readFileSync('./ca.pem')
    }

    const server = app ? createHttpsServer(sslOption, app) : createHttpsServer(sslOption)
    // serveDefault(server,httpsPort,host)
    server.listen(httpsPort, host, () => log(`app ${host} listening on ${httpsPort}!`))
    return server
}

function serveDefault(server, port, host) {
    server.on('request', (req, res) => {
        setResonseToJson()
        setResponseData(getResponseDefaultData(port, host))
        // set head
        res.writeHead(200, getResponseHeader())
        // set data
        res.write(getResponseData())
        res.end()
    })
}
// serve json
// serve favicon
// refs:
// https://github.com/expressjs/serve-favicon/blob/master/index.js
// https://github.com/dominicegginton/koa-icon/blob/main/lib/index.js
// https://github.com/tinyhttp/favicon/blob/master/src/index.ts

// serve html
export {
    getPorts,
    addKeySuffix,
    setResonseToJson,
    setResponseData,
    getResponseData,
    getResponseDefaultData,
    getResponseHeader,
    makeHttpServer,
    makeHttpsServer,
    serveDefault
}
