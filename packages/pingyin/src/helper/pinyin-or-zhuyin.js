import { toneMarks } from './tone'
import { toPinyin } from './zhuyin'

const ranges = [
    {
        start: parseInt('2E80', 16),
        end: parseInt('2FD5', 16)
    },
    {
        start: parseInt('3400', 16),
        end: parseInt('4DBF', 16)
    },
    {
        start: parseInt('4E00', 16),
        end: parseInt('9FCC', 16)
    }
]

/**
 * get text type
 * @param {string} text
 * @returns
 */
export const check = text => {
    const numberedPinnyinRE = /[a-zü]+[1-5]/i
    //idea:
    //zhuyin-to-yinpin,is-numbered-pinyin
    if (numberedPinnyinRE.test(toPinyin(text, { numbered: true }).join(''))) {
        return 'zhuyin'
    } else if (numberedPinnyinRE.test(text)) {
        return 'pinyin-numbered'
    } else {
        //idea:
        //get-tone-mark,normalize-text,inclues-tone-mark
        for (let tone of toneMarks) {
            if (text.normalize('NFD').includes(tone)) {
                return 'pinyin-marked'
            }
        }
    }

    // mandarin vs Chinese
    //idea:
    //get-char-unicode,in-relative-ranges
    for (let i = 0; i < text.length; i++) {
        let code = text[i].charCodeAt(0)
        for (let range of ranges) {
            if (code >= range.start && code <= range.end) {
                return 'mandarin'
            }
        }
    }

    return 'other'
}

export default check
