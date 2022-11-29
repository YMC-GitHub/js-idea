/**
  * replaceExt v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

/**
  * mockPath v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
/**
 * mock node.js path.extname
 * @param {string} wkd
 * @returns {string}
 */


function extname(wkd) {
  const reg = /(.*)?\./gi;
  if (!reg.test(wkd)) return '';
  const res = wkd.trim().replace(/(.*)?\./gi, '');
  return res ? `.${res}` : '';
}

// https://github.com/gulpjs/replace-ext

/**
 *
 * @param {string} path
 * @param {string} ext
 * @returns {string}
 */

function replaceExt(path, ext) {
  // feat: return itself when no passed ext
  if (!ext) {
    return path;
  } // feat: return itself when no string value


  if (typeof path !== 'string') {
    return path;
  } // feat: return itself when zero length


  if (path.length === 0) {
    return path;
  } // feat: return itself when no ext in path


  const exttext = extname(path);

  if (!exttext) {
    return path;
  }

  const reg = new RegExp(`${exttext}$`, 'i');
  return path.replace(reg, ext);
}

module.exports = replaceExt;
