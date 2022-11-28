import { addDateMethods, formatDate } from './helps'

function isFunction(s) {
    return typeof s === 'function'
}
test(`formatDate`, () => {
    expect(formatDate(`yyyy`, new Date(`2022-11-28 12:18:01`))).toBe(`2022`)
})

test(`addDateMethods`, () => {
    expect(isFunction(String.prototype.isFunction)).toBe(false)
    addDateMethods({ isFunction }, String)
    expect(isFunction(String.prototype.isFunction)).toBe(true)
    expect(isFunction(''.isFunction)).toBe(true)
})
