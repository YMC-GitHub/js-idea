/**
  * bumpVersion v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["bump-version"] = {}));
})(this, (function (exports) { 'use strict';

  const versions = ['major', 'minor', 'patch']; // M.m.p

  /**
   * get version type
   * @param {string} type
   * @returns {string}
   * @description
   * ```
   * Looks at first argument to determine type of upgrade: patch, minor, major
   * defaults to patch if undefined
   * ```
   */

  const getVersionType = (type = 'patch') => {
    const store = {
      M: 'major',
      m: 'minor',
      p: 'patch',
      major: 'major',
      minor: 'minor',
      patch: 'patch'
    };
    return store[type];
  };
  /**
   * increment version
   * @param {string} version
   * @param {string} type
   * @returns {string}
   */


  const incrementVersion = (version, type) => {
    const index = versions.indexOf(type);
    const versionArr = version.split('.');
    const currentValue = Number(versionArr[index]);
    const updatedValue = currentValue + 1;
    const updatedVersionArr = [].concat(versionArr);

    switch (type) {
      case 'major':
        return `${updatedValue}.0.0`;

      case 'minor':
        updatedVersionArr[1] = updatedValue;
        updatedVersionArr[2] = 0;
        return updatedVersionArr.join('.');

      case 'patch':
        updatedVersionArr[2] = updatedValue;
        return updatedVersionArr.join('.');

      default:
        throw new Error(`Provide one of: ${versions.join(', ')}`);
    }
  };
  /**
   * bum version
   * @param {string} currentVersion
   * @param {string} type
   * @returns {string}
   */


  const bumpVersion = (currentVersion, type) => {
    const versionType = getVersionType(type);
    const updatedVersion = incrementVersion(currentVersion, versionType);
    return updatedVersion;
  };

  exports.bumpVersion = bumpVersion;
  exports.getVersionType = getVersionType;
  exports.incrementVersion = incrementVersion;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
