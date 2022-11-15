import { readFileSync } from 'fs'

/**
 * read .json file sync
 * @param {string} loc the location of .json file
 * @param {{}|[]} def the default data of .json file
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
