import encode from './adapter/crypto'

const { log } = console
function decode() {
    log('[info] this method do not decode')
}
// encode({ method: 'md5', data: 'ymc' })
// encode({ method: 'sha1', data: 'ymc' })
// encode({ method: 'sha256', data: 'ymc' })
// encode({ method: 'sha384', data: 'ymc' })
// encode({ method: 'sha512', data: 'ymc' })
export { encode, decode }
export default encode
