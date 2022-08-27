/**
  * ycsHelpGenerateEntry v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ycsHelpGenerateEntry = {}));
})(this, (function (exports) { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  // idea:easier,faster to write ycs-cli entrys when you clify your lib to ycs-cli
  // input entry
  // define a handle fun
  // bind a handle fun to ns,cmd
  // ge.entrys(entrys).bind(cmd,defFun,'call')
  // ge.entrys(entrys).bind(ns,defFun,'call')
  // ge.entrys(entrys.ns).bind(subcmd,defFun,'call')
  // ge is short for generate-entrys
  var GE = /*#__PURE__*/function () {
    function GE() {
      _classCallCheck(this, GE);
    }

    _createClass(GE, [{
      key: "entrys",
      value: function entrys(entry) {
        // set
        if (entry) {
          this.context = entry;
          return this;
        } // get


        return this.context;
      }
    }, {
      key: "bind",
      value: function bind() {
        var subcmd = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var defFun = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
        var bindType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var entrys = this.entrys();

        subcmd.split('|').forEach(function (cmd) {
          var entry;

          switch (bindType.toLowerCase()) {
            case 'call':
              // feat: support call then bind entry
              entry = defFun(cmd);
              break;
          } // feat: support bind entry


          entrys[cmd] = entry;
        });
      }
    }]);

    return GE;
  }();

  exports.GenerateEntrys = GE;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
