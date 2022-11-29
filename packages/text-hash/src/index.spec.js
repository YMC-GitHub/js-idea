import encode from './index'
test(`encode`, () => {
    expect(encode({ method: 'md5', data: '201606300005', encoding: 'hex' })).toBe(`1b04c9b4f1e85a4a9174a7db3d6f5df2`)
})
