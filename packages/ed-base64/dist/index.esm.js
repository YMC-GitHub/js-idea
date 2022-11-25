/**
  * edBase64 v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
/* eslint-disable no-unused-vars,no-restricted-syntax */

/**
 * get text from asii range
 * @param {number[]} range
 * @returns {string[]}
 * @sample
 * ```
 * fromCharCode([48,57])//0-9
 * fromCharCode([65,90])//A-Z
 * fromCharCode([97,121])//a-z
 * ```
 */
function fromCharCode(range) {
    const res = [];
    const [s, e] = range;
    for (let i = s; i <= e; i += 1) {
        res.push(String.fromCharCode(i));
    }
    return res
}

// bin,oct,dec,hex,..
// base64

/**
 *
 * @param {range[]} ranges
 * @returns {string[]}
 * @sample
 * ```
 * getCharsInRanges([[48,57],[65,90]],[97,121])
 * ```
 */
function getCharsInRanges(ranges) {
    const res = [];
    ranges.forEach(range => {
        res.push(fromCharCode(range));
    });
    return res.flat(Infinity)
}
/**
 *
 * @param {number[]} list
 * @returns
 */
function getCharsInDiscrete(list) {
    return list.map(v => String.fromCharCode(v))
}

/**
 * get base64 chars - table
 * @returns
 * @sample
 * ```
 * getBase64Chars().join('')
 * //ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./
 * ```
 */
function getBase64Chars() {
    // https://base64.guru/learn/base64-characters
    // https://www.iana.org/assignments/character-sets/character-sets.xhtml
    // letters,digits,symbols
    // A-Z: [65,90]
    // a-z: [97,122]
    // 0-9: [48,57]
    // +,/: 43,47

    // .,/:46,47

    const res = getCharsInRanges([
        [65, 90],
        [97, 122],
        [48, 57]
    ]);
    // res.push(...getCharsInDiscrete([43, 47]))
    res.push(...getCharsInDiscrete([46, 47]));
    return res
}

/**
 * shuffle array - vs array.sort+Math.random
 * @param {[]} array
 * @returns {[]}
 */
function shuffle(array) {
    const cache = [...array];
    // Fisher–Yates
    let j;
    let x;
    let i;
    const len = cache.length;
    const { floor, random } = Math;
    for (i = len; i; i -= 1) {
        j = floor(random() * i);
        x = cache[i - 1];
        cache[i - 1] = cache[j];
        cache[j] = x;
    }
    return cache
}

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
const atob = base64 => Buffer.from(base64, 'base64').toString('binary');

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
    return safeText.replace(CODE_EXPRESSION, getCharFromHexCode)
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
    return decodeURIComponent(result)
};

// https://developer.mozilla.org/zh-CN/docs/Web/API/btoa
// transfrom unit-16 text and unit8 text

// convert a Unicode string to a string in which
// each 16-bit unit occupies only one byte

/**
 *
 * @param {string} text
 * @returns
 * @sample
 * ```
 * btoa(getUnit8FromUnit16("☸☹☺☻☼☾☿"))
 * getBase64FromUnicode(getUnit8FromUnit16("☸☹☺☻☼☾☿"))
 * ```
 * @decsiption
 * ```
 * convert a Unicode string to a string in which
 * each 16-bit unit occupies only one byte
 * ## why?
 * - [x] encode unit-16 text to unit8 text
 * ## idea:
 * - [x] unit-16 text -> Uint16Array -> Uint8Array -> unit-8 text
 * ```
 */
function getUnit8FromUnit16(text) {
    const codeUnits = new Uint16Array(text.length);
    for (let i = 0; i < codeUnits.length; i += 1) {
        codeUnits[i] = text.charCodeAt(i);
    }
    const charCodes = new Uint8Array(codeUnits.buffer);
    let result = '';
    for (let i = 0; i < charCodes.byteLength; i += 1) {
        result += String.fromCharCode(charCodes[i]);
    }
    return result
}

/**
 *
 * @param {string} text
 * @returns
 * @sample
 * ```
 * let encoded = btoa(getUnit8FromUnit16("☸☹☺☻☼☾☿")
 * getUnit16FromUnit8(atob(encoded))
 *
 * encoded = getUnicodeFromBase64(getUnit8FromUnit16("☸☹☺☻☼☾☿")
 * getUnit16FromUnit8(getUnicodeFromBase64(encoded))
 * ```
 * @decsiption
 * ```
 * ## why?
 * - [x] decode unit-16 text from unit8 text
 * ## idea:
 * - [x] unit8-text -> Uint8Array -> Uint16Array -> unit-16 text
 * ```
 */
