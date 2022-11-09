/**
  * delComment v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["del-comment"] = factory());
})(this, (function () { 'use strict';

  /**
    * delMacthedLine v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */

  /* eslint-disable no-bitwise */

  /**
   * get str hash - custom fun
   * @param {String} str
   * @param {Boolean} caseSensitive
   * @return {Number} hashCode
   * @description
   * ```
   * //refs:
   * //https://www.cnblogs.com/Silababy/p/5226886.html
   * ```
   */
  function getHashCode(str, caseSensitive) {
    let txt = str;

    if (!caseSensitive) {
      txt = txt.toLowerCase();
    } // 1315423911=b'1001110011001111100011010100111'


    let hash = 1315423911;
    let i;
    let ch;

    for (i = txt.length - 1; i >= 0; i -= 1) {
      ch = txt.charCodeAt(i); // right-move-5-pos , left-move-2-pos

      hash ^= (hash << 5) + ch + (hash >> 2);
    }

    return hash & 0x7fffffff;
  }
  /* eslint-disable prefer-const */
  // @ymc/del-macthed-line

  /**
   * del macthed line
   * @param {{text:string,eof:string,deletedLabel:string,reg:regexp}} options
   * @returns {string}
   */


  function delMatchedLine(options = {}) {
    const option = {
      text: '',
      eof: '\n',
      deletedLabel: '',
      // need to make it specail! eg. str-hash
      reg: /^#/,
      ...options
    };
    let {
      text,
      eof,
      reg,
      deletedLabel
    } = option; // only work  one line
    // if (!Array.isArray(text)) {
    //     text = text.split(/\r?\n/)
    // }
    // text = text
    //     .map(line => {
    //         if (reg && reg.test(line)) {
    //             line = deletedLabel
    //         }
    //         return line
    //     })
    //     .filter(line => line != deletedLabel)
    // feat: set matched multi-line able
    // console.log(reg.test(text), reg)

    if (!deletedLabel) {
      deletedLabel = getHashCode(deletedLabel);
    } // log(`[info] replace match`)


    let res = text.replace(reg, deletedLabel); // log(`[info] replace label`)
    // desc: ignore deleted-label line

    if (!Array.isArray(res)) {
      res = res.split(/\r?\n/);
    } // if (deletedLabel) {
    //     res = res.filter(line => {
    //         let index = line.indexOf(deletedLabel)
    //         log(index)
    //         index = index !== -1
    //         if (!index) {
    //             log(`[info] will delete ${line}`)
    //         }
    //         return !index
    //     })
    //     log(res)
    // }
    // bugs: delete all empty line when deletedLabel=''


    if (deletedLabel) {
      res = res.filter(line => line.indexOf(deletedLabel) === -1);
    } // res = res.filter(line => line.indexOf(deletedLabel) === -1)


    res = res.join(eof);
    return res;
  }

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
    let {
      text,
      commentReg
    } = option;
    commentReg = Array.isArray(commentReg) ? commentReg : [commentReg];

    if (option.ignoreComment) {
      commentReg.forEach(reg => {
        text = delMatchedLine({
          text,
          reg
        });
      });
    }

    return text;
  }

  return delComment;

}));
