/**
  * cliEngine v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
  * cliOption v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

/**
  * cliParam v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

/**
  * extendString v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

/**
 *
 * @param {*} s
 * @returns {string}
 * @sample
 * ```
 * humanize('per_page')// Per page
 * humanize('per-page')// Per page
 * ```
 * @description
 * ```
 * ## idea
 * - [x] replace multi - or _ to one space
 * - [x] add space to the char that is uppercase and is not the first index
 * - [x] the first char to upper ,other lowercase
 * ```
 */
function humanize$1(s) {
  return s.replace(/(?:^\w|[A-Z_-]|\b\w)/g, (word, index) => {
    let res = ''; // log(word, index); //desc: for debug
    // feat: replace multi - or _ to one space

    res = word.replace(/[-_]+/g, ' '); // feat: add space to the char that is uppercase and is not the first index

    res = index !== 0 ? res.replace(/[A-Z]/, ' $&') : res; // feat: the first char to upper ,other lowercase

    return index === 0 ? res.toUpperCase() : res.toLowerCase();
  }).replace(/\s+/g, ' ');
}

function camelize$1(s) {
  return humanize$1(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
}
/* eslint-disable no-unused-vars */
// const { log } = console;

/** @typedef {{linkKeyAndVal:string,span:string}} pathParamTransferOption */

/** @typedef {{noAutoCamelize?:boolean,slim?:boolean,mode?:string,modeStyle:string}} getBuiltinFlagsOption */

/* eslint-disable-line  max-len */

/** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} camelizeFlagsOption */

/** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} likeCamelizeFlagsOption */

/** @typedef {{name:string,type:string,value:string|boolean,desc:string}} cliParam */

/** @typedef {string} cliArgsStringExp */

/** @typedef {string} httpQueryStringExp */

/** @typedef {string} swithOptionStringExp */

/** @typedef {object|cliArgsStringExp|httpQueryStringExp|swithOptionStringExp} getValFromParamResult */

/* eslint-disable-line  max-len */

/**
 * get param-string from param-json
 * @param {{[string]:string}} json
 * @param {{modeStyle:string}} options
 * @returns {string}
 */


function paramJsonToString(json, options) {
  const option = {
    modeStyle: 'cli',
    ...options
  };
  let res = ''; // param json to cli string exp

  if (option.mode === 'string' && option.modeStyle === 'cli') {
    res = Object.keys(json).map(v => {
      if (v.length > 1) {
        return `--${v}=${json[v]}`;
      }

      return `-${v}=${json[v]}`;
    }).join(' ');
  } // param json to httpquery string exp


  if (option.mode === 'string' && option.modeStyle === 'httpquery') {
    res = Object.keys(json).map(v => `${v}=${json[v]}`).join('&');
  } // param json to swithoption string exp


  if (option.mode === 'string' && option.modeStyle === 'swithoption') {
    res = Object.keys(json).map(v => `${v}=${json[v]}`).join(';');
  }

  return res;
}
/**
 * get value from param-json
 * @param {cliParam[]} param
 * @param {getBuiltinFlagsOption} options
 * @returns {getValFromParamResult}
 */


function getValFromParam(param, options = {}) {
  let res = {};
  const list = Object.keys(param).map(k => param[k]);
  const option = {
    slim: true,
    modeStyle: 'cli',
    ...options
  };

  if (option.mode === 'string') {
    option.slim = true;
  }

  for (let index = 0; index < list.length; index += 1) {
    const v = list[index];
    const {
      name,
      type,
      value,
      desc
    } = v;
    const [s, l] = name.split(/,/).map(i => i.trim().replace(/^-*/gi, '')); // 'hasLong' is assigned a value but never used

    const thelong = s.length > 1 ? s : l; // desc: set value for the long name

    if (thelong) {
      // feat: auto camelize
      if (!option.noAutoCamelize) {
        // res[camelize(thelong.replace(/-+/gi, " "))] = value;
        res[thelong.camelize()] = value;
      } // feat: slim them

      /* eslint-disable no-continue */


      if (option.slim) continue; // Unexpected use of continue statement

      /* eslint-enable no-continue */

      res[thelong] = value;
    } // desc: set value for the short name


    res[s] = value;
  }

  if (option.mode === 'string') {
    res = paramJsonToString(res, option);
  }

  return res;
}
/**
 * camelize param-json - nano-parser-flags
 * @param {object} flags
 * @param {camelizeFlagsOption} options
 * @returns
 */


function camelizeFlags$1(flags = {}, options = {}) {
  // let res = {}
  const option = {
    slim: true,
    ...options
  };
  if (option.noAutoCamelize) return flags;
  Object.keys(flags).forEach(k => {
    const ck = camelize$1(k); // res[ck]=flags[k]

    if (ck !== k) {
      flags[ck] = flags[k]; // eslint-disable-line no-param-reassign
      // Assignment to property of function parameter

      if (option.slim) {
        delete flags[k]; // eslint-disable-line no-param-reassign
        // Assignment to property of function parameter
      }
    }
  });
  return flags;
}
/**
  * extendString v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */


function padEndString(number, len = 0, prefix = ' ') {
  if (number.length >= len) {
    return String(number);
  }

  return padEndString(number + prefix, len, prefix);
}
/* eslint-disable no-unused-vars,prefer-destructuring,prefer-const,class-methods-use-this */


const {
  log: log$1
} = console;
/**
 * get val by ns with default value
 * @param {{}} map
 * @param {string} ns
 * @param {*} def
 * @returns
 */

function getMapPathValue(map, ns, def = {}) {
  // fix no-param-reassign
  let res; //   map[ns] = map[ns] ? map[ns] : def

  res = map[ns] ? map[ns] : def;
  return res;
}
/**
 * get cli ctx by ns and cmd in store
 * @param {{}} optionMap
 * @param {string} ns
 * @param {string} cmd
 * @returns
 * @description
 * ```
 * ## task
 * - [x] get ctx when ns and cmd
 * - [x] get ctx when ns
 * - [x] get ctx when no ns and cmd
 * ```
 */


function getMap(optionMap, ns = '', cmd = '') {
  let map = optionMap;

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
}
/**
 * get option name - short or long - in option-name-desc text
 * @param {string} desc
 * @param {string} nameType
 * @returns {string}
 */


function getCliOptionName(desc = '', nameType = 'l') {
  // idea: get l or loc as name
  // get -l,--loc
  // get l or loc
  let keys = '';
  keys = desc.split(' ')[0].split(',').map(v => v.replace(/^-*/gi, '')); // Unnecessary escape character: \-

  switch (nameType.toLowerCase()) {
    case 's':
      keys = keys[0];
      break;

    case 'l':
    default:
      // feat: if not l , use s
      if (!keys[1]) {
        keys = keys[0];
      } else {
        keys = keys[1];
      }

      break;
  }

  return keys;
}
/**
 * format option usage - add some space as prefix of each line
 * @param {string|string[]} text
 * @param {string} prefix
 * @param {string} count
 * @returns {string}
 */


function formatOptionText(text, prefix = '', count = 2) {
  let res;
  res = Array.isArray(text) ? text : [text];
  return res.join('\n').replace(/^/gim, Array(count).fill(prefix).join(''));
}
/**
 * beauty option usage - add some space between name and description
 * @param {string|string[]} text
 * @returns {string[]}
 */


function beautyOptionText(text) {
  let list = Array.isArray(text) ? text : [text]; // get option name length

  const max = Math.max(...list.map(line => line.split(' ')[0].length));
  list = list.map(line => {
    const arr = line.split(' ');
    let name = arr[0];
    const desc = arr.slice(1);
    name = padEndString(name, max + 6, ' ');
    return `${name}${desc.join(' ')}`;
  }); // log(max)

  return list; // padding suffix space
}
/**
 * get text from cli usage - subns ,subcmd
 * @param {string} keyword
 * @param {string} usage
 * @returns {string}
 */


function getTxtFromUsage(keyword, usage = '') {
  const regexp = new RegExp(` *${keyword}:.*`, 'ig');
  const match = usage.match(regexp);

  if (match) {
    return match[0].replace(new RegExp(` *${keyword}:`, 'i'), '');
  }

  return '';
}
/**
 * update entry option
 * @param {{[string]:any}} entryOption
 * @param {string} ns
 * @param {string} version
 * @param {string} usage
 * @returns
 * @description
 * ```
 * ## task
 * - [x] set ns and it's version
 * - [x] set auto subcmd
 * - [x] set auto subns
 * ```
 */


function updateEntryOption(entryOption = {}, ns = 'npm-bin', version = '1.0.0', usage = '') {
  let option = {};
  option = { ...entryOption,
    ...{
      version,
      ns
    }
  }; // set auto sub ns or cmd with usage

  if (usage) {
    option = { ...{
        autoSubCmd: getTxtFromUsage('subcmd', usage),
        autoSubNs: getTxtFromUsage('subns', usage)
      }
    };
  }

  return option;
} // idea:easier,faster to write ycs-cli usage when you clify your lib to ycs-cli
// add or get option
// bind option to ns or cmd
// make usage text with option
//
// bo.addOpt().getOpt().bind(cmd)
// bo.addOpt().getOpt().bind(ns)
// bo.addOpt().getOpt().bind(subns,subcmd)
// bo is short for bind-option

/**
 * @description
 * ```
 * ## why use?
 * - [x] write cli option in node.js
 * - [x] when many options is the same in subcmd or other cmd
 * ```
 * @sample
 * ```
 * //bo is short for bind-option
 * const bo = new CliOptionHelp();
 * //define option
 * bo.addOpt(`-l,--loc the des file location`);
 * bo.addOpt(`-h,--help get help`);
 * bo.addOpt(`-v,--version get version`);
 *
 * // feat:bind option to another subns,subcmd
 * bo.getOpt("loc").bindOpt("eslint", "add");
 *
 * // logMap()
 * // log(getMap(bo.optionMap))
 * // feat:option to usage
 * log(bo.usage());
 * // log(bo.usage('eslint','add'))
 * ```
 */


class CliOptionHelp {
  constructor() {
    this.init();
  }

  init() {
    this.optionMap = {};
    this.opt = '';
    this.relationMap = {};
    this.cmd = new Set();
    this.ns = new Set();
    this.paramMap = {};
    return this;
  } // get(name,ns='',cmd=''){
  //   this.opt=getOpt(name,ns,cmd)
  //   return this
  // }

  /**
   * add option
   * @param {string} text
   * @param {string} ns
   * @param {string} cmd
   * @returns {this}
   * @description
   * ```
   * ## task
   * - [ ] add option to global scope ns when no ns and cmd
   * - [ ] add option to ns scope when ns and no cmd
   * - [ ] add option to cmd scope when ns and cmd
   * - [x] add option store and set relation
   * - [x] add ns and cmd to store
   * ```
   */


  addOpt(text = '', ns = '', cmd = '') {
    const {
      optionMap,
      relationMap
    } = this;
    const name = getCliOptionName(text); // log(`add option ${name}`)

    let map = optionMap;
    map[name] = text; // log(`add relation ${name}`)

    map = getMap(relationMap, ns, cmd);
    map[name] = true; // log(`label ns and cmd`)

    this.cmd.add(cmd);
    this.ns.add(ns);
    return this;
  }
  /**
   * set current option with option name  - bind to ctx.opt
   * @param {string} name
   * @param {string} ns
   * @param {string} cmd
   * @returns {this} return this to chain
   */


  getOpt(name, ns = '', cmd = '') {
    const {
      optionMap,
      relationMap
    } = this;
    const map = optionMap; // map = getMap(optionMap,ns,cmd);

    this.opt = map[name];
    return this;
  }
  /**
   * log current option
   * @returns {this} return this to chain
   */


  logOpt() {
    log$1(this.opt);
    return this;
  }
  /**
   * bind current option to ns and cmd - call ctx.addOpt
   * @param {string} ns
   * @param {string} cmd
   * @returns {this} return this to chain
   */


  bindOpt(ns = '', cmd = '') {
    // log(`bind option to ns or cmd`)
    this.addOpt(this.opt, ns, cmd);
    return this;
  } // {ns:string,cmd:string,beauty:boolean}

  /**
   * get option usage text for root ,ns or cmd
   * @param {string} ns
   * @param {string} cmd
   * @returns {string}
   * @description
   * ```
   * ## task
   * - [x] get gloal scope option text when no ns and no cmd
   * - [x] get ns scope option text when only ns
   * - [x] get cmd scope option text when ns and cmd
   * ```
   */


  usage(ns = '', cmd = '') {
    const {
      optionMap,
      relationMap
    } = this;
    let map; // log(`get relation`)

    map = getMap(relationMap, ns, cmd); // log(`get option name`)

    let optNameList;
    optNameList = Object.keys(map); // feat: filter cmd

    optNameList = optNameList.filter(name => !this.cmd.has(name)); // feat: filter ns

    optNameList = optNameList.filter(name => !this.ns.has(name)); // optNameList=optNameList.join(`\n`)
    // idea: option part

    let opts;
    map = optionMap;
    opts = Object.keys(map).filter(name => optNameList.includes(name)).map(name => map[name]); // log(`[info] info option usage`)

    opts = beautyOptionText(opts); // log(opts)

    opts = formatOptionText(opts, ' ', 2);
    opts = `option:\n${opts}`; // opts=getFormatOptStr(opts,' ',2)

    let subns = [...this.ns].filter(v => v.trim()).join('|');
    subns = subns ? `subns:${subns}` : ''; // log([...this.cmd].filter(v=>v.trim()))

    let subcmd = [...this.cmd].filter(v => v.trim()).join('|');
    subcmd = subcmd ? `subcmd:${subcmd}` : '';
    let usage = 'usage:{ns} [option]';

    if (subns) {
      usage = usage.replace(/\[option\]$/, '[subns] [option]');
    }

    if (subcmd) {
      usage = usage.replace(/\[option\]$/, '[subcmd] [option]');
    }

    if (subcmd) {
      opts = `${subcmd}\n${opts}`;
    }

    if (subns) {
      opts = `${subns}\n${opts}`;
    }

    opts = formatOptionText(opts, ' ', 2);

    if (usage) {
      opts = `${usage}\n${opts}`;
    } // opts=getFormatOptStr(opts,' ',2)
    // this.usagemsg =opts


    return opts;
  } // name,type,value,desc

  /**
   * add option by param (json-param) - call ctx.addOpt
   * @param {{name:string,type:string,value:*,desc:string}[]} list
   * @param {string} ns
   * @param {string} cmd
   * @description
   * ```
   * ## task
   * - [x] save param to param store
   * - [x] call ctx.addOpt
   * ```
   */


  param(list, ns = '', cmd = '') {
    const {
      paramMap
    } = this;
    list.forEach(v => {
      // store param item
      if (!paramMap[v.name]) paramMap[v.name] = v; // to option item

      const {
        name,
        type,
        value,
        desc
      } = v;
      this.addOpt(`${name} ${desc}`, ns, cmd); // to builtIn confg
    });
    return this;
  }
  /**
   * get built in config - by param - get val from param
   * @param {getBuiltinFlagsOption} options
   * @returns {{[string]:string|number|boolean}}
   */


  getBuiltinConfig(options = {}) {
    const {
      paramMap
    } = this;
    return getValFromParam(paramMap, options);
  }

  getCliFlags(flags, options = {}) {
    let cliFlags;
    const {
      entrys
    } = options;

    if (flags.flags || entrys && entrys.notOnlyFlags) {
      cliFlags = flags.flags;
    } else {
      cliFlags = flags;
    }

    return camelizeFlags$1(cliFlags, options);
  }

  getCurrentFlags(flags, options = {}) {
    const builtinFlags = this.getBuiltinFlags();
    let nowFlags;
    const cliFlags = this.getCliFlags(flags, options);
    nowFlags = { ...builtinFlags,
      ...cliFlags
    };
    nowFlags = camelizeFlags$1(nowFlags, options);
    return nowFlags;
  }
  /**
   * camelize param-json - nano-parser-flags
   * @param {object} flags
   * @param {camelizeFlagsOption} options
   * @returns
   */


  camelizeFlags(flags = {}, options = {}) {
    // return camelizeFlags(...args);
    return camelizeFlags$1(flags, options);
  }
  /**
   * update entry-option by ctx.usagemsg - call updateEntryOption
   * @param {{}} entryOption
   * @param {string} ns
   * @param {string} version
   * @returns {{}}
   * @description
   * ```
   * ## task
   * - [x] set entry 's ns
   * - [x] set entry 's version
   * - [x] set entry 's autoSubns and autoSubCmd
   * ```
   */


  updateEntryOption(entryOption, ns = 'npm-bin', version = '1.0.0') {
    const {
      usagemsg
    } = this;
    return updateEntryOption(entryOption, ns, version, usagemsg);
  }

}

new CliOptionHelp();

/**
  * cliParam v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

/**
  * extendString v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

/**
 *
 * @param {*} s
 * @returns {string}
 * @sample
 * ```
 * humanize('per_page')// Per page
 * humanize('per-page')// Per page
 * ```
 * @description
 * ```
 * ## idea
 * - [x] replace multi - or _ to one space
 * - [x] add space to the char that is uppercase and is not the first index
 * - [x] the first char to upper ,other lowercase
 * ```
 */
function humanize(s) {
  return s.replace(/(?:^\w|[A-Z_-]|\b\w)/g, (word, index) => {
    let res = ''; // log(word, index); //desc: for debug
    // feat: replace multi - or _ to one space

    res = word.replace(/[-_]+/g, ' '); // feat: add space to the char that is uppercase and is not the first index

    res = index !== 0 ? res.replace(/[A-Z]/, ' $&') : res; // feat: the first char to upper ,other lowercase

    return index === 0 ? res.toUpperCase() : res.toLowerCase();
  }).replace(/\s+/g, ' ');
}

function camelize(s) {
  return humanize(s).replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '');
}
/**
 * camelize param-json - nano-parser-flags
 * @param {object} flags
 * @param {camelizeFlagsOption} options
 * @returns
 */


