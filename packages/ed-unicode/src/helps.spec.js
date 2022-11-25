import { countBytes, getTextLength, countWord, countHanzi, countChars } from './helps'
// test(`countBytes`, () => {
//     // expect(countBytes(`abc`)).toBe(3)
//     // expect(countBytes(`ɑ̄ɑ́ɑ̌ɑ̀`)).toBe(16)
//     // expect(countBytes(`我`)).toBe(2)//3
// })

test(`getTextLength`, () => {
    expect(getTextLength(`abc`)).toBe(3)
    expect(getTextLength(`ɑ̄ɑ́ɑ̌ɑ̀`)).toBe(8) //8? 4?
    // expect(countBytes(`我`)).toBe(2)//3
})

test(`count-word`, () => {
    expect(countWord(`abc`)).toBe(1)
    expect(countWord(`a b c`)).toBe(3)
    // expect(countBytes(`我`)).toBe(1)
})
test(`count-hanzi`, () => {
    expect(countHanzi(`abc`)).toBe(0)
    expect(countHanzi(`我`)).toBe(1)
    expect(countHanzi(`我们`)).toBe(2)
    expect(countHanzi(`我们 - web`)).toBe(2)
})

test(`count-chars`, () => {
    expect(countChars(`abc`)).toStrictEqual({
        zishu: 0,
        hanzi: 0,
        biaodian: 0,
        zimu: 3,
        zifu: 3
    })
    expect(countChars(`我`)).toStrictEqual({
        zishu: 1,
        hanzi: 1,
        biaodian: 0,
        zimu: 0,
        zifu: 2
    })
})
