import main from './index'
test(`del-matched-line`, () => {
    let input = `
ad
//
#
/**  */
--
abc # -
abc //
abc /* xas */
/**
 * 
 *  asd 
 */

# -
`
    let res

    //   let shLineCommentReg = /\r?\n *#/gim
    //   let jsLineCommentReg = [/\r?\n *\/\//gim, /(\/)([*])+(.|\n)+?(\2\1)/gim]
    const shLineCommentReg = /(?:#.*)/gim // \r?\n *#/gim
    const jsLineCommentReg = [/((?:\/\*(?:[^*]|(?:\*+[^*/]))*\*+\/)|(?:\/\/.*))/gim]
    // const otherReg = [/(?:abc.*)/gim]

    //del sh-line comment
    res = main({ text: input, reg: shLineCommentReg })
    expect(res.indexOf('#') >= 0).toBe(false)
    expect(res.indexOf('//') >= 0).toBe(true)
    // console.log(res)
    //del js-line comment
    res = main({ text: input, reg: jsLineCommentReg[0] })
    expect(res.indexOf('#') >= 0).toBe(true)
    expect(res.indexOf('//') >= 0).toBe(false)

    // res = main({ text: input, reg: jsLineCommentReg[1] })
    // expect(res.indexOf('/*') >= 0).toBe(false)
    // expect(res.indexOf('//') >= 0).toBe(true)

    //del space line
    // res = main({text:input,reg: /^ *$/gi })
    // expect(/^ *$/gi.test(res)).toBe(false)
})
