/* eslint-disable max-len */
let data = {}
const header = {}

function json2string(json) {
    return JSON.stringify(json, null, 0)
}
function setResonseToJson() {
    header['content-type'] = 'application/json'
}
function getResponseData() {
    let res
    const type = header['content-type']
    switch (type) {
        case 'application/json':
            res = json2string(data)
            break

        default:
            res = data
            break
    }
    return res
}
function getResponseHeader() {
    return header
}
function setResponseData(value) {
    data = value
}
function getResponseDefaultData(host, port) {
    return { host, port }
}
function getPorts(ports) {
    const { tcp, https, http } = ports
    return [tcp, https, http]
}
// serve json
// serve favicon
// refs:
// https://github.com/expressjs/serve-favicon/blob/master/index.js
// https://github.com/dominicegginton/koa-icon/blob/main/lib/index.js
// https://github.com/tinyhttp/favicon/blob/master/src/index.ts

// serve html
export { getPorts, setResonseToJson, setResponseData, getResponseData, getResponseDefaultData, getResponseHeader }
