/**
  * edUnicode v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["ed-unicode"] = {}));
})(this, (function (exports) { 'use strict';

    // relative shuffle array - extend array

    /**
     * shuffle array - vs array.sort+Math.random
     * @param {[]} array
     * @returns {[]}
     */
    function shuffle(array) {
      const cache = [...array]; // https://zhuanlan.zhihu.com/p/359994957
      // Fisher–Yates

      let j;
      let x;
      let i;
      const len = cache.length;
      const {
        floor,
        random
      } = Math;

      for (i = len; i; i -= 1) {
        j = floor(random() * i);
        x = cache[i - 1];
        cache[i - 1] = cache[j];
        cache[j] = x;
      }

      return cache;
    } // /**
    //  * shuffle array - array.sort+Math.random
    //  * @param {[]} array
    //  * @returns {[]}
    //  */
    // function shuffle(array) {
    //     return array.sort(function () {
    //         return Math.random() - 0.5
    //     })
    // }

    /**
     * gen random fn
     * @param {()=>string[]} fn
     * @returns {(length:number)=>string}
     */

    function randomFnGenerateor(fn) {
      /**
       * get random chars
       * @param {number} length
       * @returns {string}
       */
      return function randomValues(length) {
        let chars = fn();
        let res = [];

        for (let i = 0; i < 100000; i += 1) {
          chars = shuffle(chars);
        }

        res = chars.slice(0, length);
        return res.join('');
      };
    } // /**
    //  * get random int
    //  * @param {number} min
    //  * @param {number} max
    //  * @returns
    //  */
    // function randomInt(min, max) {
    //     let { random } = Math
    //     return parseInt((max - min) * random() + min)
    // }

    // import { str2hex, hex2str } from './transform/hex'
    // loc2bin,bin2buf

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

      return res;
    } // bin,oct,dec,hex,..
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
      return res.flat(Infinity);
    }
    /**
     *
     * @returns {string[]}
     * @sample
     * ```
     * getEnglishChars().join('')
     * //abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXYZ
     * ```
     */


    function getEnglishChars() {
      // https://www.ascii-code.com/
      // simboy,dec,oct,hex,bin,htmlnumber,htmlenty
      // 0-9: [48,57]
      // A-Z: [65,90]
      // a-z: [97,122]
      const res = [];
      const ranges = [[97, 121], [65, 90]];
      ranges.forEach(range => {
        res.push(fromCharCode(range));
      });
      return res.flat(Infinity);
    }
    /**
     * get random enlish chars
     * @param {number} length
     * @returns {string}
     * @sample
     * ```
     * randomEnglishChars(16)
     * //bdBSwheIpFLNlsCZ
     * ```
     */


    function randomEnglishChars(length) {
      let chars = getEnglishChars();
      let res = [];

      for (let i = 0; i < 100000; i += 1) {
        chars = shuffle(chars);
      }

      res = chars.slice(0, length);
      return res.join('');
    }
    /**
     *
     * @returns {string}
     * @sample
     * ```
     * getHexChars().join('')
     * //0123456789abcdef
     * ```
     */


    function getHexChars() {
      return getCharsInRanges([[48, 57], [97, 97 + 6 - 1]]);
    }
    /**
     * get random hex chars
     * @param {number} length
     * @returns {string}
     * @sample
     * ```
     * randomHexChars(16)
     * //5364bc728ad190ef
     * ```
     */


    function randomHexChars(length) {
      let chars = getHexChars(); // log(chars)

      let res = [];

      for (let i = 0; i < 100000; i += 1) {
        chars = shuffle(chars);
      }

      res = chars.slice(0, length);
      return res.join('');
    }
    /**
     * get base32 chars
     * @returns
     * @sample
     * ```
     * getBase32Chars().join('')
     * //123456789ABCDEFGHJKLMNOPQRTUVWXY
     * //with out '0ISZ'
     * ```
     */


    function getBase32Chars() {
      const list = getCharsInRanges([[48, 57], [65, 90]]); // del 0,I,S,Z

      const res = [];
      list.forEach(v => {
        if ('0ISZ'.indexOf(v) === -1) {
          res.push(v);
        }
      });
      return res;
    }
    /**
     * get random base32 chars
     * @param {number} length
     * @returns {string}
     * @sample
     * ```
     * randomBase32Chars(16)
     * //TJLYXPN81BQ7KMUG
     * ```
     */


    const randomBase32Chars = randomFnGenerateor(getBase32Chars);
    /**
     *
     * @param {number[]} list
     * @returns
     */

    function getCharsInDiscrete(list) {
      return list.map(v => String.fromCharCode(v));
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
      const res = getCharsInRanges([[65, 90], [97, 122], [48, 57]]); // res.push(...getCharsInDiscrete([43, 47]))

      res.push(...getCharsInDiscrete([46, 47]));
      return res;
    }
    /**
     * get random base64 chars - random
     * @param {number} length
     * @returns {string}
     * @sample
     * ```
     * randomBase64Chars(16)
     * //DBfz.472cjqASWvi
     * ```
     */


    const randomBase64Chars = randomFnGenerateor(getBase64Chars); // ^[A-Za-z0-9+/]+={0,2}$

    exports.getBase32Chars = getBase32Chars;
    exports.getBase64Chars = getBase64Chars;
    exports.getEnglishChars = getEnglishChars;
    exports.getHexChars = getHexChars;
    exports.randomBase32Chars = randomBase32Chars;
    exports.randomBase64Chars = randomBase64Chars;
    exports.randomEnglishChars = randomEnglishChars;
    exports.randomHexChars = randomHexChars;
    exports.shuffle = shuffle;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
