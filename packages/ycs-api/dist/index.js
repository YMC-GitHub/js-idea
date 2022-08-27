/**
  * ycsApi v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ycsApi = {}));
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

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function nanoargs(input) {
    var extras = [];
    var args = input;
    var _ = [];

    if (input.includes('--')) {
      extras = input.slice(input.indexOf('--') + 1);
      args = input.slice(0, input.indexOf('--'));
    }

    var newArgs = [];

    var _loop = function _loop(i) {
      var previous = args[i - 1];
      var curr = args[i];
      var next = args[i + 1];
      var nextIsValue = next && !/^--.+/.test(next) && !/^-.+/.test(next);

      var pushWithNext = function pushWithNext(x) {
        newArgs.push([x, nextIsValue ? next : true]);
      };

      if (/^--.+=/.test(curr) || /^-.=/.test(curr)) {
        newArgs.push(curr.split('='));
      } else if (/^-[^-].*/.test(curr)) {
        var current = curr;

        if (current.includes('=')) {
          var index = current.indexOf('=');
          newArgs.push([current.slice(index - 1, index), current.slice(index + 1, index + 2)]);
          current = current.slice(0, index - 1) + current.slice(index + 2);
        } // Push all the flags but the last (ie x and y of -xyz) with true


        var _iterator = _createForOfIteratorHelper(current.slice(1).split('').slice(0, -1)),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _char = _step.value;
            newArgs.push([_char, true]);
          } // If the next string is a value, push it with the last flag

        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var _final = current[current.length - 1];
        pushWithNext(_final);
      } else if (/^--.+/.test(curr) || /^-.+/.test(curr)) {
        pushWithNext(curr);
      } else {
        var valueTaken = newArgs.find(function (arg) {
          return arg[0] === previous;
        });

        if (!valueTaken && /^-./.test(previous)) {
          var previousChar = previous[previous.length - 1];
          valueTaken = newArgs.find(function (arg) {
            return arg[0] === previousChar;
          });
        }

        if (!valueTaken) {
          _.push(curr);
        }
      }
    };

    for (var i = 0; i < args.length; i++) {
      _loop(i);
    }

    var flags = {};

    for (var _i = 0, _newArgs = newArgs; _i < _newArgs.length; _i++) {
      var arg = _newArgs[_i];
      var key = arg[0].replace(/^-{1,2}/g, '');
      var value = arg[1];

      if (key.startsWith('no-') && [undefined, true].includes(value)) {
        key = key.slice(3);
        value = false;
      }

      flags[key] = parseValue(value);
    }

    return {
      flags: flags,
      _: _.map(function (value) {
        return parseValue(value);
      }),
      extras: extras.map(function (value) {
        return parseValue(value);
      })
    };
  }

  var parseValue = function parseValue(thing) {
    if (['true', true].includes(thing)) {
      return true;
    }

    if (['false', false].includes(thing)) {
      return false;
    }

    if (Number(thing)) {
      return Number(thing);
    }

    return thing;
  };

  var defOption = function defOption() {
    return {
      helpmsg: "usage:ns option",
      argvIndexS: 2,
      // argv index start position
      enbaleSubCmd: false,
      subcmd: '',
      allowAutoSubCmd: true,
      autoSubCmd: '',
      version: '1.0.0',
      // ns : getRelScriptFileName(),
      ns: 'ycs',
      enbaleSubNs: false,
      subns: '',
      allowAutoSubNs: true,
      autoSubNs: ''
    };
  };

  // idea: extract function to class
  // it.ns().version().entry().autosubcmd().autosubns().run()

  var _console = console,
      log = _console.log;

  var Ycs = /*#__PURE__*/function () {
    function Ycs() {
      _classCallCheck(this, Ycs);

      this.option = defOption();
    }

    _createClass(Ycs, [{
      key: "ns",
      value: function ns() {
        var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ns';
        this.option.ns = s;
        return this;
      }
    }, {
      key: "version",
      value: function version() {
        var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '1.0.0';
        this.option.version = s;
        return this;
      }
    }, {
      key: "entry",
      value: function entry() {
        var o = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        this.option.entrys = o;
        return this;
      }
    }, {
      key: "autosubcmd",
      value: function autosubcmd() {
        var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        this.option.autoSubCmd = s;
        return this;
      }
    }, {
      key: "autosubns",
      value: function autosubns() {
        var s = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        this.option.autoSubNs = s;
        return this;
      }
    }, {
      key: "nanoparse",
      value: function nanoparse() {
        var f = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
        this.option.nanoparse = f;
        return this;
      }
    }, {
      key: "run",
      value: function run(input) {
        // let input = process.argv
        // idea: extract share var
        var _this$option = this.option,
            entrys = _this$option.entrys,
            helpmsg = _this$option.helpmsg,
            argvIndexS = _this$option.argvIndexS,
            enbaleSubCmd = _this$option.enbaleSubCmd,
            subcmd = _this$option.subcmd,
            allowAutoSubCmd = _this$option.allowAutoSubCmd,
            autoSubCmd = _this$option.autoSubCmd,
            version = _this$option.version,
            ns = _this$option.ns,
            enbaleSubNs = _this$option.enbaleSubNs,
            subns = _this$option.subns,
            allowAutoSubNs = _this$option.allowAutoSubNs,
            autoSubNs = _this$option.autoSubNs; // idea: input format is 'ns [subcmd] [option]'
        // option is argv
        // feat: auto check sub ns enable

        if (!enbaleSubNs && allowAutoSubNs && autoSubNs) {
          autoSubNs = Array.isArray(autoSubNs) ? autoSubNs : autoSubNs.split('|');
          enbaleSubNs = autoSubNs.includes(input[argvIndexS]);
        } // feat: support sub ns


        if (enbaleSubNs) {
          subns = input[argvIndexS];
          argvIndexS++;
          helpmsg = helpmsg.replace(/option$/, 'subns option');
        } // feat: auto check sub cmd enable


        if (!enbaleSubCmd && allowAutoSubCmd && autoSubCmd) {
          autoSubCmd = Array.isArray(autoSubCmd) ? autoSubCmd : autoSubCmd.split('|');
          enbaleSubCmd = autoSubCmd.includes(input[argvIndexS]);
        } // feat: support sub cmd


        if (enbaleSubCmd) {
          // subcmd = input[2]
          subcmd = input[argvIndexS];
          argvIndexS++; // helpmsg=`usage:ns subcmd option`

          helpmsg = helpmsg.replace(/option$/, 'subcmd option');
        } // feat: get usage,entry,version
        // helpmsg is alias of usage


        var entry = entrys;
        helpmsg = entrys.usage;

        if (enbaleSubNs && subns) {
          if (!entry[subns]) {
            log("".concat(helpmsg));
            log("todo:subns:".concat(subns)); // process.exit(1)

            return;
          } // log(`run subns ${subns}`)


          helpmsg = entry[subns].usage ? entry[subns].usage : helpmsg;
          version = entry[subns].version ? entry[subns].version : version;
          entry = entry[subns] ? entry[subns] : function () {};
        }

        if (enbaleSubCmd && subcmd) {
          if (!entry[subcmd]) {
            log("".concat(helpmsg));
            log("todo:subcmd:".concat(subcmd)); // process.exit(1)

            return;
          } // log(`run subcmd ${subcmd}`)


          helpmsg = entry[subcmd].usage ? entry[subcmd].usage : helpmsg;
          version = entry[subcmd].version ? entry[subcmd].version : version;
          entry = entry[subcmd] ? entry[subcmd] : function () {};
        } // helpmsg=defUsage()
        // feat: check argv length


        var invalidArgvLength = input.length <= argvIndexS;

        if (entrys.enableZeroOption) {
          invalidArgvLength = input.length < argvIndexS;
        }

        if (entry.enableZeroOption) {
          invalidArgvLength = input.length < argvIndexS;
        } // if (enbaleSubNs && subns) {
        //   if (entry[subns] && entry[subns].enableZeroOption) {
        //     invalidArgvLength = input.length < argvIndexS
        //   }
        // }
        // if (enbaleSubCmd && subcmd) {
        //   if (entry[subcmd] && entry[subcmd].enableZeroOption) {
        //     invalidArgvLength = input.length < argvIndexS
        //   }
        // }


        if (invalidArgvLength) {
          log("".concat(helpmsg));
          log("error:invalid argv length");
          return;
        } // feat: parse nano argv
        // let [,,...sinput ] = input
        // let sinput = input.slice(2)


        var sinput = input.slice(argvIndexS); // flags vs _ vs extras

        var argv = nanoargs(sinput); // log(sinput)
        // log(argv)

        var option = argv.flags; // feat: support log flags,_,and extras

        if (option.debugArgs || option.da) {
          // log(argv.flags)
          // log(argv._)
          // log(argv.extras)
          log(argv);
        } // feat: support out version


        if (option.version || option.v) {
          log("".concat(ns, " version:").concat(version));
          return;
        } // feat: support out help


        if (option.help || option.h) {
          log("".concat(helpmsg));
          return;
        } // feat: support run main
        // let entry = entrys
        // if(enbaleSubCmd && subcmd){
        //   log(`run subcmd ${subcmd}`)
        //   entry=entrys[subcmd]?entrys[subcmd]:()=>{}
        // }
        // flags,_,extras
        // option is alias of flags


        if (entrys.notOnlyFlags || entry.notOnlyFlags) {
          return entry(argv);
        }

        return entry(option);
      }
    }]);

    return Ycs;
  }();
  // 1. check syt
  // node script/ycs-api.js

  exports.Ycs = Ycs;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