function camelizeFlags(flags = {}, options = {}) {
  // let res = {}
  const option = {
    slim: true,
    ...options
  };
  if (option.noAutoCamelize) return flags;
  Object.keys(flags).forEach(k => {
    const ck = camelize(k); // res[ck]=flags[k]

    if (ck !== k) {
      flags[ck] = flags[k]; // eslint-disable-line no-param-reassign
      // Assignment to property of function parameter

      if (option.slim) {
        delete flags[k]; // eslint-disable-line no-param-reassign
        // Assignment to property of function parameter
      }
    }
  });
  return flags;
}

function getCliFlags(flags, options = {}) {
  let cliFlags;
  const {
    entrys
  } = options;

  if (flags.flags || entrys && entrys.notOnlyFlags) {
    cliFlags = flags.flags;
  } else {
    cliFlags = flags;
  }

  return camelizeFlags(cliFlags, options);
}

/**
  * nanoParse v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */

/* eslint-disable no-use-before-define,no-restricted-syntax */
// docs(core): add docs comment

/**
 * parse cli cmd string
 * @param {string} input
 * @returns {{args:string[],extras:string[],_:string[]}}
 * @sample
 * ```
 * nanoargs(`ns cmd -a -b -c -- -a -b -c`)
 * nanoargs(`ns subns cmd -a -b -c -- -a -b -c`)
 * nanoargs(`ns subns subcmd -a -b -c -- -a -b -c`)
 * ```
 */
