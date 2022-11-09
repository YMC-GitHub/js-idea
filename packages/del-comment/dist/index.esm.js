/**
  * delComment v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import delMatchedLine from '@ymc/del-macthed-line';

const shOneLineCommentReg = /(?:#.*)/gim; // \r?\n *#/gim
const jsOneLineCommentReg = /(?:\/\/.*)/gim;
const jsMultiLineCommentReg = /((?:\/\*(?:[^*]|(?:\*+[^*/]))*\*+\/))/gim;
const jsCommentReg = /((?:\/\*(?:[^*]|(?:\*+[^*/]))*\*+\/)|(?:\/\/.*))/gim;

/* eslint-disable prefer-const */
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
  };
  let { text, commentReg } = option;
  commentReg = Array.isArray(commentReg) ? commentReg : [commentReg];
  if (option.ignoreComment) {
    commentReg.forEach(reg => {
      text = delMatchedLine({ text, reg });
    });
  }
  return text
}

export { delComment as default };