function getUnit16FromUnit8(text) {
    const bytes = new Uint8Array(text.length);
    for (let i = 0; i < bytes.length; i += 1) {
        bytes[i] = text.charCodeAt(i);
    }
    const charCodes = new Uint16Array(bytes.buffer);
    let result = '';
    for (let i = 0; i < charCodes.length; i += 1) {
        result += String.fromCharCode(charCodes[i]);
    }
    return result
}

/*eslint-disable */

function encode$2(string) {
    let utftext = '';
    string = string.replace(/\r\n/g, '\n');
    // idea:
    // put-eol
    for (let n = 0; n < string.length; n++) {
        const c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }

    return utftext
}

function decode$2(utftext) {
    let string = '';
    let i = 0;
    let c;
    let c2;
    let c3;
    c = c2 = 0;

    while (i < utftext.length) {
        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        } else if (c > 191 && c < 224) {
            c2 = utftext.charCodeAt(i + 1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = utftext.charCodeAt(i + 1);
            c3 = utftext.charCodeAt(i + 2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return string
}

/* eslint-disable  import/prefer-default-export */
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/* eslint-disable prefer-const,import/prefer-default-export */

/**
 *
 * @param {string} text
 * @param {string} map
 * @returns
 */
function encode$1(text, map) {
    const base64Code = map || chars;
    let res = '';
    let i = 0;

    while (i < text.length) {
        let char1;
        let char2;
        let char3;
        let enc1;
        let enc2;
        let enc3;
        let enc4;
        // get char 1,2,3
        char1 = text.charCodeAt(i++);
        char2 = text.charCodeAt(i++);
        char3 = text.charCodeAt(i++);
        // get enc 1,2,3,4
        enc1 = char1 >> 2; // 取第 1 字节的前 6 位
        if (isNaN(char2)) {
            // 只有 1 字节的时候
            enc2 = ((char1 & 3) << 4) | (0 >> 4);
            // 第65个字符用来代替补位的 = 号
            enc3 = enc4 = 64;
        } else if (isNaN(char3)) {
            // 只有 2 字节的时候
            enc2 = ((char1 & 3) << 4) | (char2 >> 4);
            enc3 = ((char2 & 15) << 2) | (0 >> 6);
            enc4 = 64;
        } else {
            enc2 = ((char1 & 3) << 4) | (char2 >> 4); // 取第 1 个字节的后 2 位(3 = 11 << 4 = 110000) + 第 2 个字节的前 4 位
            enc3 = ((char2 & 15) << 2) | (char3 >> 6); // 取第 2 个字节的后 4 位 (15 = 1111 << 2 = 111100) + 第 3 个字节的前 2 位
            enc4 = char3 & 63; // 取最后一个字节的最后 6 位 (63 = 111111)
        }
        res += base64Code.charAt(enc1) + base64Code.charAt(enc2) + base64Code.charAt(enc3) + base64Code.charAt(enc4);
    }

    return res
}

/* eslint-disable import/prefer-default-export,no-multi-assign */
/**
 *
 * @param {string} text
 * @param {string} map
 * @returns
 */
function decode$1(text, map) {
    let output = '';
    let chr1;
    let chr2;
    let chr3 = '';
    let enc1;
    let enc2;
    let enc3;
    let enc4 = '';
    const keyStr = map || chars;
    let i = 0;
    if (text.length % 4 !== 0) {
        return ''
    }
    // let base64test = /[^A-Za-z0-9\+\/\=]/g
    // if (base64test.exec(text)) {
    //     return ''
    // }
    do {
        enc1 = keyStr.indexOf(text.charAt(i++));
        enc2 = keyStr.indexOf(text.charAt(i++));
        enc3 = keyStr.indexOf(text.charAt(i++));
        enc4 = keyStr.indexOf(text.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;
        output += String.fromCharCode(chr1);
        if (enc3 !== 64) {
            output += String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output += String.fromCharCode(chr3);
        }
        chr1 = chr2 = chr3 = '';
        enc1 = enc2 = enc3 = enc4 = '';
    } while (i < text.length)
    return output
}

function randomKeys() {
    let keys = getBase64Chars();
    keys = shuffle(keys).join('');
    keys = `${keys}=`;
    return keys
}

/**
 *
 * @param {string} text
 * @returns
 */
function encode(text) {
    // return getBase64FromBinary(encodeUri(text))
    return encode$1(encodeUri(text))
}
/**
 *
 * @param {string} base64
 * @returns
 */
function decode(base64) {
    // return decodeUri(getBinaryFromBase64(base64))
    return decodeUri(decode$1(base64))
}

export { decode, decode$1 as decodeBase64, getUnit8FromUnit16 as decodeUnit16, decodeUri, decode$2 as decodeUtf8, encode, encode$1 as encodeBase64, getUnit16FromUnit8 as encodeUnit16, encodeUri, encode$2 as encodeUtf8, btoa as getBase64FromBinary, atob as getBinaryFromBase64, randomKeys };
