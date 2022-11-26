import { createServer, createConnection } from 'net'
import { getPorts } from './server-helps'
// import config from '../config/server'
const { log } = console
// const args = process.argv.slice(2)
// arg level-> config file -> file level->

// import('./http-server')
// import('./http-servers')

async function proxyHttp(options = {}) {
    const option = {
        ...options
    }
    const { ports } = option
    const [tcpPort, httpsPort, httpPort] = getPorts(ports)
    createServer(socket => {
        socket.once('data', buf => {
            log(buf[0])
            const address = buf[0] === 22 ? httpsPort : httpPort
            const proxy = createConnection(address, () => {
                proxy.write(buf)
                socket.pipe(proxy).pipe(socket)
            })
            proxy.on('error', err => {
                log(err)
            })
        })
        socket.on('error', err => {
            log(err)
        })
    }).listen(tcpPort)
}
export { proxyHttp, getPorts }
