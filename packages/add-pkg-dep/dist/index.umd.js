/**
  * addPkgDep v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node:fs'), require('node:module'), require('node:child_process')) :
  typeof define === 'function' && define.amd ? define(['node:fs', 'node:module', 'node:child_process'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["add-pkg-dep"] = factory(global.node_fs, global.node_module, global.node_child_process));
})(this, (function (node_fs, node_module, node_child_process) { 'use strict';

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
    * getCustomProp v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /**
   * get prefixed prop
   * @param {string} prop
   * @param {{prefix:string,camelize:boolean}} option
   * @returns
   */

  function getPrefixedProp$1(prop, option) {
    let prefixedProp = prop;

    if (option.prefix) {
      prefixedProp = `${option.prefix}${prop}`;
    }

    if (option.camelize) {
      prefixedProp = `${option.prefix}-${prop}`;
      prefixedProp = camelize(prefixedProp);
    }

    return prefixedProp;
  }
  /**
   * get custom prop from context
   * @param {{}} context
   * @param {string} prop
   * @param {()=>{}} def
   * @param {{prefix:string,camelize:boolean}} options
   * @returns {*}
   * @desciption
   * ```
   * ## task
   * - [x] auto bind custiom prefix to property
   * - [x] auto camelize property
   * ```
   */


  function getCustomProp(context, prop, def, options = {}) {
    const option = {
      prefix: 'custom',
      camelize: true,
      ...options
    };
    const prefixedProp = getPrefixedProp$1(prop, option); // idea:get-custom-if-presence -> get-native-if-presence -> get-default-if-presence

    const native = context[prop] ? context[prop] : def;
    return context[prefixedProp] ? context[prefixedProp] : native;
  }

  /**
    * getFileList v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /**
   * get prefixed prop
   * @param {string} prop
   * @param {{prefix:string,camelize:boolean}} option
   * @returns
   */

  function getPrefixedProp(prop, option) {
    let prefixedProp = prop;

    if (option.prefix) {
      prefixedProp = `${option.prefix}${prop}`;
    }

    if (option.camelize) {
      prefixedProp = `${option.prefix}-${prop}`;
      prefixedProp = camelize(prefixedProp);
    }

    return prefixedProp;
  }
  /**
   * set custom prop to context
   * @param {{}} context
   * @param {string} prop
   * @param {()=>{}} def
   * @param {{prefix:string,camelize:boolean,override:boolean}} options
   * @returns {*}
   * @desciption
   * ```
   * ## task
   * - [x] auto bind custiom prefix to property
   * - [x] auto camelize property
   * - [x] over ride native is allow
   * ```
   */


  function setCustomProp(context, prop, def, options = {}) {
    const option = {
      prefix: 'custom',
      camelize: true,
      override: false,
      ...options
    }; // over ride native

    if (option.override) {
      context[prop] = def;
      return;
    }

    const prefixedProp = getPrefixedProp(prop, option);
    context[prefixedProp] = def;
  }

  const handles = {};
  setCustomProp(handles, 'readdirSync', node_fs.readdirSync, {
    override: true
  });
  setCustomProp(handles, 'statSync', node_fs.statSync, {
    override: true
  }); // import { readdirSync, statSync } from 'fs'
  // @ymc/get-file-list

  /**
   * get file list in dir - only-name ? recursive?
   * @param {string} dir
   * @param {{onlyName?:boolean,recursive?:boolean}} options
   * @returns {string[]}
   */

  function getFilelist(dir, options = {}) {
    // todo: custom readdirSync,statSync or mock it
    const option = {
      onlyName: false,
      recursive: true,
      ...handles,
      ...options
    }; // const customReadDirSync = getCustomProp(option, 'readdirSync', readdirSync)
    // const customstatSync = getCustomProp(option, 'statSync', statSync)
    // const customReadDirSync = getCustomProp(option, 'readdirSync', defaultHandles['readdirSync'])
    // const customstatSync = getCustomProp(option, 'statSync', defaultHandles['statSync'])

    const customReadDirSync = getCustomProp(option, 'readdirSync');
    const customstatSync = getCustomProp(option, 'statSync'); // getCustomProp(option, 'noop', noop)

    let list = customReadDirSync(dir); // log(list)

    list = list.map(v => {
      const loc = `${dir}/${v}`;
      const stat = customstatSync(loc);

      if (stat.isFile()) {
        if (option.onlyName) {
          return v;
        }

        return loc;
      }

      if (stat.isDirectory() && option.recursive) {
        return getFilelist(loc, options);
      }

      return '';
    });
    list = list.flat(1);
    return list;
  }

  /**
    * getNodeBuiltinModules v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  // eslint-diable node/no-deprecated-api

  /**
   *
   * @returns {string[]}
   */

  function getNodeBuitInModule() {
    // https://github.com/sindresorhus/builtin-modules
    const ignoreList = ['sys'];
    return (node_module.builtinModules || (process.binding ? Object.keys(process.binding('natives')) : []) || []).filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x) && !ignoreList.includes(x)).sort();
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
    * textStreamIo v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /* eslint-disable prefer-const,class-methods-use-this */

  /**
   * @sample
   * ```
   * textstream.file.name="CHANGELO.md"
   * //or
   * textstream.init("CHANGELO.md")
   * await textstream.read()
   * textstream.option.writemode='overide'
   * await textstream.write('')
   * ```
   */

  class TextStream {
    constructor(name = 'CHANGELO.md') {
      this.init(name);
    }
    /**
     * read file async (stream mode)
     * @param {string|undefined} def
     * @returns {Prmosie<string>}
     */


    async read(def = '') {
      const {
        file
      } = this;
      let reader;
      let res;

      try {
        reader = node_fs.createReadStream(file.name);
        res = await readStream(reader);
      } catch (error) {
        res = def;
      }

      file.data = res;
      return res;
    }
    /**
     * write file async (stream mode)
     * @param {string} data
     * @returns {Prmosie<void>}
     */


    async write(data) {
      // prefer-const writer,old
      // no-param-reassign data
      // no-fallthrough
      const {
        file,
        option
      } = this;
      let writer;
      let old;
      writer = node_fs.createWriteStream(file.name);
      old = file.data; // insert-head?append?override?
      // let writemode = "override";

      let text;

      switch (option.writemode) {
        case 'override':
          text = `${data}`;
          break;
        // case "head":
        //   text = `${data}\n${old}`;
        //   break;

        case 'append':
          text = `${old}\n${data}`;
          break;
        // case "override":
        //   text = `${data}`;

        case 'head':
          text = `${data}\n${old}`;
          break;

        default:
          text = `${data}`;
          break;
      }

      file.data = text;
      await writeStream({
        stream: writer,
        data: text
      });
    }
    /**
     *
     * @param {string} name
     * @param {string} data
     * @returns {this}
     */


    init(name = 'CHANGELO.md', data = '') {
      this.file = {
        name,
        data
      };
      this.option = {};
      return this;
    }
    /**
     * ceate a new instance
     * @param  {...any} option
     * @returns
     */


    new(...option) {
      return new TextStream(...option);
    }

  }

  const textstream = new TextStream();

  /**
    * depParse v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /**
   * mock node.js path.dirname
   * @param {string} wkd
   * @returns
   */

  function dirname$1(wkd, sep = '/') {
    const list = wkd.split(/\/?\\|\//);
    return list.slice(0, list.length - 1).join(sep);
  }
  /**
   * mock node.js path.join (expect join.sep ='/')
   * @param {string[]} likepath
   * @returns {string}
   */


  function join(...likepath) {
    const list = [...likepath].map(v => v.split(/\/?\\|\//)).flat(Infinity).filter(v => v);
    return list.join(join.sep ? join.sep : '/');
  }
  /* eslint-disable prefer-const,no-unused-vars */
  // function deleteUndefiendKeys(option = {}) {
  //     Object.keys(option).forEach(v => {
  //         if (option[v] === undefined) {
  //             delete option[v]
  //         }
  //     })
  // }
  // @ymc/get-obj-only-define-keys

  /**
   * get obj only define keys
   * @param {{}} option
   */


  function getObjOnlyDefinedKeys(option = {}) {
    let res = {};
    Object.keys(option).forEach(v => {
      if (option[v] !== undefined) {
        res[v] = option[v];
      }
    });
    return res;
  } // @ymc/del-comment,@ymc/comment-preset-js,@ymc/comment-preset-shell

  /**
   * delete comment
   * @param {deleteCommentOption} options
   * @returns
   */


  function delComment(options = {}) {
    const option = {
      text: '',
      ignoreComment: true,
      commentReg: [/\/\/.*/gi, // /\/\*+.*\*+\//gim,
      /(\/)([*])+(.|\n)+?(\2\1)/gi],
      ...options
    };
    let {
      text,
      commentReg
    } = option; // log(options, commentReg)
    // bugs:  space line at replace location

    if (option.ignoreComment) {
      // log(`[step] del-comment`);
      // https://www.codegrepper.com/code-examples/whatever/Regex+to+match+a+multiline+comment
      commentReg.forEach(reg => {
        text = text.replace(reg, ''); // text = delLineByMatch({text,reg})
      });
    }

    return text;
  }
  /**
   * del requries-exp path - for package.json-ed pkg
   * @param {string[]} list
   * @returns {string[]}
   */


  function delRequriesExpPath(list) {
    return list.map(txt => {
      let to = 1;
      let res = txt;

      if (res.match(/^@/)) {
        to += 1;
      } // feat: set inner file disable ./xx/xx


      if (!res.match(/^.\//)) {
        res = res.split(/\//).slice(0, to).join('/');
      }

      return res;
    });
  } // @ymc/get-requires-exp,@ymc/requires-exp-preset-js,@ymc/requires-exp-preset-hbs

  /**
   * get requires expression - like js require,import , hbs include and other
   * @param {{text:string,requireReg:regexp[]}} options
   * @returns {string[]}
   */


  function getRequriesExp(options = {}) {
    const option = {
      text: '',
      // ignoreComment: true,
      requireReg: [/require\(.*\)/gi, /from +("|').*("|')/gi, /import +("|').*("|')/gi],
      ...options
    };
    const {
      requireReg,
      text
    } = option;
    let matchs; // descx: get-origin-matched
    // log(`[step] get-origin-matched`);

    matchs = requireReg.map(reg => {
      let match;
      match = text.match(reg); // log(`[debug] log match`);
      // log(match);

      return match;
    });
    matchs = matchs.filter(v => v);
    matchs = matchs.flat(1);
    matchs = [...new Set(matchs)]; // del-require-exp
    // get custom del-require-exp // todo
    // handle del-require-exp with custom handle when custom requireReg

    matchs = matchs.map(txt => {
      const to = '';
      let res = txt;

      if (res.match(requireReg[0])) {
        res = res.replace(/require\(/, to).replace(/\)/, to);
      } else if (res.match(requireReg[1])) {
        res = res.replace(/from +/, to);
      } else if (res.match(requireReg[2])) {
        res = res.replace(/import +/, to);
      }

      res = res.replace(/^("|')/, to).replace(/("|')$/, to); // no-useless-escape \' \*
      // log(`[debug] log txt`);
      // log(res);

      return res;
    }); // del path

    matchs = delRequriesExpPath(matchs);
    return matchs;
  }
  /**
   * get local deps - dep is project-pkg in mono repo
   * @param {{data:string[],localDepReg:regexp[]}} options
   * @returns {string[]}
   */


  function getLocalDeps(options = {}) {
    const option = {
      data: [''],
      localDepReg: [/^\./, /@src/],
      ...options
    };
    const {
      localDepReg,
      data
    } = option;
    let localDep; // log(data, localDepReg)
    // localDep = data.filter(txt => {
    //     return localDepReg.some(reg => {
    //         log(reg.test(txt), reg, txt)
    //         return reg.test(txt)
    //     })
    // })

    localDep = data.filter(txt => localDepReg.some(reg => reg.test(txt))); // log(`[info] local dep`)
    // log(localDep)

    return localDep;
  }
  /**
   * get out-of-project deps - dep is project-pkg in mono repo
   * @param {{data:string[],localDepReg:regexp[],disableLocalDepReg:boolean,localDep:string[],builintDep:string[]}} options
   * @returns {string[]}
   */


  function getOutProjectDeps(options = {}) {
    const option = {
      localDep: [''],
      builintDep: [''],
      disableLocalDepReg: false,
      ...options
    }; // get-out-lib-dep

    const {
      data,
      localDep,
      localDepReg,
      builintDep
    } = option;
    let outlibdep;
    outlibdep = [...data]; // feat: exclude  local-dep deps
    // feat: find with localDepReg is optional , default enable
    // on,off vs disable,enable, vs no // short and semantic

    if (!option.disableLocalDepReg) {
      outlibdep = outlibdep.filter(txt => !localDepReg.some(reg => reg.test(txt)));
    }

    if (localDep) {
      // outlibdep = outlibdep.filter(txt => !localDep.some(ndp => txt === ndp))
      // outlibdep = excludeIt(outlibdep, localDep)
      outlibdep = excludeDep(outlibdep, localDep);
    } // feat: exclude  built-in deps


    if (builintDep) {
      // outlibdep = outlibdep.filter(txt => !builintDep.some(ndp => txt === ndp))
      // outlibdep = excludeIt(outlibdep, builintDep)
      outlibdep = excludeDep(outlibdep, builintDep);
    }

    return outlibdep;

    function excludeDep(store, exclude) {
      const deps = exclude.filter(v => typeof v === 'string');
      return excludeIt(store, deps);
    }

    function excludeIt(store, ignore) {
      return store.filter(txt => !ignore.some(ndp => txt === ndp));
    }
  } // @ymc/mock-path,@ymc/mock-path-dirname,@ymc/mock-path-join,@ymc/mock-path-basename //todo
  // @ymc/resolve-local-dep

  /**
   * resolve local dep
   * @param {{data:string[],skipResolveReg:regexp[],fileloc:string}} options
   * @returns  {string[]}
   */


  function resolveLocalDep(options = {}) {
    const option = {
      data: [''],
      skipResolveReg: [/^@private-pkgs/, /^@/],
      ...options
    };
    const {
      skipResolveReg,
      fileloc
    } = option;
    let localdep = [...option.data];
    localdep = localdep.map(dep => {
      if (skipResolveReg.some(reg => reg.test(dep))) {
        return dep;
      } // if (/^@private-pkgs/.test(dep)) {
      //     return dep
      // }
      // if (/^@/.test(dep)) {
      //     return dep
      // }


      let abs = join(dirname$1(fileloc), dep); // \ to /

      abs = abs.replace(/\\/gi, '/');
      return abs;
    });
    return localdep;
  }
  /* eslint-disable prefer-const,no-unused-vars */

  /**
   *
   * @description
   * ```
   * ## why use?
   * - [x] get a file 's dep
   * - [x] get a pkg 's dep
   * - [x] to install out-lib dep automation when it compile
   * - [x] to copy in-lib dep automation when it migrate
   * ```
   */


  class ParseHelp {
    constructor() {
      this.init();
    }

    init() {
      this.option = {};
      this.filetext = '';
      this.matchs = [];
      this.inLibDeps = [];
      this.outlibDeps = [];
      this.alldeps = [];
      this.deptree = {};
      this.option.inlibdepReg = [/^\./, /@src/]; // this.option.outlibReg = [/@ymc/];

      this.option.parsetasks = ['in', 'out'];
      this.option.nodedeps = ['fs', 'path', 'os'];
    }
    /**
     * read text file
     * @param {string} loc
     * @return {this}
     */


    async read(loc) {
      textstream.init(loc);
      this.filetext = await textstream.read();
      return this;
    }
    /**
     * del comment if ignore-comment
     */


    delComment() {
      let {
        option,
        filetext
      } = this;
      const {
        commentReg,
        ignoreComment
      } = option; // filetext = delComment({ text: filetext, ...{ commentReg, ignoreComment } })
      // filetext = delComment({ text: filetext, commentReg, ignoreComment }) //no when no commentReg
      // filetext = delComment({ text: filetext, ...selectDataKeys(option, '{commentReg, ignoreComment}') })//ok
      // filetext = delComment({ text: filetext, ...option }) //ok

      filetext = delComment(getObjOnlyDefinedKeys({
        text: filetext,
        commentReg,
        ignoreComment
      }));
      this.filetext = filetext;
      return this;
    }

    getMatchs() {
      const {
        option,
        filetext
      } = this; // const { requireReg } = option

      const matchs = getRequriesExp({
        text: filetext,
        ...option
      });
      this.matchs = matchs;
      return matchs;
    }

    getInLibDeps() {
      const {
        option,
        matchs
      } = this;
      const {
        inlibdepReg
      } = option; // const inlibdep = getLocalDeps({ data: matchs, ...getObjOnlySelectedKeys(option, '{localDepReg: inlibdepReg}') })

      const inlibdep = getLocalDeps(getObjOnlyDefinedKeys({
        data: matchs,
        localDepReg: inlibdepReg
      }));
      this.inLibDeps = inlibdep;
      return inlibdep;
    }
    /**
     * get out lib dep
     * @description
     * ```
     * ## task
     *  - [x] filter in lib dep
     *  - [x] filter node builtin dep
     * ```
     */


    getOutlibDes() {
      const {
        option,
        matchs
      } = this;
      const {
        inlibdepReg,
        nodedeps
      } = option;
      const outlibdep = getOutProjectDeps(getObjOnlyDefinedKeys({
        data: matchs,
        localDepReg: inlibdepReg,
        // localDep: inLibDeps,
        builintDep: nodedeps
      }));
      this.outlibDeps = outlibdep;
      return this;
    } // excludeNodeDep() {}

    /**
     * reslove in lib dep path
     * @param {*} loc
     * @description
     * ```
     * ## task
     * - [x] ignore private pkgs -- start with private-pkgs
     * - [x] ignore scope pkg
     * - [x] with unix path format
     * ```
     */


    resolveInLibDeps(loc) {
      // resolve-local-dep-file
      let localdep = this.inLibDeps;
      localdep = resolveLocalDep({
        data: localdep,
        fileloc: loc
      });
      this.inLibDeps = localdep;
    }
    /**
     * parse his dep for loc
     * @param {string} loc
     * @returns
     */


    async parse(loc) {
      const {
        option
      } = this;
      const {
        parsetasks
      } = option;
      await this.read(loc);
      this.delComment();
      this.getMatchs();

      if (parsetasks.includes('in')) {
        this.getInLibDeps();
        this.resolveInLibDeps(loc);
      }

      if (parsetasks.includes('out')) {
        this.getOutlibDes();
      }

      const {
        inLibDeps,
        outlibDeps
      } = this;
      this.alldeps = [...inLibDeps, ...outlibDeps];
      return this.alldeps;
    }

  }

  /**
    * renderTpl v1.0.0
    * (c) 2018-2022 ymc
    * @license MIT
    */

  /** @typedef {{[string]:string|boolean|number|undefined}} data */

  /**
   * @param {string} tpl
   * @param {data} data
   * @returns {Stringimport("typescript").LiteralLike}
   */
  function renderTpl(tpl, data) {
    let res = tpl;
    Object.keys(data).forEach(key => {
      const value = data[key];
      res = res.replace(new RegExp(`{${key}}`, 'ig'), value);
    });
    return res;
  }
  /**
   *
   * @param {string} tpl
   * @param {data} data
   * @returns {string|(data:data)=>string}
   * @sample
   * ```
   * writeTpl('{method} repo/owner',{method:'POST'}) //POST repo/owner
   * ```
   */


  function writeTpl(tpl, data) {
    if (data) {
      return renderTpl(tpl, data);
    }

    return v => renderTpl(tpl, v);
  }

  /**
    * runBash v0.0.3
    * (c) 2018-2022 ymc
    * @license MIT
    */
  /* eslint-disable no-use-before-define,no-param-reassign */

  /**
   * opt to str-format
   * @description
   * ```
   * arr to str
   * ```
   * @param {string|string[]} cmdOptStr some cmd opt str-format or arr-format
   * @param {string} [splitChar=' '] some string
   * @returns {string}
   */

  const cmdOptArr2cmdOptStr = (cmdOptStr, splitChar = ' ') => Array.isArray(cmdOptStr) ? cmdOptStr.join(splitChar) : cmdOptStr;

  function trimstdout(stdout) {
    return stdout.split(/\r?\n/).map(v => v.trim()).filter(v => v).join('\n');
  }
  /**
   * exec wraper
   * @param {string} cmd some cmd
   * @param {object} cmdOpts some cmd opts
   * @param {object} execOpts some exec opts
   * @returns {Promise}
   * @sample
   * ```js
   * await exec(`git`,`--version`,execOpts) //correct
   * await exec(`git`,[`--version`],execOpts) //correct
   * await exec(`git --version`,execOpts) //correct
   * ```
   */


  const execWraper = (cmd, cmdOpts, execOpts) => new Promise((resolve, reject) => {
    // Assignment to function parameter 'execOpts'              no-param-reassign
    // desc: for exec(`git --version`],execOpts)
    if (!execOpts) {
      execOpts = cmdOpts;
      cmdOpts = cmd;
      cmd = '';
    }

    const option = cmdOptArr2cmdOptStr(cmdOpts); // desc: other yuyi to string
    // let { exec } = execOpts //eg:{exec}=require("child_process");
    // fix: exec is optional in execOpts

    const run = execOpts.exec ? execOpts.exec : node_child_process.exec;
    cmd = cmd ? `${cmd} ${option}` : `${option}`; // cmd=`${cmd} ${option}`.trimStart()
    // delete execOpts.exec; //desc:clean some property to keep execOpts as native
    // support exe opt : exec(cmd,execOpts,callback)
    // https://stackoverflow.com/questions/18894433/nodejs-child-process-working-directory

    run(`${cmd}`, execOpts, (e, stdout, stderr) => {
      // feat:fix unreadable zh code\with option.fixUnreadbleCode
      const {
        fixUnreadbleCode
      } = execOpts;

      if (fixUnreadbleCode) {
        const {
          iconvDesEncoding,
          iconvSrcEncoding
        } = execOpts; // fix: convert unreadble code only with code
        // fixUnreadbleCode=(code,charset="cp936")=>{return iconv.decode(err, charset)})
        // if (e) e = fixUnreadbleCode(e, iconvDesEncoding, iconvSrcEncoding)//del

        if (stdout) stdout = fixUnreadbleCode(stdout, iconvDesEncoding, iconvSrcEncoding);
        if (stderr) stderr = fixUnreadbleCode(stderr, iconvDesEncoding, iconvSrcEncoding); // console.log(e, stdout, stderr)
      } // feat: set reject err to be optional\nwhen execOpts.exitWhenErr=true


      if (e && execOpts.exitWhenErr) {
        reject(e);
      } // feat(core): trim stdout and stderr \ndo not trim when execOpts.noTrimOut=true


      if (!execOpts.noTrimOut) {
        stdout = trimstdout(stdout);
        stderr = trimstdout(stderr);
      } // case:reject std err and resolve std res
      // feat(core): set reject stderr to be optional in execOpts
      // reject when execOpts.rejectStderr=true


      if (execOpts.rejectStderr) {
        if (stderr) {
          reject(e);
        }

        resolve(stdout);
      } // case:resolve std err and res


      resolve({
        stdout,
        stderr
      });
    });
  });
  /* eslint-disable camelcase */


  const execOpts = {
    exec: node_child_process.exec
  };

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

  new JsonStream();

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
  /* eslint-disable no-shadow */


  async function pnpm(cmd, execOpts) {
    const {
      stdout
    } = await execWraper(cmd, execOpts);
    return stdout;
  }

  const {
    log
  } = console;

  async function main(options = {}) {
    const option = {
      pkgLoc: './pacakges/noop',
      pnpmCmd: 'pnpm add --filter',
      pkgSrcLoc: 'src',
      ...options
    };
    const {
      pkgLoc,
      pkgSrcLoc
    } = option;
    const libdir = getPackagesLocFromPath(pkgLoc);
    const libname = getLibNameFromPath(pkgLoc);
    log('[info] get file list at loc');
    log(`[info] loc:${pkgLoc}/${pkgSrcLoc} `);
    const filelist = getFilelist(`${pkgLoc}/${pkgSrcLoc}`); // log(filelist);

    log('[info] get nodejs built in module');
    const nodedeps = getNodeBuitInModule();
    log('[info] get dep list of out-lib at loc');
    const prs = filelist.map(async file => {
      const ph = new ParseHelp();
      ph.option.nodedeps = nodedeps;
      ph.option.ignoreComment = true;
      await ph.parse(file);
      return ph.outlibDeps; // return ph.inLibDeps
    });
    let deplist = await Promise.all(prs);
    deplist = [...new Set(deplist.flat(1))];
    log(deplist);
    let cmd;

    if (deplist && deplist.length > 0) {
      // log('[info] pnpm add dep of out-pkg at loc')
      // @ymc/add-pkg-dep-preset-pnpm
      // pnpm add -w {libdir}/{libname}
      // pnpm add --filter {libdir}/{libname}
      cmd = writeTpl(`${option.pnpmCmd} {libdir}/{libname} ${deplist.join(' ')}`, {
        libdir,
        libname
      });
      log(`[info] cmd:${cmd}`);
      await pnpm(cmd, execOpts);
    }
  }

  return main;

}));
