import { readFileSync } from 'fs'

/**
 * read .json file sync
 * @param {string} loc
 * @param {{}|[]} def
 * @returns {{}|[]}
 */
function readJsonSync(loc, def = {}) {
    let res
    try {
        res = readFileSync(loc)
        res = JSON.parse(res)
    } catch (error) {
        res = def
    }
    return res
}
export default readJsonSync
