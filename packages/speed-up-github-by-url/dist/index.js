/**
  * speedUpGithubByUrl v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["speed-up-github-by-url"] = {}));
})(this, (function (exports) { 'use strict';

  /* eslint-disable no-use-before-define */
  // fix infoProxyDomainMap' was used before it was defined
  const {
    log
  } = console;
  /** @typedef {[string,string][]} proxyDomainMap */
  // pkg:
  // @ymc/speed-up-github-by-url

  /**
   * speedup github - add prefix url to matched url
   * @param {string} url
   * @param {{map?:proxyDomainMap,infoProxy:boolean}} option
   * @returns {string}
   */

  function speedUpGithubByUrl(url, option = {}) {
    let {
      map
    } = option;

    if (!map) {
      map = [['https://github.com', 'https://hub.fastgit.xyz'], ['https://raw.githubusercontent.com', 'https://raw.fastgit.org']];
    }

    if (option.infoProxy) {
      log('[info] add prefix to matched url');
      infoProxyDomainMap(map);
    } // add prefix url when matched url


    let res = url;

    if (res) {
      map.forEach(item => {
        const [doamin, proxyByDomain] = item;
        res = res.replace(new RegExp(`^${doamin}`, 'ig'), proxyByDomain);
      });
    }

    return res;
  }
  /**
   *
   * @param {proxyDomainMap} map
   */


  function infoProxyDomainMap(map) {
    const res = map.map(v => {
      const [domain, proxyByDomain] = v;
      return `proxy:${proxyByDomain} domain:${domain}`;
    }).join('\n');
    log(res);
  }

  exports.infoProxy = infoProxyDomainMap;
  exports.speedup = speedUpGithubByUrl;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
