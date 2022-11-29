import pip from './index'

const hash = async string => `${string} hash`
const base64 = async string => `${string} base64`
//https://jestjs.io/docs/tutorial-async#asyncawait
test(`pipe-async-functions`, async () => {
    expect.assertions(1)
    let magic = pip(hash, base64)
    const data = await magic(`secret`)
    expect(data).toBe(`secret hash base64`)
})
