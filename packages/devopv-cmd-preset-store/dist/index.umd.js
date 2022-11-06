/**
  * devopvCmdPresetStore v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["devopv-cmd-preset-store"] = factory());
})(this, (function () { 'use strict';

  /** @typedef {{[string]:{name:string,version:string,tpl:string}}} data */
  class DevOpvCmdPresetStore {
    constructor() {
      this.ini();
    }

    ini() {
      /** @type data */
      this.data = {};
      return this;
    }

    add(name, tpl, version = '1.0.0') {
      const {
        data
      } = this;
      data[name] = {
        name,
        version,
        tpl
      };
      return this;
    }

    get(name) {
      const {
        data
      } = this;
      return data[name];
    }

  }

  return DevOpvCmdPresetStore;

}));
