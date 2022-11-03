/**
  * getLocInDifferentOs v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["get-loc-in-different-os"] = factory());
})(this, (function () { 'use strict';

  /**
    * getOsName v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */

  /**
    * getOsName v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */

  /**
   * one-line text to object set
   * @param {string} s one-line text or other
   * @param {string} si the char to split text to array
   * @param {string} skv the split char that link key and val
   * @param {string} svs the split char that link val and val
   * @returns {{[string]:string[]}}
   * @sample
   * ```
   * toObjectSet("mac=darwin;win=win32,win64;linux=linux;android=android")//{"win":["win32","win64"]}
   * ```
   */
  function toObjectSet(s, si = ';', skv = '=', svs = ',') {
    const res = {};
    const list = s.trim().split(si).map(v => v.trim()).filter(v => v);
    list.forEach(item => {
      let [key, vals] = item.split(skv);
      vals = vals.trim().split(svs);
      res[key] = vals;
    });
    return res;
  }
  /**
   * get val or kw in map when match val
   * @param {{[string]:string[]}} map
   * @param {string} val
   * @param {boolean} useKeyWord use keyword or val
   * @returns {string|undefined}
   */


  function getKWByVal(map, val, useKeyWord = true) {
    let res;
    const keys = Object.keys(map);

    for (let index = 0; index < keys.length; index++) {
      const kw = keys[index];
      const kwVal = map[kw];

      if (kwVal.includes(val)) {
        res = val;

        if (useKeyWord) {
          res = kw;
        } // log(key, val);


        break;
      }
    }

    return res;
  }
  /**
   * get os name through process.platform
   * @param {string} customNames
   * @returns {string}
   * @sample
   * ```
   * getOsName()
   * getOsName("mac=darwin;win=win32;linux=linux;android=android")//win, mac ,linux or android
   * ```
   * @description
   * ```
   * ## why use?
   * - [x] get os name
   * - [x] custom os names map for returns
   * ```
   */


  function getOsName(customNames) {
    const nameMap = customNames ? customNames : 'mac=darwin;win=win32;linux=linux;android=android';
    const osMap = toObjectSet(nameMap);
    return getKWByVal(osMap, osName, true);
  }

  /**
   *
   * @param {{win?:string,linux?:string,mac?:string,name?:string}} option
   * @returns {string}
   * @description
   * ```
   * - [x] custom os name map in option.name
   * - [x] custom loc in diferent os with option[osname]
   * ```
   * @sample
   * ```
   * getLocInDifferentOs({win,mac,linux,android})
   * ```
   */

  function getLocInDifferentOs(option = {}) {
    const defaulOsName = 'mac=darwin;win=win32;linux=linux;android=android';
    return option[getOsName(option.name ? option.name : defaulOsName)];
  }

  return getLocInDifferentOs;

}));
