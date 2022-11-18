import getTextType from './pinyin-or-zhuyin'
// import { words, sentence } from './mock-words'
// const { log } = console

const list = `"zhuyin" | "pinyin-numbered" | "pinyin-marked" | "mandarin" | "other"`
    .split(/ ?\| ?/)
    .map(v => v.replace(/\"/gi, ''))

test(`get-text-type`, () => {
    expect(getTextType('ㄨㄛˇ')).toStrictEqual(list[0])

    expect(getTextType('wo3')).toStrictEqual(list[1])
    expect(getTextType('shì')).toStrictEqual(list[2])
    expect(getTextType('你')).toStrictEqual(list[3])
    expect(getTextType('you')).toStrictEqual(list[4])
    expect(getTextType('wo3 xi3 huan3 ni3')).toStrictEqual(list[1])
})

//node scr/6.put-pkg-pac-preset.js o:tes
