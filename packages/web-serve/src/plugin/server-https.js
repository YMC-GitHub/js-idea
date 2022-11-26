/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import { createServer } from 'https'
import { readFileSync } from 'fs'
import {
    getPorts,
    setResponseData,
    setResonseToJson,
    getResponseData,
    getResponseHeader,
    getResponseDefaultData
} from './server-helps'
// https://stackoverflow.com/questions/8355473/listen-on-http-and-https-for-a-single-express-app

const { log } = console
// import config from '../config/server'
// let pro = config.pro

// feat: enable https
// feat: enable http
// feat: enable http and https
// let hosts = ['0.0.0.0', 'localhost']
// let ports = [[443, 80]]

const ssl = 'kubernetes'

function makeHttpsServer(options = {}) {
    const option = {
        ...options
    }
    const { ports, host } = option
    const [tcpPort, httpsPort, httpPort] = getPorts(ports)

    const sslOption = {
        key: readFileSync(`./${ssl}-key.pem`),
        cert: readFileSync(`./${ssl}.pem`),
        ca: readFileSync('./ca.pem')
    }

    const server = createServer(sslOption)
    server.on('request', (req, res) => {
        setResonseToJson()
        setResponseData(getResponseDefaultData(httpsPort, host))
        // set head
        res.writeHead(200, getResponseHeader())
        // set data
        res.write(getResponseData())
        res.end()
    })

    server.listen(httpsPort, host, () => log(`App listening on port ${httpsPort}!`))
}
export { makeHttpsServer }
