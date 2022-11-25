/**
  * jcm v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('node:fs'), require('node:path')) :
    typeof define === 'function' && define.amd ? define(['node:fs', 'node:path'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.node_fs, global.node_path));
})(this, (function (node_fs, node_path) { 'use strict';

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
      // constructor() {}

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
    }; // export {getTxtFromUsage,genOptionFromUsage}

    // import { readJson, saveJson, getUserHome } from './jcm-too.js'

    /* eslint-disable consistent-return */

    /* eslint-disable no-unused-vars,prefer-destructuring */

    /* eslint-disable default-param-last */

    /* eslint-disable max-classes-per-file */

    /* eslint-disable prefer-const */
    const {
      log: log$3
    } = console;
    /**
     * @description
     * ```
     * idea: use json conf
     * uc is short for using conf
     * ```
     */

    class Ujc {
      constructor() {
        this.list = [];
        this.index = -1;
        this.freeze = false;
      }
      /**
       * add config to config list by order
       * @param {{}} config
       * @param {numbber} order
       * @returns {this} why ? to chain
       */


      use(config = {}, order) {
        let {
          list,
          index
        } = this; // feat: support index and order

        const useIndex = !order; // feat: auto increase index

        if (useIndex || index === order) {
          index += 1;
        } else if (index < order) {
          index = order;
        } // warn: update index in this (when number,string,boolean)


        this.index = index;
        index = useIndex ? index : order;

        if (config) {
          list[index] = config;
        }

        return this;
      }
      /**
       *
       * @returns {{}}
       * @description
       * ```
       * - [x] get config by index in config list
       * - [x] simple merge config
       * - [x] freeze result optionally
       * ```
       */


      load() {
        const {
          list
        } = this;
        let res = {};

        for (let index = 0; index < list.length; index += 1) {
          const config = list[index];

          if (config) {
            // res=Object.assign(res,config)
            res = { ...res,
              ...config
            };
          }
        }

        const {
          freeze
        } = this;

        if (freeze) {
          return Object.freeze(res);
        }

        return res; // return Object.freeze(Object.assign({}, config, dotenv, node_env, argv))
      }

    }
    /**
     * @description
     * ```
     * idea: get or set conf
     * gsc is short for get-set-conf
     * gsc.bind(data).split('.').conf(key,val)
     * ```
     */


    class Gsc {
      constructor() {
        this.data = {};
        this.option = {
          splitChar: '.'
        };
      }
      /**
       * bind data to ctx.data
       * @param {*} data
       * @returns {this} why ? to chain
       *
       */


      bind(data) {
        if (data) {
          this.data = data;
        }

        return this;
      }
      /**
       * set split char
       * @param {string} s
       * @returns {this} why ? to chain
       */


      split(s = '.') {
        if (s) {
          this.option.splitChar = s;
        }

        return this;
      }
      /**
       * get or set value with key
       * @param {string} key
       * @param {*} val
       * @returns {val|this}
       * @description
       * ```
       * ```
       */


      conf(key, val) {
        if (!key) return this; // note: extract com var

        let {
          data,
          option
        } = this;
        let last; // note: get name list

        const nss = key.split(option.splitChar); // note: get last name

        last = nss[nss.length - 1]; // note: get prev data

        const {
          length
        } = nss;

        for (let index = 0; index < length - 1; index += 1) {
          const name = nss[index]; // note: ini data in key when not dedfining

          if (!data[name]) {
            data[name] = {};
          }

          data = data[name]; // data=data[name]?data[name]:{}
        } // log(key,data)
        // feat: get val


        if (val === undefined) {
          return data[last];
        } // feat: set val


        data[last] = val;
        log$3(`set ${last} ${val}`); // feat: support chain when setting

        return this;
      }

    }
    /**
     * read conf in file list
     * @param {string[]} cnfLocList
     * @param {function(loc,def):json} readJson
     * @returns {json}
     * @description
     * ```
     * idea: read conf
     * a sam for rc
     * rc is short for reading conf
     * ``
     */


    function readConf(cnfLocList = ['.ymcrc.json'], readJson) {
      // let name='.ymcrc.json'
      // let userLoc=joinPath(getUserHome(),name)
      const rc = new Ujc(); // rc.use(readJson(userLoc))
      // rc.use(readJson(name))
      // rc.use(readJson(joinPath(wkd,name)))
      // data = rc.load()
      // let cnfLocList = [joinPath(getUserHome(),name),name,joinPath(wkd,name)]

      for (let index = 0; index < cnfLocList.length; index += 1) {
        const cnfLoc = cnfLocList[index];
        rc.use(readJson(cnfLoc));
      }

      return rc.load();
    }

    new Ujc();
    new Gsc();

    /* eslint-disable consistent-return */
    const {
      log: log$2
    } = console; // idea:
    // get des dir
    // log msg
    // load pkg json
    // update pkg json

    class Jcm {
      constructor() {
        this.option = {};
        this.tool = {};
      }
      /**
       *
       * @param {string} name
       * @returns {string}
       */


      getFileLoc(name) {
        const {
          option,
          tool
        } = this;
        const filename = name || option.name;
        const flags = option;

        if (flags.usd || flags.u) {
          // log(tool.getUserHome(), filename, option)
          return tool.joinPath(tool.getUserHome(), filename);
        }

        if (flags.crd || flags.c) {
          return filename;
        }

        if (flags.wkd
        /* || flags.w */
        ) {
          log$2(filename, option);
          return tool.joinPath(flags.wkd, filename);
        }

        return filename;
      }
      /**
       *
       * @param {string} name
       * @returns {string[]}
       * @description
       * ```
       * user-path-> project-path -> des-path
       * ```
       */


      getFileLocList(name) {
        let loclist = [];
        const {
          option
        } = this;
        const list = [['usd', 'u'], ['crd', 'c'], ['wkd']];
        loclist = list.map(keys => {
          let ukey;
          let uVal;
          let flag;

          for (let index = 0; index < keys.length; index += 1) {
            const key = keys[index];

            if (option[key]) {
              uVal = option[key];
              ukey = key;
              flag = true;
              break;
            }
          }

          if (flag) {
            this.option = {
              [`${ukey}`]: uVal,
              name: option.name
            };
            return this.getFileLoc(name);
          }

          return false;
        }).filter(v => v);
        this.option = option;
        return loclist;
      }
      /**
       * read config
       * @param {string} name
       * @returns {[]|{}}
       * @description
       * ```
       * user-path -> project-path -> des-path
       * read-conf -> read-json
       * ```
       */


      magicReadConfig(name = '.ymcrc.json') {
        const {
          tool
        } = this;
        const loclist = this.getFileLocList(name);
        return readConf(loclist, tool.readJson);
      }
      /**
       * @param {{}} data
       * @param {string} key
       * @param {string} val
       * @returns {{}}
       * @description
       * ```
       * ## why use?
       * - [x] easy to write json config in node.js
       *
       * - [x] idea: bind-cache-data -> define-json-data
       * ```
       */


      magicDefineConfig(data, key, val) {
        const gsc = new Gsc();
        gsc.bind(data); // preset - 1. set spilt char different with key 2. use one level

        gsc.split('/'); // gsc.conf('npm.user', 'hualei')

        gsc.conf(key, val);
        return gsc.data;
      }
      /**
       * get val with key
       * @param {string} key
       * @param {string} val
       * @returns {string}
       * @sample
       * ```
       * getJsonVal(data,'key','val')
       * ```
       */


      getJsonVal(key = 'key', val = 'val') {
        const {
          data
        } = this;
        let res; // if (option[keyname]) {
        //   // case:get key eg. jcm get --key=username
        //   res = data[option[keyname]]
        //   log(res)
        //   return res
        // }

        if (key) {
          // case:get key eg. jcm get --key=username
          res = data[val];
          log$2(res);
          return res;
        }
      }
      /**
       *
       * @param {string} key
       * @param {string} val
       */


      setJsonVal(key, val, hasval) {
        const {
          option,
          tool
        } = this;
        const self = this;
        const {
          name
        } = option;
        let data;
        data = self.magicReadConfig(name); // if (option[keyname] && valname in option) {
        //   // case:set key eg. jcm add --key=username --val=ymc
        //   data = self.magicDefineConfig(data, option[keyname], option[valname])
        // }

        if (key && hasval) {
          // case:set key eg. jcm add --key=username --val=ymc
          data = self.magicDefineConfig(data, key, val);
        } // tool.addDirs(option.wkd)
        // let loc = tool.joinPath(wkd, name)


        let loc; // loc = self.getFileLoc(name)

        loc = self.getFileLocList(name);
        loc = loc[loc.length - 1];
        const locdir = tool.parsePath(loc).dir;

        if (locdir) {
          tool.addDirs(locdir);
        }

        if (!option.dryrun) {
          tool.saveJson(loc, data);
        }

        this.data = data;
      }
      /**
       *
       * @param {string} cmd
       * @returns {{}}
       * @description
       * ```
       * idea:genreate config to des dir
       * make dir
       * mgnt cnf
       * ```
       */


      comEntry(cmd) {
        const {
          option,
          tool
        } = this;
        const {
          name
        } = option;
        let data = {};
        const keyname = 'key';
        const valname = 'val';
        let key;
        let val;
        let hasval;
        let cmdn = cmd;

        if (cmd === 'cnf') {
          // eg.jcm cnf --org=ymc
          // eg.jcm cnf --org
          const arglist = Object.keys(option);
          const builtinlist = 'name|wkd|usd|crd|w|u|c'.split('|');
          key = arglist.filter(v => !builtinlist.includes(v))[0];
          val = option[key];
          hasval = key in option;

          if (hasval) {
            cmdn = 'add';
          } else {
            cmdn = 'get';
          }
        } else {
          // eg.jcm add --key=org --val=ymc
          // eg.jcm get --key=org
          key = option[keyname];
          val = option[valname];
          hasval = valname in option;
        }

        switch (cmdn) {
          case 'add':
            // add
            this.setJsonVal(key, val, hasval);
            break;

          case 'del':
            // del
            // todo:it.deleteConfFile(flags)
            break;

          case 'get':
          default:
            data = this.magicReadConfig(name);
            this.getJsonVal(key, val); // case:get key eg. jcm get

            log$2('[info] info data:');
            log$2(data);
            break;
        }

        return data; // key,val
        // jcm get --key=username
        // key=option[keyname]
        // val=option[valname]
      }

    }

    const jcm = new Jcm(); // jcm.tool = {

    /* eslint-disable consistent-return */

    /**
     * make dirs sync
     * @param {string} dirPath
     * @returns {true}
     * @sample
     * ```
     * mkdirsSync('./src')
     * ```
     * @description
     * ```
     * ## why use ?
     * - [x] make dirs recursive
     * ## base
     * - [x] exist dir sync
     * - [x] get dir name
     * - [x] make a dir
     * ```
     */

    function mkdirsSync(dirPath) {
      if (node_fs.existsSync(dirPath)) {
        return true;
      }

      if (mkdirsSync(node_path.dirname(dirPath))) {
        node_fs.mkdirSync(dirPath);

        return true;
      }
    }

    const makeDirs = mkdirsSync;
    const rmDirs = node_fs.rmdirSync;

    /**
     * read json sync
     * @param {string} jsonLoc
     * @param {{}|[]} def
     * @returns {{}|[]}
     */

    function readJson(jsonLoc, def = {}) {
      let data;

      try {
        data = node_fs.readFileSync(jsonLoc);
        data = JSON.parse(data);
      } catch (error) {
        data = def;
      }

      return data;
    }
    /**
     * write json sync
     * @param {string} jsonLoc
     * @param {{}|[]} data
     */


    function saveJson(jsonLoc, data) {
      node_fs.writeFileSync(jsonLoc, JSON.stringify(data, null, 2));
    }
    /**
     * get user home dir
     * @returns {string}
     * @description
     * ```
     * warn:to test in different platform
     * ```
     */


    function getUserHome() {
      return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    }

    /* eslint-disable no-unused-expressions,consistent-return */
    const {
      log: log$1
    } = console; // idea: define usage likes below

    const defUsage = (ns = 'ns') => {
      const msg = `cnf gen for ymc repo
  mgnt cnf file
  usage:ns [subcmd] [option]
    ${ns} -h
    ${ns} -v

  subns:loc|cnf
  subcmd:add|del|get
    add - add des file
    del - del des file
    get - get des file
  option:
    -n,--name <filename> cnf file name (default:.ymcrc.json )
    -w,--wkd <dir> set working(packages/libname) dir
    -u,--usd use user dir
    -c,--crd use current(project) dir
    -h,--help get help
    -v,--version get version
`;
      return msg;
    }; // feat: use built in flags


    const builtinFlags = {
      name: '.ymcrc.json',
      wkd: 'packages/noop',
      usd: false,
      crd: true
    }; // idea:cli-fy api to cli with ymc style

    const entrys = (flags = {}) => {
      // log nano parser result 's flags (flags vs _ vs extras)
      // log(flags)
      entrys.debug && log$1('[info] run cmd with: ns');
      entrys.debug && log$1('[info] hello ns'); // do sth. here

      entrys.debug && log$1('[info] log cli option:');
      entrys.debug && log$1(flags);
    }; // 1. gen cmd fun


    const defFun = (cmd = 'add') => (cliFlags = {}) => {
      entrys.debug && log$1(`[info] run cmd with: ns ${cmd}`);
      entrys.debug && log$1(`[info] hello ${cmd}`); // do sth. here
      // log(`[info] log cli option:`)
      // log(cliFlags)
      // let nowFlags = { ...builtinFlags, ...cliFlags }

      let nowFlags;
      builtinFlags.wkd = '';

      if (entrys.notOnlyFlags) {
        nowFlags = { ...builtinFlags,
          ...cliFlags.flags
        };
      } else {
        nowFlags = { ...builtinFlags,
          ...cliFlags
        };
      } // comEntry(cmd, nowFlags)


      entrys.debug && log$1('[info] log now flags:');
      entrys.debug && log$1(nowFlags);
      jcm.option = nowFlags;
      jcm.tool = {
        parsePath: node_path.parse,
        joinPath: node_path.join,
        addDirs: makeDirs,
        delDirs: rmDirs,
        readJson,
        saveJson,
        getUserHome
      };

      if (cmd === 'loc') {
        const file = jcm.getFileLocList(); // jcm.getFileLoc()

        log$1('[info] cnf file list:');
        log$1(file);
        log$1('[info] the last file:');
        log$1(file[file.length - 1]); // log(jcm.tool.parsePath(file[file.length - 1]))

        return;
      }

      return jcm.comEntry(cmd);
    }; // 2. bind cmd fun


    const ge = new GE(); // let subcmd = getTxtFromUsage('subcmd', usage)
    // ge.entrys(entrys).bind('add|get|del|put|cls|log',defFun,'call')

    ge.entrys(entrys).bind('add|del|put|get', defFun, 'call');
    ge.entrys(entrys).bind('loc|cnf', defFun, 'call'); // ge.entrys(entrys).bind(subcmd, defFun, 'call')
    // ge.entrys(entrys).bind('eslint|jest|babel|tsc', defFun, 'call')
    // log(entrys)
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

    entrys.cnf.enableZeroOption = true; // entrys.log.enableZeroOption=true
    // entrys.cls.enableZeroOption=true
    // feat(cli): en-able ns zero arg\n with entrys.enableZeroOption=true

    entrys.enableZeroOption = true; // feat(cli): en-able _ and extras\nwith entrys.notOnlyFlags=true

    entrys.notOnlyFlags = true; // feat(cli): en-able debug lib-clify \nwith entrys.debug=true

    entrys.debug = true;
    // 1. check this file js syantx
    // node script/jcm-clify.js
    // 2.
    // jcm user.name --des=packages/noop -c -u -w --name=.ymcrc.json
    // jcm user.name ymc --des=packages/noop -c -u -w --name=.ymcrc.json
    // node script/jcm-cli.js user.name --des=packages/noop -c -u -w --name=.ymcrc.json --debugArgs
    // node script/jcm-cli.js user.name ymc --des=packages/noop -c -u -w --name=.ymcrc.json --debugArgs

    /* eslint-disable no-restricted-syntax,max-len,no-use-before-define */
    function nanoargs(input) {
      let extras = [];
      let args = input;
      const _ = [];

      if (input.includes('--')) {
        extras = input.slice(input.indexOf('--') + 1);
        args = input.slice(0, input.indexOf('--'));
      }

      const newArgs = [];

      for (let i = 0; i < args.length; i += 1) {
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

    /* eslint-disable no-param-reassign */
    const defOption = () => ({
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

    /* eslint-disable  consistent-return,prefer-const */
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
          log('error:invalid argv length');
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

    // #!/usr/bin/env node
    // idea: use with cli
    // ycs.version('1.0.0').entry(entrys).run()

    const ycs = new Ycs();
    installEntrys(entrys)(ycs);
    ycs.run(process.argv); // function main(ycs)(){}
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