function nanoargs(input) {
  let extras = [];
  let args = input;
  const _ = []; // feat(nano-parse): support extras when '--' bind to ouput.extras

  if (input.includes('--')) {
    extras = input.slice(input.indexOf('--') + 1);
    args = input.slice(0, input.indexOf('--'));
  }

  const newArgs = [];
  /* eslint-disable no-plusplus */

  for (let i = 0; i < args.length; i++) {
    const previous = args[i - 1];
    const curr = args[i];
    const next = args[i + 1]; // eg:ymc.rc.json

    const nextIsValue = next && !/^--.+/.test(next) && !/^-.+/.test(next);

    const pushWithNext = x => {
      newArgs.push([x, nextIsValue ? next : true]);
    }; // eg:--conf=ymc.rc.json -f=ymc.rc.json


    if (/^--.+=/.test(curr) || /^-.=/.test(curr)) {
      newArgs.push(curr.split('='));
    } else if (/^-[^-].*/.test(curr)) {
      let current = curr;

      if (current.includes('=')) {
        const index = current.indexOf('=');
        newArgs.push([current.slice(index - 1, index), current.slice(index + 1, index + 2)]);
        current = current.slice(0, index - 1) + current.slice(index + 2);
      } // Push all the flags but the last (ie x and y of -xyz) with true


      const xyz = current.slice(1).split('').slice(0, -1); // eslint-disable no-restricted-syntax

      for (const char of xyz) {
        newArgs.push([char, true]);
      } // If the next string is a value, push it with the last flag


      const final = current[current.length - 1];
      pushWithNext(final);
    } else if (/^--.+/.test(curr) || /^-.+/.test(curr)) {
      pushWithNext(curr);
    } else {
      let valueTaken = newArgs.find(arg => arg[0] === previous);

      if (!valueTaken && /^-./.test(previous)) {
        const previousChar = previous[previous.length - 1];
        valueTaken = newArgs.find(arg => arg[0] === previousChar);
      }

      if (!valueTaken) {
        _.push(curr);
      }
    }
  }

  const flags = {};

  for (const arg of newArgs) {
    let key = arg[0].replace(/^-{1,2}/g, '');
    let value = arg[1];

    if (key.startsWith('no-') && [undefined, true].includes(value)) {
      key = key.slice(3);
      value = false;
    }

    flags[key] = parseValue(value);
  }

  return {
    flags,
    _: _.map(value => parseValue(value)),
    extras: extras.map(value => parseValue(value))
  };
}
/**
 * cli value to node.js boolean , string or number
 * @param {string} thing
 * @returns {string|boolean|number}
 */


