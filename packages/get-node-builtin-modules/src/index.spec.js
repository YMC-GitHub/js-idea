import main from './index'
test(`get-node-builtin-module`, () => {
  let res = main()
  expect(res).toEqual(expect.arrayContaining(['os']))
  expect(res).not.toEqual(expect.arrayContaining(['hi']))
})

// node scr/6.put-pkg-pac-preset.js o:tes
