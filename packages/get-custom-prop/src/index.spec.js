//
import getCustomProp from './index'
function customStatSync() {}
function statSync() {}
function noop() {}
test(`get-custom-property`, () => {
    let option = { hi: 'hi' }
    let custom
    //method

    // get custom if presence
    option = { hi: 'hi', statSync, customStatSync }
    custom = getCustomProp(option, 'statSync', noop)
    console.log(option)
    expect(option).toHaveProperty('customStatSync')
    expect(custom).toEqual(customStatSync)

    // get native if custom no presence
    option = { hi: 'hi', statSync }
    custom = getCustomProp(option, 'statSync', noop)
    expect(option).toHaveProperty('statSync')
    expect(option).not.toHaveProperty('customStatSync')
    expect(custom).toEqual(statSync)

    // get defalt if native no presence
    option = { hi: 'hi' }
    custom = getCustomProp(option, 'statSync', noop)
    expect(option).toHaveProperty('hi')
    expect(option).not.toHaveProperty('statSync')
    expect(option).not.toHaveProperty('customStatSync')
    expect(custom).toEqual(noop)

    //prop
    option = { hi: 'hi' }
    custom = getCustomProp(option, 'hi', 'hello')
    expect(option).toHaveProperty('hi')
    expect(option).toEqual(expect.not.objectContaining({ customHi: 'hello' }))
    expect(custom).toStrictEqual('hi')

    option = { hi: 'hi', customHi: 'hello' }
    custom = getCustomProp(option, 'hi', 'hello')
    expect(option).toHaveProperty('hi')
    expect(option).toHaveProperty('customHi')
    expect(custom).toStrictEqual('hello')
})