function parseValue(thing) {
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
}

/**
  * cliRunner v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

/* eslint-disable class-methods-use-this,prefer-const,consistent-return,max-len */
const {
  log
} = console;
/**
 * @typedef {object} ycsDefaultOption
 * @property {string?} version - cli version
 * @property {string?} ns - cli name (namespace)
 * @property {string?} helpmsg - help msg
 * @property {number?} argvIndexS - argv index start position
 * @property {boolean?} enbaleSubCmd - enable subcmd or not
 * @property {string?} subcmd - sub cmd list
 * @property {boolean?} allowAutoSubCmd - allow auto subcmd or not
 * @property {string?} autoSubCmd - auto sub cmd list
 * @property {boolean?} enbaleSubNs - enable subns or not
 * @property {string?} subns - sub ns list
 * @property {boolean?} allowAutoSubNs - allow auto subns or not
 * @property {string?} autoSubNs - auto sub ns list
 */

/**
 * @typedef {object} ycsOtherOption
 * @property {(args:string[])=>{}} nanoparse - cli args parser - parse proccess.argv
 * @property {(args:cliArgs| builtinFlags|nowFlags|nanoParserFlags)=>{}} entrys - cli main handle entry
 */

/**
 * @typedef {(args:cliArgs| builtinFlags|nowFlags|nanoParserFlags)=>{}} ycsEntry - cli main handle entry
 * @property {(args:cliArgs| builtinFlags|nowFlags|nanoParserFlags)=>{}} option - cli main handle option
 */
