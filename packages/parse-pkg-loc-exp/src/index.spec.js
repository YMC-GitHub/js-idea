import main from './index'
test(`parse-pkg-loc-exp`, () => {
    let input = './packages/noop'
    let [libdir, libname] = main(input)
    expect(libdir).toStrictEqual(`./packages`)
    expect(libname).toStrictEqual(`noop`)
})
