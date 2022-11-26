/* eslint-disable  no-unused-vars,prefer-const */
/* eslint-disable  func-names */
/* eslint-disable  max-len */

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
export { log, getLogInfo }
