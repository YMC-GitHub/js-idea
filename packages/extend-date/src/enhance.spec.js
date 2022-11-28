import './enhance'

function isFunction(s) {
    return typeof s === 'function'
}

test(`add-prototype-function`, () => {
    expect(isFunction(Date.prototype.format)).toBe(true)
    expect(isFunction(new Date().format)).toBe(true)
})
test(`date.format`, () => {
    expect(new Date(`2022-11-28 12:18:01`).format(`yyyy`)).toBe(`2022`)
})
