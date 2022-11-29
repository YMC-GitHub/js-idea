/**
  * replaceExt v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import { extname } from '@ymc/mock-path';

// refs:
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
        return path
    }

    // feat: return itself when no string value
    if (typeof path !== 'string') {
        return path
    }

    // feat: return itself when zero length
    if (path.length === 0) {
        return path
    }

    // feat: return itself when no ext in path
    const exttext = extname(path);
    if (!exttext) {
        return path
    }

    const reg = new RegExp(`${exttext}$`, 'i');
    return path.replace(reg, ext)
}

export { replaceExt as default };
