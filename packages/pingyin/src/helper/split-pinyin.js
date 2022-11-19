import syllables from '../data/syllables'

/**
 * del tone
 * @param {string} text
 * @returns
 */
const normalize = text => {
    let pure = text
    pure = pure.normalize('NFD').replace(/\u0304|\u0301|\u030c|\u0300/g, '')
    return pure
        .normalize('NFC')
        .replace(/(\w|ü)[1-5]/gi, '$1')
        .toLowerCase()
}

/**
 *
 * @param {string} text (non-spaced) text to split into Pinyin syllables
 * @param {boolean} everything include non-Pinyin text in result
 * @param {boolean} wrapInList distinguish Pinyin syllables from non-Pinyin text
 * by wrapping them into a 1 value array
 * @returns
 */
export function split(text, everything = false, wrapInList = false) {
    const list = []
    let prevWordFound = false
    let wordEnd = text.length
    while (wordEnd > 0) {
        let count = wordEnd
        let wordFound = false
        while (count > 0) {
            // idea:get-word,word-in-syllables,add-word-to-list
            const word = text.substring(wordEnd - count, wordEnd)
            if (syllables.includes(normalize(word))) {
                wordFound = true
                list.push(wrapInList ? [word] : word)
                wordEnd -= count - 1
                break
            }
            count -= 1
        }
        if (!wordFound && everything) {
            const prevIndex = list.length - 1
            const prevEntry = list[prevIndex]
            if (wordEnd === text.length || typeof prevEntry === 'object' || prevWordFound) {
                list.push(text[wordEnd - 1])
            } else if (typeof prevEntry === 'string') {
                list[prevIndex] = text[wordEnd - 1] + prevEntry
            }
        }
        wordEnd -= 1
        prevWordFound = wordFound
    }
    return list.reverse()
}

export default split
