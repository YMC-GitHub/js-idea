import slash from './index'
test(`slash-path`, () => {
    expect(slash(true)).toBe(true)
    expect(slash(``)).toBe(``)
    expect(slash(`\\\\?\\text\\hello.txt`)).toBe(`\\\\?\\text\\hello.txt`)
    expect(slash(`text\\hello.txt`)).toBe(`text/hello.txt`)
})
