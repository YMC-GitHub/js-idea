import { encode } from './encode'
import { decode } from './decode'
import { getBase64Chars, shuffle } from './chore'

function getKeys() {
    let keys = getBase64Chars()
    keys = shuffle(keys).join('')
    keys = `${keys}=`
    return keys
}
function ec(k) {
    return encode(k)
}
function de(k, def) {
    let keys
    keys = def ? def : getKeys()

    return decode(encode(k, keys), keys)
}
function dc(k) {
    return decode(k)
}

test(`encode-base64-with-default-keys`, () => {
    expect(ec(`123`)).toBe(`MTIz`)
    expect(ec(`abc`)).toBe(`YWJj`)
    expect(ec(`yemiancheng`)).toBe(`eWVtaWFuY2hlbmc=`)
})

test(`decode-base64-with-default-keys`, () => {
    expect(dc(`MTIz`)).toBe(`123`)
    expect(dc(`YWJj`)).toBe(`abc`)
    expect(dc(`eWVtaWFuY2hlbmc=`)).toBe(`yemiancheng`)
})
test(`decode-base64-with-custom-keys`, () => {
    let keys = getKeys()
    // console.log(keys)
    keys = `UltOeXafVpNqA8PEkCng1Z.DdKJ0hF7iGxwHQb53uYIyBcjM9mrW2/voSzs6TLR4=`
    //
    // expect(encode(`yemiancheng`, keys)).toBe(`7.ZcJ.Xjdvxb05h=`)
    // expect(decode(`7.ZcJ.Xjdvxb05h=`, keys)).toBe(`yemiancheng`)

    let vals = `123|MTIz;abc|YWJj;yemiancheng|eWVtaWFuY2hlbmc=`
    // vals.split(';').forEach(v => {
    //     let [text, encoded] = v.split('|')
    //     expect(dc(encoded)).toBe(text)
    //     // expect(de(text)).toBe(text)
    // })

    vals.split(';').forEach(v => {
        let [text, encoded] = v.split('|')
        expect(encode(text, vals)).not.toBe(encoded)
        expect(de(text)).toBe(text)
    })
})
