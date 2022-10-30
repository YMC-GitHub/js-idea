/**
  * copyFile v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

var node_fs = require('node:fs');

// import { parse as parsePath } from 'path'
/**
 * copy file from src to des
 * @param {string} src
 * @param {string} des
 * @sample
 * ```
 * copyFile('favicon.png'),`data/favicon/favicon.png`)
 * copyFile('jest.config.lib.js'),`conf/jest/base.js`)
 * ```
 * @description
 * ```
 * src file does not exsit ? no copy.
 * des file does exsit ? no copy.
 * des file path does not exsit ? make dirs then copy.
 * copy with stream !
 * warn: no promise and no sync!
 * todo: (after copty ,resolve)
 * ```
 */

const copyFile = (src, des) => new Promise((resolve, reject) => {
  if (!src || !node_fs.existsSync(src)) resolve();
  if (!des) resolve();
  if (node_fs.existsSync(des)) resolve(); // desc-x-s: add dir if no exsits

  const dir = getDirLoc(des);

  if (dir && (dir !== './' || dir !== '.')) {
    node_fs.mkdirSync(dir, {
      recursive: true
    });
  } // mkdirSync(parsePath(des).dir, { recursive: true })
  // desc-x-e: add dir if no exsits


  const reader = node_fs.createReadStream(src);
  const writer = node_fs.createWriteStream(des); // desc-x-s: handle event finish and err

  writer.on('finish', () => {
    resolve(des);
  }).on('error', reject); // desc-x-e: handle event finish and err

  reader.pipe(writer);
}); // const copyFile = (src, des) => {
//     if (!src || !existsSync(src)) return
//     if (!des) return
//     if (existsSync(des)) return
//     mkdirSync(parsePath(des).dir, { recursive: true })
//     createReadStream(src).pipe(createWriteStream(des))
// }

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

module.exports = copyFile;
