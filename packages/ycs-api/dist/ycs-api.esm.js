/* eslint-disable */
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
  const _ = [];

  // feat(nano-parse): support extras when '--' bind to ouput.extras
  if (input.includes('--')) {
    extras = input.slice(input.indexOf('--') + 1);
    args = input.slice(0, input.indexOf('--'));
  }

  const newArgs = [];

  for (let i = 0; i < args.length; i++) {
    const previous = args[i - 1];
    const curr = args[i];
    const next = args[i + 1];

    // eg:ymc.rc.json
    const nextIsValue = next && !/^--.+/.test(next) && !/^-.+/.test(next);

    const pushWithNext = x => {
      newArgs.push([x, nextIsValue ? next : true]);
    };

    // eg:--conf=ymc.rc.json -f=ymc.rc.json
    if (/^--.+=/.test(curr) || /^-.=/.test(curr)) {
      newArgs.push(curr.split('='));
    } else if (/^-[^-].*/.test(curr)) {
      let current = curr;

      if (current.includes('=')) {
        const index = current.indexOf('=');
        newArgs.push([current.slice(index - 1, index), current.slice(index + 1, index + 2)]);
        current = current.slice(0, index - 1) + current.slice(index + 2);
      }

      // Push all the flags but the last (ie x and y of -xyz) with true
      for (const char of current.slice(1).split('').slice(0, -1)) {
        newArgs.push([char, true]);
      }

      // If the next string is a value, push it with the last flag
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

  return { flags, _: _.map(value => parseValue(value)), extras: extras.map(value => parseValue(value)) }
}

/**
 * cli value to node.js boolean , string or number
 * @param {string} thing
 * @returns {string|boolean|number}
 */
const parseValue = thing => {
  if (['true', true].includes(thing)) {
    return true
  }

  if (['false', false].includes(thing)) {
    return false
  }

  if (Number(thing)) {
    return Number(thing)
  }

  return thing
};

/* eslint-disable no-new,no-param-reassign */

// docs(core): add docs comment
const defOption = () => ({
  helpmsg: 'usage:ns option',
  argvIndexS: 2, // argv index start position
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
});

/* eslint-disable prefer-const */
// feat: support subcmd alias (todo)

// idea: extract function to class
// it.ns().version().entry().autosubcmd().autosubns().run()

const { log } = console;

class Ycs {
  constructor() {
    this.option = defOption();
  }

  ns(s = 'ns') {
    this.option.ns = s;
    return this
  }

  version(s = '1.0.0') {
    this.option.version = s;
    return this
  }

  entry(o = {}) {
    this.option.entrys = o;
    return this
  }

  autosubcmd(s = '') {
    this.option.autoSubCmd = s;
    return this
  }

  autosubns(s = '') {
    this.option.autoSubNs = s;
    return this
  }

  nanoparse(f = () => {}) {
    this.option.nanoparse = f;
    return this
  }

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
      autoSubNs
    } = this.option;

    // idea: input format is 'ns [subcmd] [option]'
    // option is argv

    // feat: auto check sub ns enable
    if (!enbaleSubNs && allowAutoSubNs && autoSubNs) {
      autoSubNs = Array.isArray(autoSubNs) ? autoSubNs : autoSubNs.split('|');
      enbaleSubNs = autoSubNs.includes(input[argvIndexS]);
    }

    // feat: support sub ns
    if (enbaleSubNs) {
      subns = input[argvIndexS];
      argvIndexS += 1; // fix Unary operator '++' used
      helpmsg = helpmsg.replace(/option$/, 'subns option');
    }

    // feat: auto check sub cmd enable
    if (!enbaleSubCmd && allowAutoSubCmd && autoSubCmd) {
      autoSubCmd = Array.isArray(autoSubCmd) ? autoSubCmd : autoSubCmd.split('|');
      enbaleSubCmd = autoSubCmd.includes(input[argvIndexS]);
    }

    // feat: support sub cmd
    if (enbaleSubCmd) {
      // subcmd = input[2]
      subcmd = input[argvIndexS];
      argvIndexS += 1; // fix Unary operator '++' used
      // helpmsg=`usage:ns subcmd option`
      helpmsg = helpmsg.replace(/option$/, 'subcmd option');
    }

    // feat: get usage,entry,version
    // helpmsg is alias of usage
    let entry = entrys;
    helpmsg = entrys.usage;

    if (enbaleSubNs && subns) {
      if (!entry[subns]) {
        log(`${helpmsg}`);
        log(`todo:subns:${subns}`);
        // process.exit(1)
        return
      }
      // log(`run subns ${subns}`)
      helpmsg = entry[subns].usage ? entry[subns].usage : helpmsg;
      version = entry[subns].version ? entry[subns].version : version;
      entry = entry[subns] ? entry[subns] : () => {};
    }

    if (enbaleSubCmd && subcmd) {
      if (!entry[subcmd]) {
        log(`${helpmsg}`);
        log(`todo:subcmd:${subcmd}`);
        // process.exit(1)
        return
      }
      // log(`run subcmd ${subcmd}`)
      helpmsg = entry[subcmd].usage ? entry[subcmd].usage : helpmsg;
      version = entry[subcmd].version ? entry[subcmd].version : version;
      entry = entry[subcmd] ? entry[subcmd] : () => {};
    }
    // helpmsg=defUsage()

    // feat: check argv length
    let invalidArgvLength = input.length <= argvIndexS;

    if (entrys.enableZeroOption) {
      invalidArgvLength = input.length < argvIndexS;
    }
    if (entry.enableZeroOption) {
      invalidArgvLength = input.length < argvIndexS;
    }
    // if (enbaleSubNs && subns) {
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
      return
    }

    // feat: parse nano argv
    // let [,,...sinput ] = input
    // let sinput = input.slice(2)
    const sinput = input.slice(argvIndexS);

    // flags vs _ vs extras
    const argv = nanoargs(sinput);
    // log(sinput)
    // log(argv)
    const option = argv.flags;

    // feat: support log flags,_,and extras
    if (option.debugArgs || option.da) {
      // log(argv.flags)
      // log(argv._)
      // log(argv.extras)
      log(argv);
    }

    // feat: support out version
    if (option.version || option.v) {
      log(`${ns} version:${version}`);
      return
    }

    // feat: support out help
    if (option.help || option.h) {
      log(`${helpmsg}`);
      return
    }

    // feat: support run main
    // let entry = entrys
    // if(enbaleSubCmd && subcmd){
    //   log(`run subcmd ${subcmd}`)
    //   entry=entrys[subcmd]?entrys[subcmd]:()=>{}
    // }
    // flags,_,extras
    // option is alias of flags
    if (entrys.notOnlyFlags || entry.notOnlyFlags) {
      return entry(argv) /* eslint-disable-line consistent-return */
    }
    return entry(option) /* eslint-disable-line consistent-return */
  }
}

// usage:
// 1. check syt
// node script/ycs-api.js

export { Ycs as default };
