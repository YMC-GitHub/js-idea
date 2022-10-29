/**
  * ycsHelpGenerateEntry v0.0.2
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["ycs-help-generate-entry"] = {}));
})(this, (function (exports) { 'use strict';

  /* eslint-disable import/prefer-default-export */
  // idea:easier,faster to write ycs-cli entrys when you clify your lib to ycs-cli
  // input entry
  // define a handle fun
  // bind a handle fun to ns,cmd
  // ge.entrys(entrys).bind(cmd,defFun,'call')
  // ge.entrys(entrys).bind(ns,defFun,'call')
  // ge.entrys(entrys.ns).bind(subcmd,defFun,'call')
  // ge is short for generate-entrys
  class GE {
    //   constructor() {} //fix Useless constructor
    entrys(entry) {
      // set
      if (entry) {
        this.context = entry;
        return this;
      } // get


      return this.context;
    }

    bind(subcmd = '', defFun = () => {}, bindType = '') {
      const entrys = this.entrys();

      subcmd.split('|').forEach(cmd => {
        let entry;

        switch (bindType.toLowerCase()) {
          case 'call':
            // feat: support call then bind entry
            entry = defFun(cmd);
            break;
          // fix Expected a default case
        } // feat: support bind entry


        entrys[cmd] = entry;
      });
    }

  }

  exports.GenerateEntrys = GE;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
