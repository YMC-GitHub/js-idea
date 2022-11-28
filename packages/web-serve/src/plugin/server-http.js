/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */

import { addKeySuffix, makeHttpServer as createServer, serveDefault } from './server-helps'

function makeHttpServer(options, app) {
    const option = {
        ...options
    }
    const { ports, host, ssl } = option
    // const [tcpPort, httpsPort, httpPort] = getPorts(ports)
    const { httpPort } = addKeySuffix(ports, 'Port')
    const server = createServer(options, app)
    serveDefault(server, httpPort, host)
}

export { makeHttpServer }
