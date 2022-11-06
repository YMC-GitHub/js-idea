/**
  * getNodeBuiltinModules v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

var node_module = require('node:module');

// eslint-diable node/no-deprecated-api

/**
 *
 * @returns {string[]}
 */

function getNodeBuitInModule() {
  // https://github.com/sindresorhus/builtin-modules
  const ignoreList = ['sys'];
  return (node_module.builtinModules || (process.binding ? Object.keys(process.binding('natives')) : []) || []).filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x) && !ignoreList.includes(x)).sort();
}

module.exports = getNodeBuitInModule;
