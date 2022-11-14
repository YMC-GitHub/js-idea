import { writeFileSync } from 'fs'

function noop() {}
/**
 * write .json file sync
 * @param {string} loc
 * @param {{}|[]} data
 * @returns {{}|[]}
 */
function writeJsonSync(loc, data) {
    try {
        let tmp = data
        if (typeof data === 'string') {
            tmp = JSON.parse(data)
        }
        writeFileSync(loc, tmp)
    } catch (error) {
        noop()
    }
}
export default writeJsonSync
