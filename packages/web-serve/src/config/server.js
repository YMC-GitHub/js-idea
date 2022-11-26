/**
 * config for pro env
 */
const pro = {
    host: '0.0.0.0',
    ports: {
        http: 80,
        https: 443,
        tcp: 3344
    }
}
/**
 * config for dev env
 */
const dev = {
    host: 'localhost',
    ports: {
        http: 80,
        https: 443,
        tcp: 3344
    }
}
const ports = {
    http: 3345,
    https: 3346,
    tcp: 3344
}

export default { pro, dev, ports }
