import repalceExt from './index'
test(`repalce-ext`, () => {
    expect(repalceExt(`hello.txt`, '')).toBe(`hello.txt`)
    expect(repalceExt(true, '.md')).toBe(true)
    expect(repalceExt(``, '.md')).toBe(``)
    expect(repalceExt(`hello`, '.md')).toBe(`hello`)
    expect(repalceExt(`hello.txt`, '')).toBe(`hello.txt`)
    expect(repalceExt(`hello.txt`, '.md')).toBe(`hello.md`)
})
