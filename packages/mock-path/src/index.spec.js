import { dirname, basename, extname, format, isAbsolute, parse, join } from './index'
let input = `packages/noop`

test(`mock-path-dirname`, () => {
    expect(dirname(input)).toStrictEqual(`packages`)
})
test(`mock-path-extanme`, () => {
    expect(extname('index')).toStrictEqual(``)
    expect(extname('index.md')).toStrictEqual(`.md`)
    expect(extname('.loaderrc')).toStrictEqual(`.loaderrc`)
    expect(extname('index.js')).toStrictEqual(`.js`)
})
test(`mock-path-basename`, () => {
    expect(basename(input)).toStrictEqual(`noop`)
    expect(basename('packages/noop/package.json')).toStrictEqual(`package.json`)
    expect(basename('packages/noop/package.json', '.json')).toStrictEqual(`package`)
})
test(`mock-path-format`, () => {
    expect(format({ name: 'index', ext: 'js' })).toStrictEqual(`index.js`)
    expect(format({ name: 'index', ext: '.js' })).toStrictEqual(`index.js`)
    expect(format({ base: 'index.js' })).toStrictEqual(`index.js`)
    expect(format({ dir: 'packages/noop', base: 'index.js' })).toStrictEqual(`packages/noop/index.js`)
    expect(format({ root: '/h/', base: 'index.js' })).toStrictEqual(`/h/index.js`)
    expect(format({ root: '/', base: 'index.js' })).toStrictEqual(`/index.js`)
    expect(format({ root: '/', dir: 'packages/noop', base: 'index.js' })).toStrictEqual(`packages/noop/index.js`)
})
test(`mock-path-isabsolute`, () => {
    expect(isAbsolute('.')).toBe(false)
    expect(isAbsolute('/')).toBe(true)
    expect(isAbsolute('C://')).toBe(true)
    // expect(isAbsolute('c://')).toBe(false) //in node.path it is false
    expect(isAbsolute('\\\\server')).toBe(true)
    expect(isAbsolute('//server')).toBe(true)

    //extend:
    //expect(isAbsolute('c://')).toBe(true)
})
test(`mock-path-parse`, () => {
    //
    expect(parse('.')).toEqual(expect.objectContaining({ root: '', dir: '', base: '.', ext: '', name: '.' }))
    expect(parse('/')).toEqual(expect.objectContaining({ root: '/', dir: '/', base: '', ext: '', name: '' }))
    expect(parse('C:\\')).toEqual(expect.objectContaining({ root: 'C:\\', dir: 'C:\\', base: '', ext: '', name: '' }))
    expect(parse('/h/index.js')).toEqual(
        expect.objectContaining({ root: '/', dir: '/h', base: 'index.js', ext: '.js', name: 'index' })
    )
    //extend:
    expect(parse('C://')).toEqual(expect.objectContaining({ root: 'C:/', dir: 'C:/', base: '', ext: '', name: '' }))
    expect(parse('c://')).toEqual(expect.objectContaining({ root: 'c:/', dir: 'c:/', base: '', ext: '', name: '' }))
})
test(`mock-path-join`, () => {
    expect(join('../', 'helo')).toStrictEqual(`../helo`)
    expect(join('../', '../helo')).toStrictEqual(`../../helo`)

    join.sep = '\\'
    expect(join('../', 'helo')).toStrictEqual(`..\\helo`)
    expect(join('../', '../helo')).toStrictEqual(`..\\..\\helo`)
})
