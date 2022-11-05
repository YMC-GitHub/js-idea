/**
  * pkgsInfo v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:fs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'node:fs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["pkgs-info"] = {}, global.node_fs));
})(this, (function (exports, node_fs) { 'use strict';

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
    * streamIo v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  function readStream(stream) {
    return new Promise((resolve, reject) => {
      let data = '';
      stream.on('data', chunk => {
        data += chunk.toString();
      }).on('end', () => {
        resolve(data);
      }).on('error', reject);
    });
  }

  function writeStream({
    stream,
    data
  }) {
    return new Promise((resolve, reject) => {
      // write
      stream.write(data, 'utf-8'); // fire end

      stream.end(); // desc-x-s: handle event finish and err

      stream.on('finish', () => {
        resolve(data);
      }).on('error', reject); // desc-x-e: handle event finish and err
    });
  }

  /**
    * jsonStreamIo v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /**
   * @sample
   * ```
   * jsonstream.file.name="package.json"
   * //or
   * jsonstream.init("package.json")
   * await jsonstream.read()
   * await jsonstream.write({})
   * ```
   */

  class JsonStream {
    constructor(name, data) {
      this.init(name, data);
    }
    /**
     * read file async (stream mode)
     * @param {{}|[]} def
     * @returns {Prmosie<json>}
     */


    async read(def = {}) {
      const {
        file
      } = this;
      let reader;
      let res;

      try {
        reader = node_fs.createReadStream(file.name);
        res = await readStream(reader);
        res = JSON.parse(res);
      } catch (error) {
        // console.log(error);
        res = def;
      }

      file.data = res;
      return res;
    }
    /**
     * write file async (stream mode)
     * @param {{}|[]|undefined} data
     * @returns {Prmosie<void>}
     */


    async write(data) {
      // no-param-reassign data
      // no-unused-vars option

      /* eslint-disable no-unused-vars */
      const {
        file,
        option
      } = this; // eslint-disable-line

      let writer;
      let content = data;

      try {
        writer = node_fs.createWriteStream(file.name);

        if (data) {
          file.data = data;
        } else {
          content = file.data;
        }

        await writeStream({
          stream: writer,
          data: JSON.stringify(content, null, 2)
        });
      } catch (error) {}
    }

    init(name = 'package.json', data = {}) {
      this.file = {
        name,
        data
      };
      this.option = {};
    }
    /* eslint-disable class-methods-use-this */


    new(...option) {
      return new JsonStream(...option);
    }

  }

  const jsonstream = new JsonStream();

  /**
    * chainTask v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */

  /**
   * chain async task
   * @param {()=>{}} tasks
   * @returns {{}[]}
   */
  async function chaintask(tasks) {
    const res = [];
    let chain = Promise.resolve(null); // fix Unary operator '++' used       no-plusplus

    /* eslint-disable no-plusplus */

    for (let index = 0; index < tasks.length; index++) {
      const task = tasks[index]; // fix Unexpected console statement   no-console
      // fix 'v' is defined but never used  no-unused-vars

      /* eslint-disable no-unused-vars,no-console */

      chain = chain.then(async v => {
        // feat: save each result to res
        res[index] = await task();
        return res[index];
      }).catch(console.log);
    }

    await chain;
    return res;
  }

  /**
   * mock node.js path.dirname
   * @param {string} wkd
   * @returns
   */
  function dirname(wkd, sep = '/') {
    const list = wkd.split(/\/?\\|\//);
    return list.slice(0, list.length - 1).join(sep);
  }
  /**
   * mock node.js path.basename
   * @param {string} wkd
   * @returns
   */


  function basename(wkd) {
    const list = wkd.split(/\/?\\|\//);
    return list[list.length - 1];
  }

  /* eslint-disable camelcase,max-len */
  const {
    log
  } = console;
  /**
   * get lib name with working dir
   * @param {string} wkd
   * @param {{trim?:boolean,camelize?:boolean}} option
   * @returns
   */

  function getLibNameFromPath(wkd, option = {}) {
    let res = basename(wkd);
    const opt = {
      trim: true,
      ...option
    };

    if (opt.trim) {
      res = res.trim();
    }

    if (opt.camelize) {
      res = camelize(res);
    }

    return res;
  }
  /**
   * get lib dir with working dir
   * @param {string} wkd
   * @returns
   */


  function getPackagesLocFromPath(wkd) {
    return dirname(wkd);
  }
  /**
   * get file modified and created date
   * @param {string} loc
   * @returns {{modifiedAt:string,createdAt}}
   */


  function getFileDatedAt(loc) {
    // log(`[info] get created_at, modified_at`)
    const stat = node_fs.statSync(loc);
    const {
      birthtime: created,
      mtime: modifedData_at,
      ctime: modifiedStat_at
    } = stat;
    let modified = [modifedData_at, modifiedStat_at]; // https://futurestud.io/tutorials/node-js-get-a-files-created-date

    modified = modified.sort((a, b) => new Date(b) - new Date(a)); // .formatDate(`yyyy-MM-dd`)
    // log(
    //     `b:${formatDate('yyyy-MM-dd', new Date(created))} m:${formatDate(
    //         'yyyy-MM-dd',
    //         new Date(modifedData_at)
    //     )} c:${formatDate('yyyy-MM-dd', new Date(modifiedStat_at))} loc:${loc}`
    // )

    return {
      modifiedAt: modified[0],
      createdAt: created
    };
  }
  /**
   * @param {{wkd:string}} options
   * @returns {pkginfo}
   */


  async function getPkgInfo(options = {}) {
    const option = {
      wkd: './private-pkgs/noop',
      ...options
    };
    const libname = getLibNameFromPath(option.wkd);
    const libdir = getPackagesLocFromPath(option.wkd);
    const loc = `${libdir}/${libname}/package.json`;
    jsonstream.init(loc);
    const data = await jsonstream.read({}); // log(`[info] get name,desciption`)

    const {
      name,
      description
    } = data; // log(libname, libdir)
    // log(data)

    let modified_at = [];
    let created_at = [];
    const list = [`${libdir}/${libname}/package.json`, `${libdir}/${libname}/src/index.js`];
    list.filter(v => node_fs.existsSync(v)).forEach(v => {
      const {
        modifiedAt,
        createdAt
      } = getFileDatedAt(v);
      modified_at.push(modifiedAt);
      created_at.push(createdAt);
    }); // .flat(Infinity)

    modified_at = modified_at.sort((a, b) => new Date(b) - new Date(a));
    created_at = created_at.sort((a, b) => new Date(a) - new Date(b));
    [modified_at] = modified_at;
    [created_at] = created_at;
    return {
      name,
      description,
      created_at,
      modified_at,
      loc
    };
  }
  /**
   *
   * @param {{packagesLoc:string|string[],split:string|regexp}} options
   * @returns {{wkd:stirng,libname:string,packagesLoc:string}[]}
   */


  async function getPkgLocListInDir(options = {}) {
    const option = {
      packagesLoc: ['packages'],
      split: ',',
      ...options
    }; // log(`[info] get pkg loc list`)
    // feat: split string to array when packagesLoc is string

    const dirs = Array.isArray(option.packagesLoc) ? option.packagesLoc : option.packagesLoc.split(option.split);
    let list = dirs.map(dir => node_fs.readdirSync(dir).map(name => ({
      wkd: `${dir}/${name}`,
      libname: name,
      packagesLoc: dir // libdir: dir

    }))).flat(Infinity); // feat: only diretory

    list = list.filter(opt => node_fs.statSync(opt.wkd).isDirectory());
    return list;
  }

  /* eslint-disable prefer-const */
  /**
   * put pkgs-info
   * @param {string} name
   * @param {string} key
   * @param {string} state
   * @param {pkginfo[]} store
   * @returns {pkginfo[]}
   */

  function putPkgsInfo(name, key, state, store) {
    let added = store.some(v => v.name === name);

    if (!added) {
      store.push({
        name,
        [`${key}`]: state
      });
    } else {
      store.forEach(v => {
        if (v.name === name) {
          v[key] = state;
        }
      });
    }

    return store;
  }
  /**
   * merge pkgs-info
   * @param {pkginfo[]} now
   * @param {pkginfo[]} data
   * @returns {pkginfo[]}
   */


  function mergPkgsInfo(now, data) {
    const res = {};
    now.forEach(v => {
      const {
        name
      } = v;
      res[name] = v;
    });
    data.forEach(v => {
      const {
        name
      } = v;

      if (res[name]) {
        res[name] = { ...res[name],
          ...v
        };
      } else {
        res[name] = v;
      }
    });
    return Object.values(res);
  }
  /**
   * pull pkgs-info
   * @param {{packagesLoc:string|string[]storeAt:string}} options
   */


  async function pullPkgsInfo(options = {}) {
    let list;
    let tasks;
    let inPackagejson;
    let loc;
    list = await getPkgLocListInDir(options);
    tasks = list.map(opt => async () => await getPkgInfo(opt));
    let inPkgsInfo;
    inPackagejson = await chaintask(tasks); // log(data)

    loc = options.storeAt ? options.storeAt : 'pkgs-info.json';
    jsonstream.init(loc);
    inPkgsInfo = await jsonstream.read([]);
    const res = mergPkgsInfo(inPkgsInfo, inPackagejson);
    await jsonstream.write(res);
    log(`[info] out: ${loc}`);
  }
  /**
   * code pkgs-info
   * @param {{packagesLoc:string|string[],storeAt:string}} options
   */


  async function codePkgsInfo(options = {}) {
    let list;
    let tasks;
    let inPackagejson;
    let loc; // codePkgsInfo({ packagesLoc: 'packages,private-pkgs' })

    list = await getPkgLocListInDir(options);
    tasks = list.map(opt => async () => await getPkgInfo(opt));
    let inPkgsInfo;
    inPackagejson = await chaintask(tasks); // log(inPackagejson)

    loc = options.storeAt ? options.storeAt : 'pkgs-info.json';
    jsonstream.init(loc);
    inPkgsInfo = await jsonstream.read([]); // log(inPkgsInfo)

    const res = mergPkgsInfo(inPackagejson, inPkgsInfo);
    await jsonstream.write(res);
    log(`[info] out: ${loc}`);
  }
  /**
   * push pkgs-info - update pkg.description
   * @param {{storeAt:string}} options
   */


  async function pushPkgsInfo(options = {}) {
    let tasks;
    let data;
    let loc;
    loc = options.storeAt ? options.storeAt : 'pkgs-info.json';
    jsonstream.init(loc);
    data = await jsonstream.read([]);
    tasks = data.map(pkg => async () => {
      jsonstream.init(pkg.loc);
      let cache = await jsonstream.read({});
      cache.description = pkg.description;
      await jsonstream.write(cache);
      cache = null; // return cache
    });
    log(`[info] out: ${loc}`);
    await chaintask(tasks);
  }

  exports.codePkgsInfo = codePkgsInfo;
  exports.pullPkgsInfo = pullPkgsInfo;
  exports.pushPkgsInfo = pushPkgsInfo;
  exports.putPkgsInfo = putPkgsInfo;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
