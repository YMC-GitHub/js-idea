/**
  * extendString v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["extend-string"] = {}));
})(this, (function (exports) { 'use strict';

    // @ymc/extend-string
    /**
     *
     * @param {string} name
     * @param {()=>{}} handle
     */


    function extendStringPrototype(name, handle) {
      let tobeExtende = String.prototype;

      if (!tobeExtende[name]) {
        // tobeExtende[name] = function(){return handle(this)}
        // function (...args){return padEndString(this,...args)}
        tobeExtende[name] = function (...args) {
          return handle(this, ...args);
        };
      } //String.prototype.humanize= function(){return humanize(this)}

    }
    /**
     *
     * @param {*} s
     * @returns {string}
     * @sample
     * ```
     * humanize('per_page')// Per page
     * humanize('per-page')// Per page
     * ```
     * @description
     * ```
     * ## idea
     * - [x] replace multi - or _ to one space
     * - [x] add space to the char that is uppercase and is not the first index
     * - [x] the first char to upper ,other lowercase
     * ```
     */


    function humanize(s) {
      return s.replace(/(?:^\w|[A-Z_-]|\b\w)/g, (word, index) => {
        let res = ''; // log(word, index); //desc: for debug
        //feat: replace multi - or _ to one space

        res = word.replace(/[-_]+/g, ' '); //feat: add space to the char that is uppercase and is not the first index

        res = index !== 0 ? res.replace(/[A-Z]/, ' $&') : res; //feat: the first char to upper ,other lowercase

        return index === 0 ? res.toUpperCase() : res.toLowerCase();
      }).replace(/\s+/g, ' ');
    }

    extendStringPrototype('humanize', humanize); // expectString(humanize('per_page'),'Per page')
    // expectString(humanize('per-page'),'Per page')
    // expectString(humanize('per page'),'Per page')
    // expectString(humanize('per  paGe'),'Per pa ge')
    // expectString('per  paGe'.humanize(),'Per pa ge')

    function slugify(s) {
      return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toLowerCase()).replace(/\s+/g, '-');
    }

    extendStringPrototype('slugify', slugify);
    extendStringPrototype('dasherize', slugify); // expectString(slugify('per_page'),'per-page')
    // expectString(slugify('per-page'),'per-page')
    // expectString(slugify('per page'),'per-page')
    // expectString(slugify('per  paGe'),'per-pa-ge')
    // expectString('per  paGe'.slugify(),'per-pa-ge')

    function camelize(s) {
      return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
    }

    extendStringPrototype('camelize', camelize); // expectString(camelize('per_page'),'perPage')
    // expectString(camelize('per-page'),'perPage')
    // expectString(camelize('per page'),'perPage')
    // expectString(camelize('per paGe'),'perPaGe')
    // expectString('per  paGe'.camelize(),'perPaGe')

    function underscoped(s) {
      return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toLowerCase()).replace(/\s+/g, '_');
    }

    extendStringPrototype('underscoped', underscoped); // expectString(underscoped('per_page'),'per_page')
    // expectString(underscoped('per-page'),'per_page')
    // expectString(underscoped('per page'),'per_page')
    // expectString(underscoped('per paGe'),'per_pa_ge')
    // expectString('per  paGe'.underscoped(),'per_pa_ge')//per_pa_ge

    function classify(s) {
      return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => word.toUpperCase()).replace(/\s+/g, '');
    }

    extendStringPrototype('classify', classify); // test = log
    // test = expectString
    // test(classify('per_page'),'PerPage')
    // test(classify('per-page'),'PerPage')
    // test(classify('per page'),'PerPage')
    // test(classify('per paGe'),'PerPaGe')
    // test('per  paGe'.classify(),'PerPaGe')//per_pa_ge

    function swapCase(s) {
      return s.replace(/(?:^\w|[A-Z-a-z]|\b\w)/g, (word, index) => {
        if (/[A-Z]/.test(word)) {
          return word.toLowerCase();
        } else {
          return word.toUpperCase();
        }
      });
    }

    extendStringPrototype('swapCase', swapCase); // expectString(swapCase('per_page'),'PER_PAGE')
    // expectString(swapCase('per-page'),'PER-PAGE')
    // expectString(swapCase('per page'),'PER PAGE')
    // expectString(swapCase('per paGe'),'PER PAgE')
    // expectString('per  paGe'.swapCase(),'PER  PAgE')//per_pa_ge

    /**
     * the first char to upper case (only the first word)
     * @param {*} s
     * @returns
     */

    function capitialize(s) {
      return s.replace(/(?:^\w|[A-Z-a-z]|\b\w)/g, (word, index) => index === 0 ? word.toUpperCase() : word);
    }

    extendStringPrototype('capitialize', capitialize); // test = log
    // test = expectString
    // test(capitialize('per_page'),'Per_page')
    // test(capitialize('per-page'),'Per-page')
    // test(capitialize('per page'),'Per page')
    // test(capitialize('per paGe'),'Per paGe')
    // test('per  paGe'.capitialize(),'Per  paGe')//per_pa_ge

    /**
     * make the firt char to upper (only the first word) , other lower
     * @param {*} s
     * @returns
     */

    function sentence(s) {
      return s.replace(/(?:^\w|[A-Z-a-z]|\b\w)/g, (word, index) => index === 0 ? word.toUpperCase() : word.toLowerCase());
    }

    extendStringPrototype('sentence', sentence); // test = log
    // test = expectString
    // test(sentence('per_page'),'Per_page')
    // test(sentence('per-page'),'Per-page')
    // test(sentence('per page'),'Per page')
    // test(sentence('per paGe'),'Per page')
    // test('per  paGe'.sentence(),'Per  page')//per_pa_ge

    /**
     * make the firt char to upper(for each word), other lower
     * @param {string|ctx} s
     * @returns
     */

    function titleize(s) {
      return s.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    extendStringPrototype('titleize', titleize); // test(titleize('per_page'),'Per_page')
    // test(titleize('per-page'),'Per-Page')
    // test(titleize('per page'),'Per Page')
    // test(titleize('per paGe'),'Per Page')
    // test('per  paGe'.titleize(),'Per Page)//Per  Page

    function padStartString(number, len = 0, prefix = ' ') {
      if (number.length >= len) {
        return String(number);
      }

      return padStartString(prefix + number, len, prefix);
    }

    extendStringPrototype('padStartString', padStartString);
    extendStringPrototype('padStart', padStartString);

    function padEndString(number, len = 0, prefix = ' ') {
      if (number.length >= len) {
        return String(number);
      }

      return padEndString(number + prefix, len, prefix);
    } //https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
    //https://www.zhangxinxu.com/wordpress/2018/07/js-padstart-padend/
    // function padEndString (s,targetLength, padString) {
    //     console.log(s,targetLength, padString)
    //     targetLength = targetLength >> 0;
    //     padString = String((typeof padString !== 'undefined' ? padString : ' '));
    //     if (s.length > targetLength || padString === '') {
    //         return String(s);
    //     }
    //     targetLength = targetLength - s.length;
    //     if (targetLength > padString.length) {
    //         padString += padString.repeat(targetLength / padString.length);
    //     }
    //     return String(s) + padString.slice(0, targetLength);
    // };
    // String.prototype.padEndString = function (...args){return padEndString(this,...args)}


    extendStringPrototype('padEndString', padEndString);
    extendStringPrototype('padEnd', padEndString); // test = log
     // node lib/extend-string.js

    exports.camelize = camelize;
    exports.capitialize = capitialize;
    exports.classify = classify;
    exports.dasherize = slugify;
    exports.extendStringPrototype = extendStringPrototype;
    exports.humanize = humanize;
    exports.padEnd = padEndString;
    exports.padEndString = padEndString;
    exports.padStart = padStartString;
    exports.padStartString = padStartString;
    exports.sentence = sentence;
    exports.slugify = slugify;
    exports.swapCase = swapCase;
    exports.titleize = titleize;
    exports.underscoped = underscoped;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
