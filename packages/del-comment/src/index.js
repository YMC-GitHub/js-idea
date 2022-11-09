/* eslint-disable prefer-const */
// @ymc/del-comment,@ymc/comment-preset-js,@ymc/comment-preset-shell
import delMatchedLine from '@ymc/del-macthed-line'
import { shOneLineCommentReg, jsOneLineCommentReg, jsMultiLineCommentReg, jsCommentReg } from './helps'
/**
 * delete comment
 * @param {deleteCommentOption} options
 * @returns {string}
 */
function delComment(options = {}) {
  const option = {
    text: '',
    ignoreComment: true,
    commentReg: [shOneLineCommentReg, jsOneLineCommentReg, jsMultiLineCommentReg, jsCommentReg],
    ...options
  }
  let { text, commentReg } = option
  commentReg = Array.isArray(commentReg) ? commentReg : [commentReg]
  if (option.ignoreComment) {
    commentReg.forEach(reg => {
      text = delMatchedLine({ text, reg })
    })
  }
  return text
}

export default delComment
