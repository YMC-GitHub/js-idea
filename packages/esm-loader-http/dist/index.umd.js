/**
  * esmLoaderHttp v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:https')) :
    typeof define === 'function' && define.amd ? define(['exports', 'node:https'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["esm-loader-http"] = {}, global.node_https));
})(this, (function (exports, node_https) { 'use strict';

    /* eslint-disable no-shadow,no-return-assign */
    function resolve(specifier, context, nextResolve) {
      const {
        parentURL = null
      } = context; // Normally Node.js would error on specifiers starting with 'https://', so
      // this hook intercepts them and converts them into absolute URLs to be
      // passed along to the later hooks below.

      if (specifier.startsWith('https://')) {
        return {
          shortCircuit: true,
          url: specifier
        };
      }

      if (parentURL && parentURL.startsWith('https://')) {
        return {
          shortCircuit: true,
          url: new URL(specifier, parentURL).href
        };
      } // Let Node.js handle all other specifiers.


      return nextResolve(specifier, context);
    }
    function load(url, context, nextLoad) {
      // For JavaScript to be loaded over the network, we need to fetch and
      // return it.
      if (url.startsWith('https://')) {
        return new Promise((resolve, reject) => {
          node_https.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({
              // This example assumes all network-provided JavaScript is ES module
              // code.
              format: 'module',
              shortCircuit: true,
              source: data
            }));
          }).on('error', err => reject(err));
        });
      } // Let Node.js handle all other URLs.


      return nextLoad(url, context);
    }

    exports.load = load;
    exports.resolve = resolve;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
