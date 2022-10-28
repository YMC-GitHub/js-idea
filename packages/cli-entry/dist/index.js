/**
  * cliEntry v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["cli-entry"] = {}));
})(this, (function (exports) { 'use strict';

  /* eslint-disable default-case,no-unused-vars */
  /**
   * define ycs entry(s) - with handle function and option
   * @param {(()=>{})} handle
   * @param {*} options
   * @returns
   * @description
   * ```
   * ## task
   *  - [x] bind options.usage to entrys.usage
   *  - [x] bind options.option to entrys.option
   *  - [x] bind options.xx to entrys.xx
   * ```
   */

  function defEntry(handle = () => {}, options = {}) {
    const opts = {
      enableZeroOption: true,
      notOnlyFlags: true,
      ...options
    };
    /* eslint-disable no-param-reassign */
    // fix no-param-reassign

    handle.usage = opts.usage;
    handle.option = opts.option; // entrys.autoSubCmd= usage.match(/subcmd:.*/ig)[0]
    // feat: enable zero option
    // entrys.log.enableZeroOption=true
    // entrys.cls.enableZeroOption=true

    handle.enableZeroOption = opts.enableZeroOption;
    handle.notOnlyFlags = opts.notOnlyFlags;
    return handle;
    /* eslint-enable no-param-reassign */
  } // /**
  //  * run entry with ycs instance
  //  * @param {*} entrys
  //  */
  // function runEntry(entrys) {
  //     const ycs = new Ycs();
  //     ycs.nanoparse(argsParser).entry(entrys).run(process.argv);
  //     // return ycs
  // }

  /**
   * run entry with ycs instance
   * @param {*} entrys
   */


  function runEntry(engine, entrys) {
    engine.entry(entrys).run(process.argv);
  }

  class BindEntry {
    //   constructor() {} //fix no-empty-function,no-useless-constructor
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
        } // feat: support bind entry


        entrys[cmd] = entry;
      });
    }

  }
  /**
   * bind subns or subcmd to entry
   * @param {{entrys:()=>{},subcmd:string,defFun:() => {},bindType:string}} option
   */


  function bindCmdToEntry(option) {
    const {
      subcmd,
      defFun,
      bindType
    } = option;
    const be = new BindEntry();
    be.entrys(option.entrys);
    be.bind(subcmd, defFun, bindType);
  }

  exports.bindCmdToEntry = bindCmdToEntry;
  exports.defEntry = defEntry;
  exports.runEntry = runEntry;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
