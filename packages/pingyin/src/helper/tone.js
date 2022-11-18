/**
 * Create a unicode character from the codepoint of a Chinese character
 * @param {number | string} codepoint codepoint of Chinese character as number or string type
 * @example
 * ```
 * codepointToUnicode(0x6211)   // 我
 * codepointToUnicode('0x6211') // 我
 * codepointToUnicode('U+6211') // 我
 * codepointToUnicode('6211')   // 我
 * ```
 */
export const codepointToUnicode = codepoint => {
    if (typeof codepoint === 'string') {
        let codepointStr = codepoint.replace('U+', '')
        if (!/^0x/.test(codepointStr)) {
            codepointStr = '0x' + codepointStr
        }
        return String.fromCodePoint(parseInt(codepointStr))
    }
    return String.fromCodePoint(codepoint)
}

/**
 * Four tones: ` ̄` ` ́` ` ̌` ` ̀`
 */
export const toneMarks = ['\u0304', '\u0301', '\u030c', '\u0300']

/**
 * Returns the tone number of a Pinyin syllable
 * @param {string} text Pinyin syllable to get the tone number from
 * @example
 * ```
 * getToneNumber('shì')  // 4
 * getToneNumber('shi4') // 4
 * ```
 */
export const getToneNumber = text => {
    // Check for tone number
    const matches = text.match(/[a-zü](\d)/i)
    if (matches) return +matches[1]
    // Check for tone mark
    for (let i = 0; i < toneMarks.length; i++) {
        if (text.normalize('NFD').match(toneMarks[i])) return i + 1
    }
    // Return 5th tone as default
    return 5
}

/**
 * Removes the tone mark/number from a Pinyin syllable
 * @param {string} text Pinyin syllable to remove the tone mark/number from
 * @example
 * ```
 * removeTone('wǒ')  // wo
 * removeTone('wo3') // wo
 * ```
 */
export const removeTone = text => {
    text = text.normalize('NFD').replace(/\u0304|\u0301|\u030c|\u0300/g, '')
    return text.normalize('NFC').replace(/(\w|ü)[1-5]/gi, '$1')
}

/**
 * Converts the tone mark into the corresponding tone number
 * @param {string | string[]} text Pinyin syllable containing the tone mark to be converted
 * @param {boolean} fithTone show fith tone as number (ex. `he` => `he5`)
 * @returns {string | string[]}
 * @example
 * ```
 * markToNumber('lǜ')        // lü4
 * markToNumber('he')        // he5
 * markToNumber('he', false) // he
 * ```
 */

export function markToNumber(data, fithTone = true) {
    /**
     *
     * @param {string} text
     * @returns
     */
    const process = text => {
        if (text.trim().length === 0) return text
        if (fithTone) {
            return removeTone(text) + getToneNumber(text)
        } else {
            const tone = getToneNumber(text)
            return tone === 5 ? removeTone(text) : removeTone(text) + tone
        }
    }
    if (Array.isArray(data)) {
        return data.map(process)
    } else {
        return process(data)
    }
}

/**
 * Converts the tone number into the corresponding tone mark
 * @param {string | string[]} text Pinyin syllable containing the tone number to be converted
 * @example
 * ```
 * numberToMark('lü4') // lǜ
 * numberToMark('he5') // he
 * ```
 */
export function numberToMark(data, a) {
    /**
     *
     * @param {string} text
     * @returns
     */
    const process = text => {
        if (text.trim().length === 0) return text

        const tone = getToneNumber(text)

        text = removeTone(text)

        if (tone !== 5) {
            if (text === 'm' || text === 'n' || text === 'M' || text === 'N') {
                return (text + toneMarks[tone - 1]).normalize('NFC')
            }
            const matchedVovels = text.match(/[aeiouü]/gi)
            if (matchedVovels) {
                let vovel = matchedVovels[matchedVovels.length - 1]
                if (text.match('ou')) vovel = 'o'
                if (text.match('a')) vovel = 'a'
                if (text.match('e')) vovel = 'e'
                let swa = a && vovel === 'a' ? '\u0251' : vovel
                return text.replace(vovel, swa + toneMarks[tone - 1]).normalize('NFC')
            }
        }
        return a ? text.replace(/a/gi, '\u0251') : text
    }
    if (Array.isArray(data)) {
        return data.map(process)
    } else {
        return process(data)
    }
}
/**
 *
 * @param {string} s
 * @returns
 */
export function containTone(s) {
    return toneMarks.some(v => s.indexOf(v) >= 0)
}
/**
 * prefer ɑ or a for ɑɑ̄ɑ́ɑ̌ɑ̀ and aāáǎà
 * @param {string} s
 * @param {boolean} sw switch prefers
 * @returns {string}
 */
export function perfera(l, sw = false) {
    let a, A
    a = 'a'
    A = '\u0251' //'\u0251','ɑ'
    if (sw) {
        ;[a, A] = [A, a]
    }
    //sw
    let hd = s => {
        const tone = getToneNumber(s)
        if (tone > 4) return s.replace('a', A)
        return removeTone(s)
            .replace('a', A + toneMarks[tone - 1])
            .normalize('NFC')
    }
    return Array.isArray(l) ? l.map(hd) : hd(l)
}
