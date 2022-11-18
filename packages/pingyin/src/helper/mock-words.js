/**
 * sentence to word array
 * @param {string} s
 * @param {string|regexp} sc
 * @returns {string[]}
 */
function words(s, sc = / +/) {
    if (Array.isArray(s)) return s
    else if (typeof sc === 'string') return s.split(sc)
    else if (sc.test(s)) return s.split(sc)
    else return s
}
/**
 * word array to sentence
 * @param {string[]|string} s
 * @returns {string}
 */
function sentence(s) {
    return Array.isArray(s) ? s.join(' ') : s
}

export { words, sentence }
