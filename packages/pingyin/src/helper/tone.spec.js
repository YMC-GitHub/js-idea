import { codepointToUnicode, getToneNumber, removeTone, numberToMark, markToNumber, perfera } from './tone'
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

test(`code to unicode`, () => {
    expect(codepointToUnicode('6211')).toStrictEqual(`我`)
})
test(`get tone number`, () => {
    expect(getToneNumber('shì')).toBe(4)
    expect(getToneNumber('shi4')).toBe(4)
})
test(`del tone mark`, () => {
    expect(removeTone('shì')).toStrictEqual(`shi`)
    expect(removeTone('shi4')).toStrictEqual(`shi`)
})

test(`number to mark`, () => {
    expect(numberToMark('shi4')).toStrictEqual(`shì`)
    expect(numberToMark('wo3')).toStrictEqual(`wǒ`)
    expect(numberToMark('ni3')).toStrictEqual(`nǐ`)
    expect(sentence(numberToMark(words('wo3 shi4 ni3')))).toStrictEqual(`wǒ shì nǐ`)
    // expect(numberToMark('wo3 shi4 ni3')).toStrictEqual(`wǒ shì nǐ`) //wo shǐ ni
})

// stp 1.x - write pingying eazier like this:
// wo3 shi4 ni3
// stp 2.x - tone number to tone mark

test(`mark to number `, () => {
    expect(markToNumber('shì')).toStrictEqual(`shi4`)
    expect(markToNumber('wǒ')).toStrictEqual(`wo3`)
    expect(markToNumber('nǐ')).toStrictEqual(`ni3`)
    expect(sentence(markToNumber(words('wǒ shì nǐ')))).toStrictEqual(`wo3 shi4 ni3`)
    expect(sentence(markToNumber(words('ɑ̄ ɑ́ ɑ̌ ɑ̀')))).toStrictEqual(`\u02511 \u02512 \u02513 \u02514`)
    expect(sentence(markToNumber(words('ɑ̄ ɑ́ ɑ̌ ɑ̀')))).toStrictEqual(`ɑ1 ɑ2 ɑ3 ɑ4`)
})

test(`prefer-a`, () => {
    expect(numberToMark('a4', true)).toStrictEqual(`ɑ̀`)
    expect(numberToMark('a5', true)).toStrictEqual(`\u0251`)
    expect(sentence(numberToMark(words('a a1 a2 a3 a4')))).toStrictEqual(`a ā á ǎ à`)
    expect(sentence(numberToMark(words('a a1 a2 a3 a4'), true))).toStrictEqual(`ɑ ɑ̄ ɑ́ ɑ̌ ɑ̀`)

    expect(perfera('a4')).toStrictEqual(`ɑ̀`)
    expect(perfera('a1 a2 a3 a4'.split(' '))).toStrictEqual(['ɑ̄', 'ɑ́', 'ɑ̌', 'ɑ̀'])
    expect(perfera('a a1 a2 a3 a4'.split(' '), true)).toStrictEqual(`a ā á ǎ à`.split(' '))
    expect(perfera('a a1 a2 a3 a4'.split(' '))).toStrictEqual(`ɑ ɑ̄ ɑ́ ɑ̌ ɑ̀`.split(' '))
})
//node scr/6.put-pkg-pac-preset.js o:tes
