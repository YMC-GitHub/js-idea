import { fromPinyin } from './zhuyin'

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

test(`zhuyin from pingyin`, () => {
    expect(fromPinyin('wǒ')).toStrictEqual(words(`ㄨㄛˇ`))
    expect(fromPinyin('shì')).toStrictEqual(words('ㄕ`')) //ㄕ
    expect(fromPinyin('nǐ')).toStrictEqual(words(`ㄋㄧˇ`))
    expect(fromPinyin('wǒ shì nǐ')).toStrictEqual(words('ㄨㄛˇ ㄕ` ㄋㄧˇ'))
    expect(fromPinyin('wo3 shi4 ni3')).toStrictEqual(words('ㄨㄛˇ ㄕ` ㄋㄧˇ'))
    expect(fromPinyin('wo shi ni')).toStrictEqual(words('ㄨㄛ˙ ㄕ˙ ㄋㄧ˙'))
})

//node scr/6.put-pkg-pac-preset.js o:tes
