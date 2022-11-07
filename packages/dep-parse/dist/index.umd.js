/**
  * depParse v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('node:fs')) :
  typeof define === 'function' && define.amd ? define(['node:fs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["dep-parse"] = factory(global.node_fs));
})(this, (function (node_fs) { 'use strict';

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
   * mock node.js path.dirname
   * @param {string} wkd
   * @returns
   */
  function dirname(wkd, sep = '/') {
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
  } // join.sep = '/'

  /* eslint-disable prefer-const,no-unused-vars */
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
  } // @ymc/del-macthed-line

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


      let abs = join(dirname(fileloc), dep); // \ to /

      abs = abs.replace(/\\/gi, '/');
      return abs;
    });
    return localdep;
  } // @ymc/dep-parse,@ymc/dep-tree

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

  return ParseHelp;

}));
