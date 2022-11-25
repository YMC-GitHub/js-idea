import { padEndString } from '@ymc/extend-string'
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
 * beauty text - add some space between name and description
 * @param {string|string[]} text
 * @returns {string[]}
 */
function beautyText(text) {
    let list = Array.isArray(text) ? text : [text]

    // get the max-str length of name property value
    const max = Math.max(...list.map(line => line.split(' ')[0].length))
    list = list.map(line => {
        const arr = line.split(' ')
        let name = arr[0]
        const desc = arr.slice(1)
        name = padEndString(name, max + 6, ' ')
        return `${name}${desc.join(' ')}`
    })
    // log(max)
    return list
    // padding suffix space
}

export { formatText, beautyText }
