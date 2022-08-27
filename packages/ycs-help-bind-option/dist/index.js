/**
  * ycsHelpBindOption v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ycsHelpBindOption = {}));
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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var _console = console,
      log = _console.log;
  var getOptName = function getOptName() {
    var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'l';
    // idea: get l or loc as name
    // get -l,--loc
    // get l or loc
    var keys = '';
    keys = s.split(" ")[0].split(',').map(function (v) {
      return v.replace(/^\-*/ig, '');
    });

    switch (t.toLowerCase()) {
      case 's':
        keys = keys[0];
        break;

      case 'l':
        // feat: if not l , use s
        if (!keys[1]) {
          keys = keys[0];
        } else {
          keys = keys[1];
        }

        break;
    }

    return keys;
  };
  var getMapPathValue = function getMapPathValue(map, ns) {
    var def = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    map[ns] = map[ns] ? map[ns] : def;
    return map[ns];
  };
  var getMap = function getMap(optionMap) {
    var ns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var cmd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var map = optionMap;

    if (ns && cmd) {
      map = getMapPathValue(map, ns);
      map = getMapPathValue(map, cmd); // optionMap[ns]=optionMap[ns]?optionMap[ns]:{}
      // optionMap=[ns]
      // optionMap[cmd]=optionMap[cmd]?optionMap[cmd]:{}
      // optionMap=[cmd]
    } else if (ns) {
      map = getMapPathValue(map, ns);
    } else if (cmd) {
      map = getMapPathValue(map, cmd);
    }

    return map;
  };
  var getFormatOptStr = function getFormatOptStr(opts) {
    var s = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var num = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
    opts = Array.isArray(opts) ? opts : [opts];
    return opts.join("\n").replace(/^/igm, Array(num).fill(s).join(''));
  };

  // add or get option
  // bind option to ns or cmd
  // make usage text with option
  //
  // bo.addOpt().getOpt().bind(cmd)
  // bo.addOpt().getOpt().bind(ns)
  // bo.addOpt().getOpt().bind(subns,subcmd)
  // bo is short for bind-option

  var BO = /*#__PURE__*/function () {
    function BO() {
      _classCallCheck(this, BO);

      this.optionMap = {};
      this.opt = '';
      this.relationMap = {};
      this.cmd = new Set();
      this.ns = new Set();
    } // get(name,ns='',cmd=''){
    //   this.opt=getOpt(name,ns,cmd)
    //   return this
    // }


    _createClass(BO, [{
      key: "addOpt",
      value: function addOpt() {
        var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var ns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var cmd = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
        var optionMap = this.optionMap,
            relationMap = this.relationMap;
        var name = getOptName(s); // log(`add option ${name}`)

        var map = optionMap;
        map[name] = s; // log(`add relation ${name}`)

        map = getMap(relationMap, ns, cmd);
        map[name] = true; // log(`label ns and cmd`)

        this.cmd.add(cmd);
        this.ns.add(ns);
        return this;
      }
    }, {
      key: "getOpt",
      value: function getOpt(name) {
        var optionMap = this.optionMap;
            this.relationMap;
        var map = optionMap;
        this.opt = map[name]; // map = getMap(optionMap,ns,cmd)

        return this;
      }
    }, {
      key: "logOpt",
      value: function logOpt() {
        log(this.opt);
        return this;
      }
    }, {
      key: "bindOpt",
      value: function bindOpt() {
        var ns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var cmd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        // log(`bind option to ns or cmd`)
        this.addOpt(this.opt, ns, cmd);
        return this;
      }
    }, {
      key: "usage",
      value: function usage() {
        var _this = this;

        var ns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var cmd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        var optionMap = this.optionMap,
            relationMap = this.relationMap;
        var map; // log(`get relation`)

        map = getMap(relationMap, ns, cmd); // log(`get option name`)

        var optNameList;
        optNameList = Object.keys(map); // feat: filter cmd

        optNameList = optNameList.filter(function (name) {
          return !_this.cmd.has(name);
        }); // feat: filter ns

        optNameList = optNameList.filter(function (name) {
          return !_this.ns.has(name);
        }); // optNameList=optNameList.join(`\n`)
        // idea: option part

        var opts;
        map = optionMap;
        opts = Object.keys(map).filter(function (name) {
          return optNameList.includes(name);
        }).map(function (name) {
          return map[name];
        });
        opts = getFormatOptStr(opts, ' ', 2);
        opts = "option:\n".concat(opts); // opts=getFormatOptStr(opts,' ',2)

        var subns = _toConsumableArray(this.ns).filter(function (v) {
          return v.trim();
        }).join('|');

        subns = subns ? "subns:".concat(subns) : ''; // log([...this.cmd].filter(v=>v.trim()))

        var subcmd = _toConsumableArray(this.cmd).filter(function (v) {
          return v.trim();
        }).join('|');

        subcmd = subcmd ? "subcmd:".concat(subcmd) : '';
        var usage = "usage:ns [option]";

        if (subns) {
          usage = usage.replace(/\[option\]$/, '[subns] [option]');
        }

        if (subcmd) {
          usage = usage.replace(/\[option\]$/, '[subcmd] [option]');
        }

        if (subcmd) {
          opts = "".concat(subcmd, "\n").concat(opts);
        }

        if (subns) {
          opts = "".concat(subns, "\n").concat(opts);
        }

        opts = getFormatOptStr(opts, ' ', 2);

        if (usage) {
          opts = "".concat(usage, "\n").concat(opts);
        } // opts=getFormatOptStr(opts,' ',2)


        return opts;
      }
    }]);

    return BO;
  }();
   // option.ns,option.cmd

  exports.BindOption = BO;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
