const shOneLineCommentReg = /(?:#.*)/gim // \r?\n *#/gim
const jsOneLineCommentReg = /(?:\/\/.*)/gim
const jsMultiLineCommentReg = /((?:\/\*(?:[^*]|(?:\*+[^*/]))*\*+\/))/gim
const jsCommentReg = /((?:\/\*(?:[^*]|(?:\*+[^*/]))*\*+\/)|(?:\/\/.*))/gim

export { shOneLineCommentReg, jsOneLineCommentReg, jsMultiLineCommentReg, jsCommentReg }
