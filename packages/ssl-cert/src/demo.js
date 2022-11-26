/* eslint-disable  no-unused-vars */
import { jsonstream } from '@ymc/json-stream-io'
import { textstream } from '@ymc/text-stream-io'
import { classify } from '@ymc/extend-string'
import { exec, execOpts, setExecOptsForIconv } from '@ymc/run-bash'
import {
    getHosts,
    parseNames,
    CONFIG_CA_PROFILES,
    CONFIG_CA_CSR,
    CONFIG_K8S_CSR,
    CONFIG_K8S_CSR_ADMIN
} from './plugin/k8s-ssl'

// classify,camelize, titleize
import { log, getLogInfo } from './helps'

// 3 types ssl
// DV SSL - Domain Validation SSL
// OV SSL - Organization Validation SSL
// EV SSL - Extended Validation SSL

// [about key,csr,crt]
// https://www.cnblogs.com/xiongwei/p/15147272.html
// [about pem,der,crt,cer,pfx/p12,csr]
// https://www.cnblogs.com/technology178/p/14094375.html
// openssl,cfssl,keytool
// Certificate Signing Request (CSR)
// YOU CAN USE THE SAME CSR TO REQUEST NEW CERT,
// TO KEEP KEY AS THE SAME
// WHEN OUT-OF-DATE

async function main(options = {}) {
    const option = {
        ...options
    }
    const loginfo = getLogInfo(true)
    const logTask = getLogInfo(true)

    // loginfo(`[info] get config`)
    // loginfo(`[info] gen csr-config`)
    // loginfo(`[info] gen ca-config`)
    // await exec(`cfssl print-defaults config > config.json`, execOpts)

    let data
    let loc
    let res
    let cmd
    let topic
    let profile

    // Certificate Authority

    // ca,csr,
    let file
    // - [x] use the ca to sign other cert
    // - [x] client use the ca to auth server
    // - [x] server use the ca to auth client
    // pre-know: profiles,usages,expiry
    file = CONFIG_CA_PROFILES

    logTask('[task] gen ca (ca-key.pem,ca.pem)')
    loc = 'ca-config.json'
    jsonstream.init(loc)
    await jsonstream.write(file.data)
    loginfo(`[info] out: ${loc}`)

    // use CN as user-name from it
    // use O as group name from it
    file = CONFIG_CA_CSR
    loc = 'ca-csr.json'
    jsonstream.init(loc)
    await jsonstream.write(file.data)
    loginfo(`[info] out: ${loc}`)

    res = await exec('cfssl gencert -initca ca-csr.json | cfssljson -bare ca', execOpts)
    // stderr !!!
    log(res)
    // ca.csr,ca.pem,ca-key.pem //vs

    topic = 'kubernetes'
    logTask(`[task] gen ${topic} cert (${topic}-key.pem,${topic}.pem,${topic}.scr)`)

    file = CONFIG_K8S_CSR
    parseNames('CN/guang-dong/shen-zhen/k8s/System')

    loc = `${topic}-csr.json`
    jsonstream.init(loc)
    await jsonstream.write(file.data)
    loginfo(`[info] out: ${loc}`)

    res = await exec(
        `cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=kubernetes ${topic}-csr.json | cfssljson -bare ${topic} `,
        execOpts
    )
    loginfo(res)
    // ca.csr,ca.pem,ca-key.pem //vs

    topic = 'admin'
    logTask(`[task] gen ${topic} cert (${topic}-key.pem,${topic}.pem,${topic}.scr)`)
    file = CONFIG_K8S_CSR_ADMIN
    file.data.hosts = getHosts()

    loc = `${topic}-csr.json`
    jsonstream.init(loc)
    await jsonstream.write(file.data)
    loginfo(`[info] out: ${loc}`)

    res = await exec(
        `cfssl gencert -ca=ca.pem -ca-key=ca-key.pem -config=ca-config.json -profile=kubernetes ${topic}-csr.json | cfssljson -bare ${topic} `,
        execOpts
    )
    loginfo(res)
}
main()
// node --no-warnings --loader ./scr/lib/esm-loader.js  packages/ssl-cert/src/demo.js
