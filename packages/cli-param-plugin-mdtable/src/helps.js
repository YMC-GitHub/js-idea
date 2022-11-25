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

/**
 * gen table th align by keys
 * @param {string} align
 * @param {string[]} keys
 * @returns {string}
 */
function getAlignByKeys(align, keys) {
    return keys.map(() => align).join('|')
}

/**
 * gen table body by keys
 * @param {{[string]:unknown}[]} data
 * @param {string[]} keys
 * @returns {string}
 */
function getBodyByKeys(data, keys) {
    return data.map(v => keys.map(k => v[k]).join('|')).join('\n')
}
/**
 * get table
 * @param {{title:string, head:string, thAlign:string, body:string}} data
 * @returns
 */
function getTable(data) {
    const { title, head, thAlign, body } = data
    let res
    res = `${title}\n${head}\n${thAlign}\n${body}`
    res = res.trim()
    res = `${res}\n\n`
    return res
}

function noop() {}
export { formatText, getParamName, noop, getAlignByKeys, getBodyByKeys, getTable }
