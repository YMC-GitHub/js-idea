/**
  * cliRunner v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

const ycsRunner = new YcsRunner();

exports.YcsRunner = YcsRunner;
exports.getDefaultOption = getDefaultOption;
exports.ycsRunner = ycsRunner;
