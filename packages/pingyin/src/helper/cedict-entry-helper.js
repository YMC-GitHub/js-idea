// define-entry
// entry-to-json
// entry-to-string
// 中國 中国 [Zhong1 guo2] /China/Middle Kingdom/
import './cedict-types'

const entryRegex = /([^ ]+) ([^ ]+) \[([^\]]+)\] \/(.+)\//
/**
 *
 * @param {string} line
 * @returns
 */
export function parseEntry(line) {
    const match = line.match(entryRegex)

    if (!match) throw new Error(`Unknown line format: ${line}`)

    const [, traditional, simplified, pinyin, joinedEnglish] = match
    const english = joinedEnglish.split('/')

    return {
        traditional,
        simplified,
        pinyin,
        english
    }
}

/**
 * define entry
 * @param {string} traditional
 * @param {string} simplified
 * @param {string} pinyin
 * @param {string} english
 * @returns
 * @sample
 * ```
 * entry('我的','我的','wo3 de1','my/mime')
 * ```
 */
export function entry(traditional = '', simplified = '', pinyin = '', english = '') {
    return `${traditional} ${simplified} [${pinyin}] /${english}/`
}

/**
 *
 * @param {entryJson} options
 * @returns {string}
 */
export function entry2string(options = {}) {
    const option = {
        pinyin: '',
        english: '',
        ...options
    }
    const { traditional, simplified, pinyin, english } = option
    return `${traditional} ${simplified} [${pinyin}] /${english}/`
}

export function entry2json(traditional, simplified, pinyin, english) {
    return parseEntry(entry2string(traditional, simplified, pinyin, english))
}
