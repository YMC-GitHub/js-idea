import { dirname, basename, extname, format, isAbsolute, join } from './index'
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
    expect(isAbsolute('c://')).toBe(false)
    expect(isAbsolute('\\\\server')).toBe(true)
    expect(isAbsolute('//server')).toBe(true)
})
test(`mock-path-join`, () => {
    expect(join('../', 'helo')).toStrictEqual(`../helo`)
    expect(join('../', '../helo')).toStrictEqual(`../../helo`)

    join.sep = '\\'
    expect(join('../', 'helo')).toStrictEqual(`..\\helo`)
    expect(join('../', '../helo')).toStrictEqual(`..\\..\\helo`)
})
