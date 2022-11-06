/**
  * getFileList v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node:fs')) :
  typeof define === 'function' && define.amd ? define(['node:fs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["get-file-list"] = factory(global.node_fs));
})(this, (function (node_fs) { 'use strict';

  /**
    * extendString v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
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
      // feat: replace multi - or _ to one space

      res = word.replace(/[-_]+/g, ' '); // feat: add space to the char that is uppercase and is not the first index

      res = index !== 0 ? res.replace(/[A-Z]/, ' $&') : res; // feat: the first char to upper ,other lowercase

      return index === 0 ? res.toUpperCase() : res.toLowerCase();
    }).replace(/\s+/g, ' ');
  }

  function camelize(s) {
    return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
  }

  /**
    * getCustomProp v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /**
   * get prefixed prop
   * @param {string} prop
   * @param {{prefix:string,camelize:boolean}} option
   * @returns
   */

  function getPrefixedProp$1(prop, option) {
    let prefixedProp = prop;

    if (option.prefix) {
      prefixedProp = `${option.prefix}${prop}`;
    }

    if (option.camelize) {
      prefixedProp = `${option.prefix}-${prop}`;
      prefixedProp = camelize(prefixedProp);
    }

    return prefixedProp;
  }
  /**
   * get custom prop from context
   * @param {{}} context
   * @param {string} prop
   * @param {()=>{}} def
   * @param {{prefix:string,camelize:boolean}} options
   * @returns {*}
   * @desciption
   * ```
   * ## task
   * - [x] auto bind custiom prefix to property
   * - [x] auto camelize property
   * ```
   */


  function getCustomProp(context, prop, def, options = {}) {
    const option = {
      prefix: 'custom',
      camelize: true,
      ...options
    };
    const prefixedProp = getPrefixedProp$1(prop, option); // idea:get-custom-if-presence -> get-native-if-presence -> get-default-if-presence

    const native = context[prop] ? context[prop] : def;
    return context[prefixedProp] ? context[prefixedProp] : native;
  }

  /**
   * get prefixed prop
   * @param {string} prop
   * @param {{prefix:string,camelize:boolean}} option
   * @returns
   */

  function getPrefixedProp(prop, option) {
    let prefixedProp = prop;

    if (option.prefix) {
      prefixedProp = `${option.prefix}${prop}`;
    }

    if (option.camelize) {
      prefixedProp = `${option.prefix}-${prop}`;
      prefixedProp = camelize(prefixedProp);
    }

    return prefixedProp;
  }
  /**
   * set custom prop to context
   * @param {{}} context
   * @param {string} prop
   * @param {()=>{}} def
   * @param {{prefix:string,camelize:boolean,override:boolean}} options
   * @returns {*}
   * @desciption
   * ```
   * ## task
   * - [x] auto bind custiom prefix to property
   * - [x] auto camelize property
   * - [x] over ride native is allow
   * ```
   */


  function setCustomProp(context, prop, def, options = {}) {
    const option = {
      prefix: 'custom',
      camelize: true,
      override: false,
      ...options
    }; // over ride native

    if (option.override) {
      context[prop] = def;
      return;
    }

    const prefixedProp = getPrefixedProp(prop, option);
    context[prefixedProp] = def;
  }

  const handles = {};

  setCustomProp(handles, 'readdirSync', node_fs.readdirSync, {
    override: true
  });
  setCustomProp(handles, 'statSync', node_fs.statSync, {
    override: true
  });

  // import { readdirSync, statSync } from 'fs'

  /**
   * get file list in dir - only-name ? recursive?
   * @param {string} dir
   * @param {{onlyName?:boolean,recursive?:boolean}} options
   * @returns {string[]}
   */


  function getFilelist(dir, options = {}) {
    // todo: custom readdirSync,statSync or mock it
    const option = {
      onlyName: false,
      recursive: true,
      ...handles,
      ...options
    }; // const customReadDirSync = getCustomProp(option, 'readdirSync', readdirSync)
    // const customstatSync = getCustomProp(option, 'statSync', statSync)
    // const customReadDirSync = getCustomProp(option, 'readdirSync', defaultHandles['readdirSync'])
    // const customstatSync = getCustomProp(option, 'statSync', defaultHandles['statSync'])

    const customReadDirSync = getCustomProp(option, 'readdirSync');
    const customstatSync = getCustomProp(option, 'statSync'); // getCustomProp(option, 'noop', noop)

    let list = customReadDirSync(dir); // log(list)

    list = list.map(v => {
      const loc = `${dir}/${v}`;
      const stat = customstatSync(loc);

      if (stat.isFile()) {
        if (option.onlyName) {
          return v;
        }

        return loc;
      }

      if (stat.isDirectory() && option.recursive) {
        return getFilelist(loc, options);
      }

      return '';
    });
    list = list.flat(1);
    return list;
  }

  return getFilelist;

}));
