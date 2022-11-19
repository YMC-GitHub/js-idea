// style or compact:
/* eslint-disable  no-unused-vars,prefer-const */
/* eslint-disable  no-continue */

import './cedict-types'

function isString(s) {
    return typeof s === 'string'
}
function isObject(s) {
    return typeof s === 'object'
}
/**
 * cdeict-text contain entry-text
 * @param {string} cdeict
 * @param {string|entryJson} entry
 * @returns
 */
export function containEntry(cdeict, entry) {
    if (isString(cdeict)) {
        if (isString(entry)) {
            return cdeict.indexOf(entry) > -1
        }
        return cdeict.indexOf(entry) > -1
    }
    return cdeict.indexOf(entry) > -1
}
export function insertEntry(cdeict, entry) {}
export function deleteEntry(cdeict, entry) {}
// idea:
// entry().entry().write(locword2)
