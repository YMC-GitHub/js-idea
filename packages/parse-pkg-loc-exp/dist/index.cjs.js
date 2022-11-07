/**
  * parsePkgLocExp v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

/**
 * mock node.js path.dirname
 * @param {string} wkd
 * @returns
 */
function dirname(wkd, sep = '/') {
  const list = wkd.split(/\/?\\|\//);
  return list.slice(0, list.length - 1).join(sep);
}
/**
 * mock node.js path.basename
 * @param {string} wkd
 * @returns
 */


function basename(wkd) {
  const list = wkd.split(/\/?\\|\//);
  return list[list.length - 1];
}

/**
 * parse pkg loc exp
 * @param {string} loc
 * @returns {string[]}
 */


function parse(loc) {
  return [dirname(loc), basename(loc)];
}

module.exports = parse;
