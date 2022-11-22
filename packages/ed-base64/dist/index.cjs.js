/**
  * edBase64 v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * binary-format to base64-format - with Buffer.from
 * @param {string} text
 * @returns
 */
const btoa = text => Buffer.from(text, 'binary').toString('base64');
/**
 * base64-format to binary-format - with Buffer.from
 * @param {string} base64
 * @returns
 */

const atob = base64 => Buffer.from(base64, 'base64').toString('binary'); // method alias

const getBase64FromBinary = btoa;
const getBinaryFromBase64 = atob;

const CODE_EXPRESSION = /%([0-9A-F]{2})/g;
/**
 * get char from hex code
 * @param {*} part
 * @param {string} hex
 * @returns
 */

const getCharFromHexCode = (part, hex) => String.fromCharCode(parseInt(hex, 16));
/**
 * encode uri chars
 * @param {string} text
 * @returns
 */


const encodeUri = text => {
  const safeText = encodeURIComponent(text);
  return safeText.replace(CODE_EXPRESSION, getCharFromHexCode);
};
/**
 * decode uri chars
 * @param {string} text
 * @returns
 */

const decodeUri = text => {
  let result = '';

  for (let i = 0; i < text.length; i += 1) {
    const code = text.charCodeAt(i);
    result += '%';

    if (code < 16) {
      result += '0';
    }

    result += code.toString(16);
  }

  return decodeURIComponent(result);
}; // method alias

const encodeUnicode = encodeUri;
const decodeUnicode = decodeUri;

/**
 *
 * @param {string} text
 * @returns
 */

function encode(text) {
  return getBase64FromBinary(encodeUnicode(text));
}
/**
 *
 * @param {string} base64
 * @returns
 */

function decode(base64) {
  return decodeUnicode(getBinaryFromBase64(base64));
}

exports.decode = decode;
exports.encode = encode;
