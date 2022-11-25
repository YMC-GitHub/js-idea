import main from './index'
import { shOneLineCommentReg, jsOneLineCommentReg, jsMultiLineCommentReg, jsCommentReg } from './helps'

test(`del-js-comment`, () => {
    let input = `
s:
ad
// js one line comment

//
// abc
/* xas */
/* xas */ abc
abc /* xas */

// js multi line comment
/**
 * 
 *  asd 
 */

/**  */

// sh one line comment
#
# abc
abc # -
--
# -
e:
`
    let res

    //del sh-line comment
    res = main({ text: input, commentReg: shOneLineCommentReg })
    expect(res.indexOf('#') >= 0).toBe(false)
    expect(res.indexOf('//') >= 0).toBe(true)
    // console.log(res)
    //del js-line comment
    res = main({ text: input, commentReg: jsCommentReg })
    expect(res.indexOf('#') >= 0).toBe(true)
    expect(res.indexOf('//') >= 0).toBe(false)
})
