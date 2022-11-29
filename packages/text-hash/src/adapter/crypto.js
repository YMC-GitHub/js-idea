import { createHash } from 'crypto'
// const { log } = console

function encode(options = {}) {
    const option = {
        method: 'md5',
        encoding: 'hex',
        data: 'hello',
        ...options
    }
    const { method, data, encoding } = option
    const res = createHash(method).update(data).digest(encoding)

    // log(`[info] encode by ${method}`)
    // log(`length: ${res.length}, code: ${res}`)
    return res
}

export default encode
