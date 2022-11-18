import { words, sentence } from './hanzi'
// import { words, sentence } from './mock-words'
// const { log } = console

const list = `"zhuyin" | "pinyin-numbered" | "pinyin-marked" | "mandarin" | "other"`
    .split(/ ?\| ?/)
    .map(v => v.replace(/\"/gi, ''))

test(`word-to-sentence`, () => {
    expect(words('你好')).toStrictEqual(['你', '好'])
    expect(words('hello world')).toStrictEqual(['hello', 'world'])
    expect(words('你好guojia')).toStrictEqual(['你', '好', 'guojia'])
    expect(words('你好 guo2 jia1')).toStrictEqual(['你', '好', 'guo2', 'jia1'])
})
test(`sentence-to-word`, () => {
    expect(sentence('你好')).toStrictEqual(`你好`)
    expect(sentence('hello world')).toStrictEqual(`hello world`)
    expect(sentence('你好guojia')).toStrictEqual(`你好 guojia`)
    expect(sentence('你好 guo2 jia1')).toStrictEqual(`你好 guo2 jia1`)
    expect(sentence('你  好 guo2      jia1')).toStrictEqual(`你好 guo2 jia1`)

    expect(sentence(['你', '好'])).toStrictEqual(`你好`)
    expect(sentence(['hello', 'world'])).toStrictEqual(`hello world`)
    expect(sentence(['你', '好', 'guojia'])).toStrictEqual(`你好 guojia`)

    // expect(sentence('wo3')).toStrictEqual(['wo3'])
    // expect(sentence('shì')).toStrictEqual(['shì'])
    // expect(sentence('你')).toStrictEqual(['你'])
    // expect(sentence('you')).toStrictEqual(['you'])
    // expect(sentence('wo3 xi3 huan3 ni3')).toStrictEqual(list[1])
})

// const { log } = console
// log(words(`你好`)) //[ '你', '好' ]
// log(words(`你好guojia`)) //[ '你', '好', 'guojia' ]
// log(words(`hello world`)) //[ 'hello', 'world' ]
// log(words(`你好 guo2 jia1`)) //prefer: [ '你', '好', 'guo2', 'jia1' ]
// log(words(`guo2 jia1`)) //[ 'guo2', 'jia1' ]
// log(sentence(['你', '好', 'guo2', 'jia1']))

//node scr/6.put-pkg-pac-preset.js o:tes
