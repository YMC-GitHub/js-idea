/* eslint-disable  no-unused-vars,prefer-const */
/* eslint-disable  func-names */
/* eslint-disable  max-len */

import { exec, execOpts, setExecOptsForIconv } from '@ymc/run-bash'

const { log } = console

/**
 * get loginfo function
 * @param {boolean} enable
 * @returns {()=>void} a function to log info
 */
function getLogInfo(enable) {
    return function (...msg) {
        if (enable) {
            log(...msg)
        }
    }
}
const loginfo = getLogInfo(true)
async function pem2der(topic) {
    let res
    loginfo(`[info] out: ${topic}.der`)
    res = await exec(`openssl x509 -in ${topic}.crt -outform der -out ${topic}.der`, execOpts)
    loginfo(res)
}
async function der2pem(topic) {
    let res
    loginfo(`[info] out: ${topic}.pem`)
    res = await exec(`openssl x509 -in ${topic}.crt -inform der -outform pem -out ${topic}.pem`, execOpts)
    loginfo(res)
}

async function main() {
    let res
    let loc

    let topic
    loginfo('[task] gen ca.key,ca.crt')

    // openssl genrsa -out ca.key 2048
    // openssl req -new -nodes -x509 -key ca.key -days 365 -out ca.crt -subj "/C=CN/ST=Hubei/L=Wuhan/O=k8s/OU=systemGroup/CN=kubernetesEA:admin@com"

    // or:one cmd
    // openssl req -newkey rsa:2048 -nodes -keyout ca.key -x509 -days 3650 -out ca.crt -subj "/C=CN/ST=Hubei/L=Wuhan/O=k8s/OU=systemGroup/CN=kubernetes"
    // https://www.cnblogs.com/technology178/p/14094375.html

    loginfo('[task] gen topic.key,topic.crt')
    // openssl genrsa -out ca.key 2048
    // openssl req -new -key ca.key -out ca.csr -subj "/C=CN/ST=Hubei/L=Wuhan/O=k8s/OU=systemGroup/CN=kubernetes"
    // openssl req -text -noout -in ca.csr
    // openssl x509 -req -days 3650 -in ca.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out ca.pem

    topic = 'server'
    loc = `${topic}.key`
    loginfo(`[info] out: ${loc}`)
    res = await exec(`openssl genrsa -des3 -out ${topic}.key 2048`, execOpts)
    loginfo(res)

    loc = 'ca.crt'
    loginfo(`[info] out: ${loc}`)
    res = await exec(`openssl req -new -x509 -key ${topic}.key -out ca.crt -days 3650`, execOpts)
    loginfo(res)

    loc = `${topic}.csr`
    loginfo(`[info] out: ${loc}`)
    res = await exec(`openssl req -new -key  ${topic}.key -out  ${topic}.csr`, execOpts)
    // input country, area, organize, email.
    // the importan of commom name，you can use your name, ip or domian.
    loginfo(res)

    loc = `${topic}.crt`
    loginfo(`[info] out: ${loc}`)
    res = await exec(
        `openssl x509 -req -days 3650 -in ${topic}.csr -CA ca.crt -CAkey ${topic}.key -CAcreateserial -out ${topic}.crt`,
        execOpts
    )
    loginfo(res)

    loc = `${topic}.pem`
    loginfo(`[info] out: ${loc}`)
    res = await exec(`cat ${topic}.key ${topic}.crt > ${topic}.pem`, execOpts)
    loginfo(res)
}
export { pem2der, der2pem, main }
