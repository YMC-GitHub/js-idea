/**
 * format text - add some space as prefix of each line
 * @param {string|string[]} text
 * @param {string} prefix
 * @param {string} count
 * @returns {string}
 */
function formatText(text, prefix = '', count = 2) {
    const res = Array.isArray(text) ? text : [text]
    return res.join('\n').replace(/^/gim, Array(count).fill(prefix).join(''))
}
/**
 *  get param name - short or long - in name
 * @param {string} name
 * @returns {string}
 */
function getParamName(name) {
    const [s, l] = name.split(/,/).map(i => i.trim().replace(/^-*/gi, ''))
    // 'hasLong' is assigned a value but never used
    const thelong = s.length > 1 ? s : l
    // thelong = camelize(thelong)
    return thelong
}

function noop() {}
export { formatText, getParamName, noop }
