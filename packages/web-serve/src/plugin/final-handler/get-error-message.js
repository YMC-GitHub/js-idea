/*eslint-disable */

// import { message as statusMessage } from 'statuses'
// import { extendClass } from '@script-pkgs/class-es5-help'
import { message as statusMessage } from '../http-status'
/**
 * Get message from Error object, fallback to status message.
 *
 * @param {Error} err
 * @param {number} status
 * @param {string} env
 * @return {string}
 */

function getErrorMessage(err, status, env) {
    let msg

    // feat: set non-production env enable
    if (env !== 'production') {
        // feat: use err.stack as msg
        // use err.stack, which typically includes err.message
        msg = err.stack

        // feat: fallback to err.toString() when possible
        if (!msg && typeof err.toString === 'function') {
            msg = err.toString()
        }
    }

    // feat: set prodcution env enable
    return msg || statusMessage[status]
    // todo: get msg fron ctx
    // you can get detail on jimp
    // https://github.com/oliver-moran/jimp/blob/master/packages/plugin-rotate/src/index.js
    // https://github.com/oliver-moran/jimp/tree/master/packages/core
    // https://github.com/oliver-moran/jimp/blob/master/packages/core/src/index.js
    // addJimpMethods,addConstants
    // return msg || this.statusMessage[status]
}

// class Jimp {
//     constructor() {
//         this.statusMessage = { 301: 'Moved Permanently' }
//     }
// }
// extendClass(Jimp,'getErrorMessage',getErrorMessage)
export default getErrorMessage
