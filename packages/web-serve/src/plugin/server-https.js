/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import { addKeySuffix, makeHttpsServer as createServer, serveDefault } from './server-helps'
// https://stackoverflow.com/questions/8355473/listen-on-http-and-https-for-a-single-express-app

function makeHttpsServer(options, app) {
    const option = {
        ...options
    }
    const { ports, host, ssl } = option
    // const [tcpPort, httpsPort, httpPort] = getPorts(ports)
    const { httpsPort } = addKeySuffix(ports, 'Port')
    const server = createServer(options, app)
    serveDefault(server, httpsPort, host)
}

export { makeHttpsServer }
