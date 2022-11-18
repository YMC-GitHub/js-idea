import split from './split-pinyin'
const { log } = console
/**
 * sentence to word array
 * @param {string} s
 * @param {string|regexp} sc
 * @returns {string[]}
 */
function words(s, sc = / +/) {
    return sc.test(s) ? s.split(sc) : [s]
}
/**
 * word array to sentence
 * @param {string[]|string} s
 * @returns {string}
 */
function sentence(s) {
    return Array.isArray(s) ? s.join(' ') : s
}

test(`split pingyin`, () => {
    expect(split('shì')).toStrictEqual([`shì`])
    expect(split('wǒ')).toStrictEqual([`wǒ`])
    expect(split('nǐ')).toStrictEqual([`nǐ`])
    expect(split('wǒ shì nǐ')).toStrictEqual(words('wǒ shì nǐ'))
    expect(split('wo3 shi4 ni3')).toStrictEqual(words('wo3 shi4 ni3'))
    expect(split('wo shi ni')).toStrictEqual(words('wo shi ni'))
})

//node scr/6.put-pkg-pac-preset.js o:tes
