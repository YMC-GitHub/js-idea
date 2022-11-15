import { writeFileSync } from 'fs'

function noop() {}
/**
 * write .json file sync
 * @param {string} loc the location of .json file
 * @param {{}|[]} data the data to write
 * @returns {undefined}
 */
function writeJsonSync(loc, data) {
    try {
        let tmp = data
        if (typeof data !== 'string') {
            tmp = JSON.stringify(data, null, 2)
        }
        writeFileSync(loc, tmp)
    } catch (error) {
        noop()
    }
}
export default writeJsonSync
