/**
  * slash v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

/**
 *
 * @param {string} path
 * @returns {string}
 */
function slash(path) {
  // feat: return itself when no string value
  if (typeof path !== 'string') {
    return path;
  } // feat: return itself when zero length


  if (path.length === 0) {
    return path;
  } // feat: return itself when start with '\\\?\'


  const isExtendedLengthPath = /^\\\\\?\\/.test(path);

  if (isExtendedLengthPath) {
    return path;
  } // feat: backslash path to forward slashes path


  return path.replace(/\\/g, '/');
}

module.exports = slash;
