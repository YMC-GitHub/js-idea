// import { join } from 'path'

import { join } from './mock'
test(`mock-path-join`, () => {
    expect(join('../', 'helo')).toStrictEqual(`../helo`)
    expect(join('../', '../helo')).toStrictEqual(`../../helo`)

    join.sep = '\\'
    expect(join('../', 'helo')).toStrictEqual(`..\\helo`)
    expect(join('../', '../helo')).toStrictEqual(`..\\..\\helo`)
})
// const { log } = console
// node.js
// log(join('../', 'helo')) //..\helo
// log(join('../', '../helo')) //..\..\helo

// log(join('../', 'helo')) //../helo
// log(join('../', '../helo')) //../../helo

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/dep-parse/src/mock.spec.js
// node --no-warnings --loader ./scr/lib/esm-loader.js scr/6.put-pkg-pac-preset.js o:tes
