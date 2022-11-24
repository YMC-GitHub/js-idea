import { encode } from './encode'
// import { decode } from './decode'

test(`encode-base64`, () => {
    expect(encode(`123`)).toBe(`MTIz`)
    expect(encode(`abc`)).toBe(`YWJj`)
    expect(encode(`yemiancheng`)).toBe(`eWVtaWFuY2hlbmc=`)
})
