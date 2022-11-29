/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default */

// import encode from './adapter/crypto'
import encode from './index'

const { log } = console
log('[task] encode text to hash')
// log(`[info] encode by md5 `)
// encode({ method: 'md5', data: 'ymc' })
// encode({ method: 'sha1', data: 'ymc' })
// encode({ method: 'sha256', data: 'ymc' })
// encode({ method: 'sha384', data: 'ymc' })
// encode({ method: 'sha512', data: 'ymc' })

function getTextHash(text, options = {}) {
    const option = {
        algorithms: 'md5,sha1,sha256,sha384,sha512'.split(','),
        encodings: 'hex,base64'.split(','),
        ...options
    }
    const { encodings, algorithms } = option
    const res = {}
    const digest = encodings
        .map(encoding =>
            algorithms.map(method => {
                const encoded = encode({ method, encoding, data: text })
                res[`${method}-${encoding}`] = encoded
                log(`[info] encode by ${method}`)
                log(`length: ${encoded.length}, code: ${encoded}`)
                return encoded
            })
        )
        .flat(Infinity)

    // log(digest)
    log(res)
}
getTextHash('ymcymc')
// Message-Digest Algorithm 5 (md5)
// Secure Hash Algorithm (sha)
// [about sha](https://www.cnblogs.com/yangjiannr/p/mi-ma-xuehash-han-shuSHA256512.html)

// idea: compose-hash,add-salt
// md5(sha1(password))
// md5(md5(salt) + md5(password))
// sha1(sha1(password))
// sha1(str_rot13(password + salt))
// md5(sha1(md5(md5(password) + sha1(password)) + md5(password)))

// [scure hash patices ](https://www.zhihu.com/question/50964318)
// [scure hash patices](https://developer.aliyun.com/article/156277)
// [scure hash patices - des,3des,aes](https://www.cnblogs.com/chenjianxiang/p/5648772.html)

// md5,
// edbe35cbb23c12c7efb0794b6dc7a512
// method,byte-length,16hex-str-length,usage
// md5,124,32,check-full-file|sign-data
// sha1,160,32?,check-full-file|sign-data

// hamc,-,-,encode-data-for-transfer
// des,56,-,
// 3des,112|168,-,encode-data-for-transfer
// aes,128|192|256,-,

// md5,sha1 vs des,3des,aes vs rsa,dsa

// https://melvingeorge.me/blog/create-md5-hash-nodejs
// https://futurestud.io/tutorials/node-js-calculate-an-md5-hash
// https://www.codegrepper.com/code-examples/javascript/Sha256+decrypt+javascript
// crypto.createHash('sha1').update(str).digest('hex')

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/text-hash/src/demo.js