// @ymc/ycs-option-default
// @ymc/ycs-runner-option-default

/**
 * get default option for ycs
 * @returns {ycsDefaultOption}
 */

function getDefaultOption() {
  return {
    helpmsg: 'usage:ns option',
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
} // @ymc/ycs-runner


class YcsRunner {
  constructor() {
    this.option = getDefaultOption();
  }
  /**
   * set cli name (namespace)
   * @param {string} name
   * @returns {this} return this to chain
   */


  ns(name = 'ycs') {
    this.option.ns = name;
    return this;
  }
  /**
   * set cli version
   * @param {string} ver
   * @returns {this} return this to chain
   */


  version(ver = '1.0.0') {
    this.option.version = ver;
    return this;
  }
  /**
   * set cli entry function
   * @param {(args:cliArgs| builtinFlags|nowFlags|nanoParserFlags)=>{}} entrys
   * @param {string} otherKeys
   * @returns {this} return this to chain
   * @description
   * ```
   * ## task
   * - [x] bind entrys.option to ysc.option
   * - [x] bind other keys in entrys to ysc.option
   * - [x] bind entrys to ysc.option.entrys
   * ```
   */


  entry(entrys = {}, otherKeys = 'version,ns,autoSubCmd,autoSubNs') {
    const ycs = this; // let {option} = ycs
    // let {entrys} = option
    // idea: bind entrys.option to ysc.option

    if (entrys.option) {
      ycs.option = { ...ycs.option,
        ...entrys.option
      };
    } // idea: bind entrys.xx to ysc.option
    // xx is some of version,ns,autoSubCmd,autoSubNs


    otherKeys.split(',').forEach(item => {
      if (entrys[item]) {
        ycs.option[item] = entrys[item];
      }
    });
    ycs.option.entrys = entrys;
    return this;
  }
  /**
   * set cli auto subcmd
   * @param {string} s
   * @returns {this} return this to chain
   */


  autosubcmd(s = '') {
    this.option.autoSubCmd = s;
    return this;
  }
  /**
   * set cli auto subns
   * @param {string} s
   * @returns {this} return this to chain
   */


  autosubns(s = '') {
    this.option.autoSubNs = s;
    return this;
  }
  /**
   * set cli args parser
   * @param {*} f
   * @returns
   */


  nanoparse(f = () => {}) {
    this.option.nanoparse = f;
    return this;
  }

  checkSubnsEnable() {}

  checkSubCmdEnable() {}

  checkExpectArgvStart() {}
  /**
   * run cli entry with args - process.argv
   * @param {string[]} input
   * @returns
   */


  run(input) {
    // let input = process.argv
    // idea: extract share var
    let {
      entrys,
      helpmsg,
      argvIndexS,
      enbaleSubCmd,
      subcmd,
      allowAutoSubCmd,
      autoSubCmd,
      version,
      // ns ,
      ns,
      enbaleSubNs,
      subns,
      allowAutoSubNs,
      autoSubNs,
      nanoparse
    } = this.option; // idea: input format is 'ns [subcmd] [option]'
    // option is argv
    // feat: auto check sub ns enable

    if (!enbaleSubNs && allowAutoSubNs && autoSubNs) {
      autoSubNs = Array.isArray(autoSubNs) ? autoSubNs : autoSubNs.split('|');
      enbaleSubNs = autoSubNs.includes(input[argvIndexS]);
    } // feat: support sub ns


    if (enbaleSubNs) {
      subns = input[argvIndexS];
      argvIndexS += 1;
      helpmsg = helpmsg.replace(/option$/, 'subns option');
    } // feat: auto check sub cmd enable


    if (!enbaleSubCmd && allowAutoSubCmd && autoSubCmd) {
      autoSubCmd = Array.isArray(autoSubCmd) ? autoSubCmd : autoSubCmd.split('|');
      enbaleSubCmd = autoSubCmd.includes(input[argvIndexS]);
    } // feat: support sub cmd


    if (enbaleSubCmd) {
      // subcmd = input[2]
      subcmd = input[argvIndexS];
      argvIndexS += 1; // helpmsg=`usage:ns subcmd option`

      helpmsg = helpmsg.replace(/option$/, 'subcmd option');
    } // feat: get usage,entry,version
    // helpmsg is alias of usage
    // desc: three case all support
    // desc: case a - when subns and subcmd both enable and exsit
    // desc: case b - when only subcmd enable and exsit
    // desc: case c - when subns and subcmd noth not enable and exsit


    let entry = entrys;
    helpmsg = entrys.usage; // desc: get subns helpmsg,version and entry when subns enable and exsits

    if (enbaleSubNs && subns) {
      if (!entry[subns]) {
        log(`${helpmsg}`);
        log(`todo:subns:${subns}`); // process.exit(1)

        return;
      } // log(`run subns ${subns}`)


      helpmsg = entry[subns].usage ? entry[subns].usage : helpmsg;
      version = entry[subns].version ? entry[subns].version : version;
      entry = entry[subns] ? entry[subns] : () => {};
    } // desc: get subcmd helpmsg,version and entry when subcmd enable and exsits


    if (enbaleSubCmd && subcmd) {
      if (!entry[subcmd]) {
        log(`${helpmsg}`);
        log(`todo:subcmd:${subcmd}`); // process.exit(1)

        return;
      } // log(`run subcmd ${subcmd}`)


      helpmsg = entry[subcmd].usage ? entry[subcmd].usage : helpmsg;
      version = entry[subcmd].version ? entry[subcmd].version : version;
      entry = entry[subcmd] ? entry[subcmd] : () => {};
    } // helpmsg=defUsage()
    // feat: check argv length


    let invalidArgvLength = input.length <= argvIndexS;

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
      log(`${helpmsg}`);
      log('error:invalid argv length');
      return;
    } // feat: parse nano argv
    // let [,,...sinput ] = input
    // let sinput = input.slice(2)


    const sinput = input.slice(argvIndexS); // flags vs _ vs extras
    // let parser = nanoparse ? nanoparse : argsParser;

    const parser = nanoparse || (flags => flags);

    const argv = parser(sinput); // log(sinput)
    // log(argv)

    const option = argv.flags; // feat: support log flags,_,and extras

    if (option.debugArgs || option.da) {
      // log(argv.flags)
      // log(argv._)
      // log(argv.extras)
      log(argv);
    } // feat: support out version


    if (option.version || option.v) {
      log(`${ns} version:${version}`);
      return;
    } // feat: support out help


    if (option.help || option.h) {
      log(`${helpmsg}`);
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

}

new YcsRunner();

/**
  * cliEntry v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

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

/* eslint-disable no-unused-vars, class-methods-use-this , import/prefer-default-export */

class YcsNext {
  constructor() {
    this.init();
  }

  init() {
    this.too = new CliOptionHelp();
    this.data = {};
    this.ycs = new YcsRunner();
    this.ycs.nanoparse(nanoargs);
    return this;
  }

  param(list) {
    const {
      too
    } = this;
    too.param(list);
    return this;
  }

  usage(...args) {
    const {
      too,
      data
    } = this;
    data.usage = too.usage(...args);
    return this;
  }

  option(entryOption, ns, version) {
    const {
      too,
      data
    } = this;
    data.option = too.updateEntryOption(entryOption, ns, version);
    return this;
  }
  /**
   * define entry
   * @param {()=>{}} handle
   * @param {*} settings
   * @returns
   */


  entry(handle, settings = {}) {
    const {
      data,
      ycs
    } = this;
    data.entry = defEntry(handle, { ...{
        usage: data.usage,
        option: data.option,
        ...settings
      }
    }); // log(data.entry,data.usage)
    // ycs.entry(data.entry);

    return this;
  }

  run() {
    const {
      data,
      ycs
    } = this; // runEntry(data.entry);
    // ycs.nanoparse(argsParser).entry(data.entry)

    ycs.entry(data.entry);
    ycs.run(process.argv);
  }

  new() {
    return new YcsNext();
  }
  /**
   * camelize param-json - nano-parser-flags
   * @param {object} flags
   * @param {{}} options
   * @returns
   */


  camelizeFlags(flags = {}, options = {}) {
    // let { too } = this;
    // return too.getBuiltinConfig(flags,options);
    // return camelizeFlags(...args);
    return camelizeFlags(flags, options);
  }

  getBuiltinFlags(...args) {
    const {
      too
    } = this;
    return too.getBuiltinConfig(...args);
  }

  getCurrentFlags(...args) {
    const builtinFlags = this.getBuiltinFlags();
    let nowFlags;
    const cliFlags = this.getCliFlags(args[0], args[1]);
    nowFlags = { ...builtinFlags,
      ...cliFlags
    };
    nowFlags = this.camelizeFlags(nowFlags, args[1]);
    return nowFlags;
  }

  getCliFlags(flags, options = {}) {
    const {
      data
    } = this;
    const entrys = data.entry;
    return getCliFlags(flags, { ...options,
      entrys
    });
  }

}

const ycs = new YcsNext();

exports.ycs = ycs;
