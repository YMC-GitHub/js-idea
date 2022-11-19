/* eslint-disable no-restricted-syntax */
import { toneMarks } from './tone'
import { toPinyin } from './zhuyin'

const ranges = [
    {
        start: 0x2e80,
        end: 0x2fd5
    },
    {
        start: 0x3400,
        end: 0x4dbf
    },
    {
        start: 0x4e00,
        end: 0x9fcc
    }
]

/**
 * get text type
 * @param {string} text
 * @returns
 */
export const check = text => {
    const numberedPinnyinRE = /[a-zü]+[1-5]/i
    // idea:
    // zhuyin-to-yinpin,is-numbered-pinyin
    if (numberedPinnyinRE.test(toPinyin(text, { numbered: true }).join(''))) {
        return 'zhuyin'
    }
    if (numberedPinnyinRE.test(text)) {
        return 'pinyin-numbered'
    }
    // idea:
    // get-tone-mark,normalize-text,inclues-tone-mark
    for (const tone of toneMarks) {
        if (text.normalize('NFD').includes(tone)) {
            return 'pinyin-marked'
        }
    }

    // mandarin vs Chinese
    // idea:
    // get-char-unicode,in-relative-ranges
    for (let i = 0; i < text.length; i += 1) {
        const code = text[i].charCodeAt(0)
        for (const range of ranges) {
            if (code >= range.start && code <= range.end) {
                return 'mandarin'
            }
        }
    }

    return 'other'
}

export default check
