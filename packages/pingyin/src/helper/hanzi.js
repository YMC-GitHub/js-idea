/**
 * str to arr
 * @param {string} s
 * @param {string|regexp} sc
 * @returns {string[]}
 */
export function str2arr(s, sc = / +/) {
    if (Array.isArray(s)) return s
    if (typeof sc === 'string') return s.split(sc)
    if (sc.test(s)) return s.split(sc)
    return s
}

export const zhRegexp = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g
export function containHanzi(text) {
    // U+3040 – U+30FF //jp
    // U+3400 – U+4DBF //zh,jp,ko
    // U+4E00 – U+9FFF //zh,jp,ko
    // U+F900 – U+FAFF //zh,jp,ko
    // U+FF66 – U+FF9F //jp
    // https://www.fwait.com/how-to-check-if-string-contains-chinese-characters-in-javascript/
    const regExp = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]/g
    return regExp.test(text)
}
/**
 * handle hanzi mixed with en to array
 * @param {string} item
 * @returns
 */
function mixedHanzi2array(item) {
    // containHanzi(kb) ? kb : ` ${kb} `)
    return item
        .replace(zhRegexp, ' $& ')
        .replace(/(^ +)|( +$)/gi, '')
        .split(' ')
        .filter(ki => ki)
        .map(kb => (containHanzi(kb) ? mixedHanzi2array(kb) : ` ${kb} `))
        .flat(Infinity)
}
/**
 * handle hanzi mixed with en to string
 * @param {string[]} list
 * @returns
 */
function mixedHanzi2string(list) {
    // many space to one
    // del the start and the end space
    return list
        .join('')
        .replace(/ {2,}/gi, ' ')
        .replace(/(^ +)|( +$)/gi, '')
}
/**
 * hanzi - word array to sentence
 * @param {string[]|string} s
 * @returns {string}
 */
export function sentence(s) {
    let list = Array.isArray(s) ? s : [s]
    // en .eg to : 'hello world!'
    if (!list.some(v => containHanzi(v))) return list.join(' ')
    // zh .eg to : '你好！'
    list = list.map(item => (containHanzi(item) ? mixedHanzi2array(item) : ` ${item} `)).flat(Infinity)
    // console.log(list)
    list = mixedHanzi2string(list)
    return list
    // return Array.isArray(s) ? s.join(' ') : s
}
// export const hanzi2sentence = sentence
export const getSentenceByWords = sentence
/**
 * hanzi - sentence to word array
 * @param {string} s
 * @returns {string[]}
 */
export function words(s) {
    if (Array.isArray(s)) {
        return s
    }
    if (typeof s === 'string') {
        // en
        if (!containHanzi(s)) return s.split(' ')
        // zh
        return s
            .replace(zhRegexp, ' $& ')
            .replace(/(^ +)|( +$)/gi, '')
            .split(' ')
            .filter(v => v)
        // '$& '?' $& '
        /// (^ +)|( +$)/gi, '' ?
    }
    return s
}
// export const hanzi2words = words
export const getWordsBySentence = words

// const { log } = console
// log(words(`你好`)) //[ '你', '好' ]
// log(words(`你好guojia`)) //[ '你', '好', 'guojia' ]
// log(words(`hello world`)) //[ 'hello', 'world' ]
// log(words(`你好 guo2 jia1`)) //prefer: [ '你', '好', 'guo2', 'jia1' ]
// log(words(`guo2 jia1`)) //[ 'guo2', 'jia1' ]
// log(sentence(['你', '好', 'guo2', 'jia1']))
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/pingyin/src/helper/hanzi.js
