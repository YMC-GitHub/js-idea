import { removeTone, getToneNumber, numberToMark } from './tone'
import splitPinyin from './split-pinyin'
import py2zy from '../data/pinyin-zhuyin-map'

export const toneMarks = ['', 'ˊ', 'ˇ', '`', '˙']

/**
 * get zhuyin from pinyin-syllable
 * @param {string} pinyin
 * @returns {string}
 */
export const fromPinyinSyllable = pinyin => {
    // idea:
    // del-tone,to-lower,get-zhuyin-in-dic
    const zy = py2zy[removeTone(pinyin).toLowerCase()]
    // get-tone-number,get-mark,wrap-zhuyin
    return zy + toneMarks[getToneNumber(pinyin) - 1]
}

/**
 * get zhuyin from pinyin - translate pinyin to zhuyin
 * @param {string | string[]} input
 * @param {boolean} everything
 * @returns
 */
export const fromPinyin = (input, everything = false) => {
    /**
     *
     * @param {string} pinyin
     * @returns
     */
    const translate = pinyin =>
        splitPinyin(pinyin, everything).map(item => {
            if (everything) {
                if (typeof item === 'string') return item

                return fromPinyinSyllable(item[0])
            }
            return fromPinyinSyllable(item)
        })
    if (typeof input === 'string') {
        return translate(input)
    }
    return input.map(translate)
}

/**
 * split zhuyin
 * @param {string} zhuyin
 * @param {boolean} everything
 * @returns
 */
export const splitZhuyin = (zhuyin, everything = false) => {
    const list = []
    let index = 0
    while (index < zhuyin.length) {
        let count = zhuyin.length - index
        let wordFound = false
        while (count > 1) {
            // substr to substring ?
            let word = zhuyin.substring(index, count)
            if (Object.values(py2zy).includes(word)) {
                // word found
                wordFound = true

                if (toneMarks.includes(zhuyin[index + count])) {
                    // tone found after word
                    word += zhuyin[index + count]
                    count += 1
                }

                list.push(everything ? [word] : word)
                index += count - 1
                break
            }
            count -= 1
        }

        if (!wordFound && everything) {
            if (index === 0 || typeof list[list.length - 1] === 'object') {
                list.push(zhuyin[index])
            } else if (typeof list[list.length - 1] === 'string') {
                list[list.length - 1] += zhuyin[index]
            }
        }

        index += 1
    }
    return list
}

/**
 * to pinyin-syllable
 * @param {string} zhuyin
 * @returns
 */
export const toPinyinSyllable = zhuyin => {
    let text = zhuyin
    // idea:
    // get-tone-pos,get-zhuyin
    let tone = toneMarks.indexOf(text[text.length - 1]) + 1
    if (tone > 0) {
        // substr to substring ?
        text = text.substring(0, text.length - 1)
    } else {
        tone = 1
    }
    // get-index-of-zhuyin,get-pinyin-by-index
    const pinyinIndex = Object.values(py2zy).indexOf(text)
    if (pinyinIndex > -1) {
        return Object.keys(py2zy)[pinyinIndex] + tone
    }
    return text
}

// type ToPinyinOptions = { everything?: boolean, numbered?: boolean }
/** @type {{ everything?: boolean, numbered?: boolean }} ToPinyinOptions */
/**
 * zhuyin to pinyin
 * @param {string} zhuyin
 * @param {ToPinyinOptions} opts
 * @returns
 */
export const toPinyin = (zhuyin, opts = {}) => {
    let list = splitZhuyin(zhuyin, opts.everything)
    if (!opts.everything) list = list.filter(item => typeof item === 'string')
    list = list.map(item => {
        let text = item
        if (opts.everything && typeof text === 'string') {
            return text
        }
        if (typeof text !== 'string') {
            // text = text[0]
            ;[text] = text
        }

        const pinyin = toPinyinSyllable(text)
        if (opts.numbered) {
            return opts.everything ? [pinyin] : pinyin
        }
        if (opts.everything) {
            return [numberToMark(pinyin)]
        }
        return numberToMark(pinyin)
    })
    return list
}

export default fromPinyin
