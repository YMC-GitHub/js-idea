#!/usr/bin/env node
/**
  * jcm v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
#!/usr/bin/env node
/**
  * jcm v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
#!/usr/bin/env node
/**
  * jcm v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
})((function () { 'use strict';

  /**
   * @description
   * ```
   * ## why ?
   * - [x] easier,faster to write ycs-cli entrys when you clify your lib to ycs-cli
   *
   * ## how ?
   * ge.entrys(entrys).bind(cmd,defFun,'call')
   * ge.entrys(entrys).bind(ns,defFun,'call')
   * ge.entrys(entrys.ns).bind(subcmd,defFun,'call')
   * ge is short for generate-entrys
   * - [x] input entry
   * - [x] define a handle fun
   * - [x] bind a handle fun to ns,cmd
   * ```
   */
  class GE {
    constructor() {}
    /**
     * set or get entry
     * @param {{}} entry
     * @returns {this|entry}
     */


    entrys(entry) {
      // set
      if (entry) {
        this.context = entry;
        return this;
      } // get


      return this.context;
    }
    /**
     * bind ns or subcmd with handle fun
     * @param {string} subcmd
     * @param {function} defFun
     * @param {string} bindType call handle fun
     */


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

  // idea: usage to option
  // uo is short for usage-to-option
  // get subns
  // get subcmd

  /**
   * get subns or subcmd from usage text
   * @param {string} s subns or subcmd label
   * @param {string} usage usage text
   * @returns {string}
   * @sample
   * ```
   * getTxtFromUsage("subcmd", usage)
   * getTxtFromUsage("subns", usage)
   * ```
   */
  const getTxtFromUsage = (s, usage = '') => {
    const regexp = new RegExp(` *${s}:.*`, 'ig');
    const match = usage.match(regexp);

    if (match) {
      return match[0].replace(new RegExp(` *${s}:`, 'i'), '');
    }

    return '';
  };
  /**
   *
   * @param {string} ns
   * @param {string} version
   * @param {string} usage
   * @returns {{version:string,ns:string,autoSubCmd:string,autoSubNs:string}}
   * @description
   * ```
   * - [x] define ns
   * - [x] define version
   * - [x] gen auto subcmd with usage text
   * - [x] gen auto subns with usage text
   * ```
   */


  const genOptionFromUsage = (ns = 'npm-bin', version = '1.0.0', usage = '') => {
    let option = {};
    option = { ...option,
      ...{
        version,
        ns,
        autoSubCmd: getTxtFromUsage('subcmd', usage),
        autoSubNs: getTxtFromUsage('subns', usage)
      }
    };
    return option;
  };

  const {
    log: log$1
  } = console; // idea: define usage likes below

  const defUsage = (ns = 'ns') => {
    const msg = `cnf gen for ymc repo
  mgnt .ymcrc.json file
  usage:ns [subcmd] [option]
    ${ns} -h
    ${ns} -v

  subcmd:add|del|get|put|cls|log
    add - add des file
    del - del des file
    get - get des file
  option:
    -n,--name cnf file name
    -w,--wkd use working dir
    -u,--usd use user dir
    -c,--crd use current dir
    -h,--help get help
    -v,--version get version
`;
    return msg;
  }; // feat: use built in flags

  const entrys = (flags = {}) => {
    // log nano parser result 's flags (flags vs _ vs extras)
    // log(flags)
    log$1(`hello ns`);
  }; // 1. gen cmd fun


  const defFun = (cmd = 'add') => (flags = {}) => {
    // flags = { ...builtinFlags, ...flags }
    // comEntry(cmd, flags)
    log$1(`hello ${cmd}`);
  }; // 2. bind cmd fun


  const ge = new GE(); // ge.entrys(entrys).bind('add|get|del|put|cls|log',defFun,'call')
  // ge.entrys(entrys).bind('add|del|put',defFun,'call')

  ge.entrys(entrys).bind('eslint|jest|babel|tsc', defFun, 'call'); // log(entrys)
  // entrys.add = (flags = {}) => {
  //   flags = { ...builtinFlags, ...flags }
  //   comEntry('add', flags)
  // }
  // entrys.del = (flags = {}) => {
  //   flags = { ...builtinFlags, ...flags }
  //   comEntry('del', flags)
  // }
  // entrys.get = (flags = {}) => {
  //   flags = { ...builtinFlags, ...flags }
  //   let data = comEntry('get', flags)
  //   let key, value
  //   key = flags.k || flags.key
  //   value = data.bin[key]
  //   log(`${key} ${value}`)
  // }
  // entrys.put = (flags = {}) => {
  //   flags = { ...builtinFlags, ...flags }
  //   comEntry('put', flags)
  // }
  // entrys.cls = (flags = {}) => {
  //   flags = { ...builtinFlags, ...flags }
  //   comEntry('cls', flags)
  // }
  // entrys.log = (flags = {}) => {
  //   flags = { ...builtinFlags, ...flags }
  //   comEntry('log', flags)
  // }

  const ns = 'jcm';
  const usage = defUsage(ns);
  const option = genOptionFromUsage(ns, '1.0.0', usage);
  entrys.usage = usage;
  entrys.option = option; // feat: enable zero option
  // entrys.log.enableZeroOption=true
  // entrys.cls.enableZeroOption=true

  entrys.enableZeroOption = true;
  entrys.notOnlyFlags = true;
  // 1. check this file js syantx
  // node script/jcm-clify.js
  // 2.
  // jcm user.name --des=packages/noop -c -u -w --name=.ymcrc.json
  // jcm user.name ymc --des=packages/noop -c -u -w --name=.ymcrc.json
  // node script/jcm-cli.js user.name --des=packages/noop -c -u -w --name=.ymcrc.json --debugArgs
  // node script/jcm-cli.js user.name ymc --des=packages/noop -c -u -w --name=.ymcrc.json --debugArgs

  function nanoargs(input) {
    let extras = [];
    let args = input;
    const _ = [];

    if (input.includes('--')) {
      extras = input.slice(input.indexOf('--') + 1);
      args = input.slice(0, input.indexOf('--'));
    }

    const newArgs = [];

    for (let i = 0; i < args.length; i++) {
      const previous = args[i - 1];
      const curr = args[i];
      const next = args[i + 1];
      const nextIsValue = next && !/^--.+/.test(next) && !/^-.+/.test(next);

      const pushWithNext = x => {
        newArgs.push([x, nextIsValue ? next : true]);
      };

      if (/^--.+=/.test(curr) || /^-.=/.test(curr)) {
        newArgs.push(curr.split('='));
      } else if (/^-[^-].*/.test(curr)) {
        let current = curr;

        if (current.includes('=')) {
          const index = current.indexOf('=');
          newArgs.push([current.slice(index - 1, index), current.slice(index + 1, index + 2)]);
          current = current.slice(0, index - 1) + current.slice(index + 2);
        } // Push all the flags but the last (ie x and y of -xyz) with true


        for (const char of current.slice(1).split('').slice(0, -1)) {
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

  const parseValue = thing => {
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

  const defOption = () => ({
    helpmsg: `usage:ns option`,
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
  });
  const installEntrys = (entrys = {}) => ycs => {
    // let input =process.argv
    // ycs.entry(entrys).run(input)
    // ycs.version('2.0.0').autosubns('npm|yarn|pnpm').autosubcmd('add|del|get|put').entry(entrys)
    // idea: bind entrys.option to ysc.option

    if (entrys.option) {
      ycs.option = { ...ycs.option,
        ...entrys.option
      };
    } // idea: bind entrys.xx to ysc.option
    // xx is some of version,ns,autoSubCmd,autoSubNs


    'version,ns,autoSubCmd,autoSubNs'.split(',').forEach(item => {
      if (entrys[item]) {
        ycs.option[item] = entrys[item];
      }
    });
    ycs.entry(entrys); // ysc.run(input)

    return ycs;
  };

  // idea: extract function to class
  // it.ns().version().entry().autosubcmd().autosubns().run()

  const {
    log
  } = console;

  class Ycs {
    constructor() {
      this.option = defOption();
    }

    ns(s = 'ns') {
      this.option.ns = s;
      return this;
    }

    version(s = '1.0.0') {
      this.option.version = s;
      return this;
    }

    entry(o = {}) {
      this.option.entrys = o;
      return this;
    }

    autosubcmd(s = '') {
      this.option.autoSubCmd = s;
      return this;
    }

    autosubns(s = '') {
      this.option.autoSubNs = s;
      return this;
    }

    nanoparse(f = () => {}) {
      this.option.nanoparse = f;
      return this;
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
      } = this.option; // idea: input format is 'ns [subcmd] [option]'
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


      let entry = entrys;
      helpmsg = entrys.usage;

      if (enbaleSubNs && subns) {
        if (!entry[subns]) {
          log(`${helpmsg}`);
          log(`todo:subns:${subns}`); // process.exit(1)

          return;
        } // log(`run subns ${subns}`)


        helpmsg = entry[subns].usage ? entry[subns].usage : helpmsg;
        version = entry[subns].version ? entry[subns].version : version;
        entry = entry[subns] ? entry[subns] : () => {};
      }

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
        log(`error:invalid argv length`);
        return;
      } // feat: parse nano argv
      // let [,,...sinput ] = input
      // let sinput = input.slice(2)


      const sinput = input.slice(argvIndexS); // flags vs _ vs extras

      const argv = nanoargs(sinput); // log(sinput)
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
  // 1. check syt
  // node script/ycs-api.js

  //#!/usr/bin/env node
  // idea: use with cli
  // ycs.version('1.0.0').entry(entrys).run()

  const ycs = new Ycs();
  installEntrys(entrys)(ycs);
  ycs.run(process.argv); //function main(ycs)(){}
  // usage:
  // 1. add execable
  // chmod +x script/jcm-cli.js
  // 2. scr it
  // node script/jcm-cli.js add -k jcm --value bin/index.js
  // 3. cli fy
  // script/npm-bin.js add -k jcm -value bin/index.js
  // script/jcm-cli.js -v
  // 4. fly it
  // npm-bin add -k jcm -v bin/index.js
  // npm link
  // jcm -v

}));
