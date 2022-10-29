/**
  * getDirLoc v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

/**
 * get parent dir loc
 * @param {string} likepath
 * @param {{splitReg:regexp,split:string}} option
 */
function getDirLoc(likepath, option = {}) {
  const {
    split,
    splitReg
  } = {
    splitReg: /\/|\\/,
    split: '/',
    ...option
  };
  let list = likepath.split(splitReg || split);
  const {
    length
  } = list;

  if (length > 1) {
    list = list.slice(0, length - 1);
    list = list.join(split);
  } else {
    list = '';
  }

  return list;
}

module.exports = getDirLoc;
