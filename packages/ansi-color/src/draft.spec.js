import { ansi, blue, bold } from './draft.js'

test('1 equal 1', () => {
    expect(1).toBe(1)
})
test('text equal text', () => {
    const text = 'this is blue text'
    // tes str
    expect(text).toBe(text)
    // toMatch
})
test('color equal color', () => {
    const text = 'this is blue text'
    const colortext = blue(text)
    // console.log([text])
    const exp = ['\x1B[34mthis is blue text\x1B[39m']
    const input = colortext

    // tes txt
    expect(input).toMatch(text) // has txt
    expect(input).toContain(exp[0])
    // tes arr

    // expect([input]).toContain(exp)
    // toContainEqual
})
test('style', () => {
    const codes = [34, 39]
    const name = 'blue'
    const style = ansi({ name, codes })

    // tes obj
    // 1.1
    expect(style).toHaveProperty('open')
    expect(style).toHaveProperty('close')
    expect(style).toHaveProperty('regex')
    expect(style).toHaveProperty('wrap')
    // getTag()

    // isTag
    expect(style.open).toMatch(defOpenTag(codes)) // has txt
    expect(style.close).toMatch(defCloseTag(codes)) // has txt

    // tes boo
    expect(isFunction(style.wrap)).toBeTruthy()

    // tes str
    function defTag(s) {
        return `\u001b[${s}m`
    }
    function defCloseTag(c) {
        return defTag(c[1])
    }
    function defOpenTag(c) {
        return defTag(c[0])
    }
    function isFunction(s) {
        return typeof s === 'function'
    }
})
// https://www.jianshu.com/p/c1b5676c1edd
