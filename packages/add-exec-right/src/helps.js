/* eslint-disable func-names */

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
function noop() {}
export { noop, getLogInfo }
