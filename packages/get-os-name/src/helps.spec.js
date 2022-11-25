import { toObjectSet, getKWByVal } from './helps'

test('one-line text to object set', () => {
    let input = 'mac=darwin;win=win32,win64;linux=linux;android=android'
    let out = toObjectSet(input)
    expect(out).toHaveProperty(`mac`)
    expect(out).toHaveProperty(`win`)
    expect(out).toHaveProperty(`linux`)
    expect(out).toHaveProperty(`android`)
    expect(out['win']).toEqual(expect.arrayContaining(['win32', 'win64']))
    expect(out['mac']).toEqual(expect.arrayContaining(['darwin']))
    expect(out['linux']).toEqual(expect.arrayContaining(['linux']))
    expect(out['android']).toEqual(expect.arrayContaining(['android']))
})
test('get val or kw in map when match val', () => {
    let input = 'mac=darwin;win=win32,win64;linux=linux;android=android'
    let res = toObjectSet(input)
    expect(getKWByVal(res, 'darwin')).toEqual(`mac`)
    expect(getKWByVal(res, 'win64')).toEqual(`win`)
    expect(getKWByVal(res, 'win32')).toEqual(`win`)
    expect(getKWByVal(res, 'linux')).toEqual(`linux`)
    expect(getKWByVal(res, 'android')).toEqual(`android`)
})
