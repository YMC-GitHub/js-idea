/**
  * jcm v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jcm = {}));
})(this, (function (exports) { 'use strict';

  // import { readJson, saveJson, getUserHome } from './jcm-too.js'
  const {
    log: log$1
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

      if (useIndex || index == order) {
        index++;
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

      for (let index = 0; index < list.length; index++) {
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


    conf(key = '', val) {
      if (!key) return this; // note: extract com var

      let {
        data,
        option
      } = this;
      let last; // note: get name list

      key = key.split(option.splitChar); // note: get last name

      last = key[key.length - 1]; // note: get prev data

      const {
        length
      } = key;

      for (let index = 0; index < length - 1; index++) {
        const name = key[index]; // note: ini data in key when not dedfining

        if (!data[name]) {
          data[name] = {};
        }

        data = data[name]; // data=data[name]?data[name]:{}
      } // log(key,data)
      // feat: get val


      if (val == undefined) {
        return data[last];
      } // feat: set val


      data[last] = val;
      log$1(`set ${last} ${val}`); // feat: support chain when setting

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

    for (let index = 0; index < cnfLocList.length; index++) {
      const cnfLoc = cnfLocList[index];
      rc.use(readJson(cnfLoc));
    }

    return rc.load();
  }

  new Ujc();
  new Gsc();

  const {
    log
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
      let {
        option,
        tool
      } = this;
      let filename = name ? name : option.name;
      let flags = option;

      if (flags.usd || flags.u) {
        // log(tool.getUserHome(), filename, option)
        return tool.joinPath(tool.getUserHome(), filename);
      }

      if (flags.crd || flags.c) {
        return filename;
      }

      if (flags.wkd
      /*|| flags.w*/
      ) {
        log(filename, option);
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
      let {
        option
      } = this;
      let list = [['usd', 'u'], ['crd', 'c'], ['wkd']];
      loclist = list.map(keys => {
        let ukey, uVal, flag;

        for (let index = 0; index < keys.length; index++) {
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
      let {
        tool
      } = this;
      let loclist = this.getFileLocList(name);
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
      let {
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
        log(res);
        return res;
      }
    }
    /**
     *
     * @param {string} key
     * @param {string} val
     */


    setJsonVal(key, val, hasval) {
      let {
        option,
        tool
      } = this;
      let self = this;
      let {
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


      let loc; //loc = self.getFileLoc(name)

      loc = self.getFileLocList(name);
      loc = loc[loc.length - 1];
      let locdir = tool.parsePath(loc).dir;

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
      let {
        option,
        tool
      } = this;
      let {
        name
      } = option;
      let data = {};
      let keyname = 'key';
      let valname = 'val';
      let key, val, hasval;

      if (cmd == 'cnf') {
        //eg.jcm cnf --org=ymc
        //eg.jcm cnf --org
        let arglist = Object.keys(option);
        let builtinlist = 'name|wkd|usd|crd|w|u|c'.split('|');
        key = arglist.filter(v => !builtinlist.includes(v))[0];
        val = option[key];
        hasval = key in option;

        if (hasval) {
          cmd = 'add';
        } else {
          cmd = 'get';
        }
      } else {
        //eg.jcm add --key=org --val=ymc
        //eg.jcm get --key=org
        key = option[keyname];
        val = option[valname];
        hasval = valname in option;
      }

      switch (cmd) {
        case 'add':
          //add
          this.setJsonVal(key, val, hasval);
          break;

        case 'del':
          //del
          // todo:it.deleteConfFile(flags)
          break;

        case 'get':
        default:
          data = this.magicReadConfig(name);
          this.getJsonVal(key, val); // case:get key eg. jcm get

          log(`[info] info data:`);
          log(data);
          break;
      }

      return data; //key,val
      //jcm get --key=username
      //key=option[keyname]
      //val=option[valname]
    }

  }

  const jcm = new Jcm(); // jcm.tool = {

  exports.Jcm = Jcm;
  exports.jcm = jcm;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
