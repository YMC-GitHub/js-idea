import { basename, dirname } from './mock'
let input = `packages/noop`

test(`mock-path-dirname`, () => {
    expect(dirname(input)).toStrictEqual(`packages`)
})
test(`mock-path-basename`, () => {
    expect(basename(input)).toStrictEqual(`noop`)
})
