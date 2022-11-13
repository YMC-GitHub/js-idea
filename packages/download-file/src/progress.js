import './types'
import { log } from './helps'
/**
 *
 * @param {string} file
 * @param {number} cur
 * @param {number} len
 * @param {number} total
 */
function showProgress(file, cur, len, total) {
    const progress = ((100.0 * cur) / len).toFixed(2)
    const downloadedSize = (cur / 1048576).toFixed(2)
    const totalSize = total.toFixed(2)
    const msg = `[process] downloading ${file} - ${progress} % (${downloadedSize} MB ) of total size: ${totalSize}MB`
    log(msg)
}
/**
 *
 * @param {showProgressNextOption} option
 */

function showProgressNext(option) {
    const { file, cur, len, total } = option
    const progress = ((100.0 * cur) / len).toFixed(2)
    const downloadedSize = (cur / 1048576).toFixed(2)
    const totalSize = total.toFixed(2)
    const msg = `[process] downloading ${file} - ${progress} % (${downloadedSize} MB ) of total size: ${totalSize}MB`
    log(msg)
}
/**
 *
 * @param {showProgressNextOption} option
 * @returns {showProgressNextOption}
 */
function initProgressState(option = {}) {
    const { len } = option
    // const len = parseInt(response.headers["content-length"], 10);
    const total = len / 1048576 // 1048576 - bytes in 1 Megabyte
    return {
        ...option,
        len,
        cur: 0,
        total
    }
}
/* eslint-disable no-param-reassign */
/**
 *
 * @param {string} chunk
 * @param {showProgressNextOption} option
 * @returns {showProgressNextOption}
 */
function calcProgressState(option, chunk) {
    option.cur += chunk.length
    return option
}
/* eslint-enable no-param-reassign */

export { showProgress, initProgressState, calcProgressState, showProgressNext }
