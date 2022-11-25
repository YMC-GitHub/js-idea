/**
  * moduleAlias v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node:fs')) :
  typeof define === 'function' && define.amd ? define(['exports', 'node:fs'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["module-alias"] = {}, global.node_fs));
})(this, (function (exports, node_fs) { 'use strict';

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

  /* eslint-disable no-unused-vars,no-continue */

  /* eslint-disable consistent-return */

  /**
   * module alias to babel-alias
   * @param {{alias}} cnf
   * @returns {{}}
   */
  function ma2babel(cnf, options = {}) {
    const option = {
      useRegexpPrefix: true,
      useRegexpSuffix: true,
      ...options
    };
    if (!cnf.alias) return;
    const {
      alias
    } = cnf;
    const keys = Object.keys(alias);
    const res = {};

    for (let index = 0; index < keys.length; index += 1) {
      let key = keys[index];
      key = key.trim();
      if (!key) continue;
      let val = alias[key];
      if (!val) continue; // add ^

      if (option.useRegexpPrefix) {
        key = key.replace(/^\^?/, '^');
      }

      if (option.useRegexpSuffix) {
        // add (.+)$
        key = key.replace(/\$?$/, '(.+)$'); // add \\1

        val = val.replace(/\\?1?$/, '\\1');
      }

      res[key] = val;
    }

    return res;
  }
  /**
   * module alias to eslint-alias
   * @param {{alias}} cnf
   * @returns {[]}
   */


  function ma2eslint(cnf, options = {}) {
    ({
      useRegexpPrefix: true,
      useRegexpSuffix: true,
      ...options
    });
    if (!cnf.alias) return;
    const {
      alias
    } = cnf;
    const keys = Object.keys(alias);
    let res = {};

    for (let index = 0; index < keys.length; index += 1) {
      let key = keys[index];
      key = key.trim();
      if (!key) continue;
      const val = alias[key];
      if (!val) continue;
      res[key] = [key, val];
    }

    res = Object.values(res); // res = { map: res }

    return res;
  }
  /**
   * module alias to jest-alias
   * @param {{alias}} cnf
   * @returns {{}}
   */


  function ma2jest(cnf, options = {}) {
    const option = {
      useRegexpPrefix: true,
      useRegexpSuffix: true,
      ...options
    };
    if (!cnf.alias) return;
    const {
      alias
    } = cnf;
    const keys = Object.keys(alias);
    const res = {};

    for (let index = 0; index < keys.length; index += 1) {
      let key = keys[index];
      key = key.trim();
      if (!key) continue;
      let val = alias[key];
      if (!val) continue; //    "^@ymc/(.*?.?(js|vue)?|)$": "<rootDir>/packages/$1",
      // add ^

      if (option.useRegexpPrefix) {
        key = key.replace(/^\^?/, '^');
        val = val.replace(/^(\.\/)?/, '<rootDir>/');
      }

      if (option.useRegexpSuffix) {
        // add (.*?.?(js|vue)?|)$
        key = key.replace(/\$?$/, '(.*?.?(js|vue)?|)$'); // add $1

        val = val.replace(/\\?1?$/, '$1');
      }

      res[key] = val;
    }

    return res;
  }
  /**
   * module alias to jsconfig-alias
   * @param {{alias}} cnf
   * @returns {{}}
   */


  function ma2jsconfig(cnf, options = {}) {
    const option = {
      useRegexpPrefix: true,
      useRegexpSuffix: true,
      ...options
    };
    if (!cnf.alias) return;
    const {
      alias
    } = cnf;
    const keys = Object.keys(alias);
    const res = {};

    for (let index = 0; index < keys.length; index += 1) {
      let key = keys[index];
      key = key.trim();
      if (!key) continue;
      let val = alias[key];
      if (!val) continue; // "@ymc/*": ["packages/*"],
      // add ^
      // if (option.useRegexpPrefix) {
      // }

      if (option.useRegexpSuffix) {
        // add /*?
        // key = key.replace(/(\/|\*)?$/, '/*')
        // // add /*
        // val = val.replace(/(\/|\*)?$/, '/*')
        // please add *  !!!
        key = key.replace(/(\*)?$/, '*'); // add *

        val = val.replace(/(\*)?$/, '*');
      }

      res[key] = [val];
    }

    return res;
  }
  /**
   * module alias to vscode-setting-alias
   * @param {{alias}} cnf
   * @returns {{}}
   */


  function ma2vscodeconfig(cnf, options = {}) {
    const option = {
      useRegexpPrefix: true,
      useRegexpSuffix: true,
      ...options
    };
    if (!cnf.alias) return;
    const {
      alias
    } = cnf;
    const keys = Object.keys(alias);
    const res = {};

    for (let index = 0; index < keys.length; index += 1) {
      let key = keys[index];
      key = key.trim();
      if (!key) continue;
      let val = alias[key];
      if (!val) continue; // "@ymc/": "\${workspaceFolder}/packages",
      // add ^

      if (option.useRegexpPrefix) {
        // eslint-disable-next-line no-template-curly-in-string
        val = val.replace(/^(\.\/)?/, '${workspaceFolder}/');
      }

      res[key] = val;
    }

    return res;
  }

  /* eslint-disable no-unused-vars,max-len */

  function isOneOfValues(one, values) {
    return values.some(value => value === one);
  }
  /**
   * get or ini setting with namespace path
   * @param {{}} data
   * @param {string} ns
   * @param {{seq:string,val:unknown}} options
   * @returns {{}}
   */


  function setting(data = {}, ns = '', options = {}) {
    const option = {
      sep: '.',
      ...options
    };
    const {
      val,
      sep
    } = option;
    let p = data;
    const nsp = ns.split(sep);
    if (nsp.length <= 1) return p;
    const lastIndex = nsp.length - 1;
    const last = nsp[lastIndex];

    for (let index = 0; index < lastIndex; index += 1) {
      const key = nsp[index];
      if (!p[key]) p[key] = {}; // desc: ini p.key

      p = p[key]; // desc: put p to p.key
    } // ini the last key with val


    if (p && val !== undefined) {
      p[last] = val;
    }

    return p;
  }

  function hunmanJson(json, n = 4) {
    return JSON.stringify(json, null, n);
  }
  /**
   * get module alisa config in babel.config.json
   * @param {{}} cnf
   * @returns {{}}
   */


  function getModuleAliasInBabelConfig(cnf) {
    let res = {}; //   if (!cnf.plugins) cnf.plugins = [[]]

    const {
      plugins = [[]]
    } = cnf;

    for (let index = 0; index < plugins.length; index += 1) {
      const [name, opts] = plugins[index];

      if (name === 'babel-plugin-module-resolver') {
        res = opts;
        break;
      }
    }

    return res;
  }

  /* eslint-disable prefer-const */

  function setLikeTransformFunctions(oldOpts, ns, builtin) {
    let cache = oldOpts[ns];
    cache = cache ? [...new Set([...builtin, ...cache])] : builtin;
    oldOpts[ns] = cache;
  }

  function likeArr(obj) {
    let res = obj || [];
    return Array.isArray(res) ? res : [res];
  }

  function likeNoDot(ext) {
    return ext.map(v => v.replace(/^./, ''));
  }
  /**
   *
   * @param {{}} cnf
   * @param {{root:string[],alias:{},transformFunctions:string[]}} options
   * @returns
   */


  function setModuleAliasToBabelConfig(cnf, options) {
    if (!cnf.plugins) cnf.plugins = [];
    const {
      plugins = []
    } = cnf;
    let added = false;
    const builtinRoot = ['node_modules', './'];
    const builtinTransformFunctions = ['require', 'require.resolve', 'System.import', 'jest.genMockFromModule', 'jest.mock', 'jest.unmock', 'jest.doMock', 'jest.dontMock'];

    for (let index = 0; index < plugins.length; index += 1) {
      let [name, oldOpts] = plugins[index];

      if (name === 'babel-plugin-module-resolver') {
        if (!oldOpts) oldOpts = {};
        oldOpts = { ...oldOpts,
          ...options // transformFunctions: builtinTransformFunctions

        }; // let { transformFunctions } = oldOpts
        // transformFunctions = transformFunctions
        //     ? [...new Set([...builtinTransformFunctions, ...transformFunctions])]
        //     : builtinTransformFunctions
        // oldOpts.transformFunctions = transformFunctions

        setLikeTransformFunctions(oldOpts, 'transformFunctions', builtinTransformFunctions);
        setLikeTransformFunctions(oldOpts, 'root', builtinRoot);
        plugins[index] = [name, oldOpts];
        added = true;
        break;
      }
    }

    if (!added) {
      let nowOpts = { ...options
      };
      setLikeTransformFunctions(nowOpts, 'transformFunctions', builtinTransformFunctions);
      setLikeTransformFunctions(nowOpts, 'root', builtinRoot);
      plugins.push(['babel-plugin-module-resolver', nowOpts]);
    }

    return cnf;
  }
  /**
   *
   * @param {{}} cnf
   * @param {{map:[][],extensions:string[]}} alias
   * @returns
   */


  function setModuleAliasToEslintConfig(cnf, alias) {
    const builtinExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue'];
    let context;
    context = setting(cnf, 'settings.import/resolver.alias', {});
    context = context.alias; // set builtin to context

    setLikeTransformFunctions(context, 'extensions', builtinExtensions); // set options to context

    setLikeTransformFunctions(context, 'extensions', likeArr(alias.extensions)); // context = setting(cnf, 'settings.import/resolver.alias', { val: alias })
    // const { extensions = [] } = context
    // context.extensions = [...new Set([...extensions, ...builtinExtensions])]

    return cnf;
  }
  /**
   *
   * @param {{}} cnf
   * @param {{}} alias
   * @returns
   */


  function setModuleAliasToVscodeSettings(cnf, alias) {
    cnf['path-intellisense.mappings'] = alias;
    return cnf;
  }
  /**
   *
   * @param {{}} cnf
   * @param {{map:{},extensions:string[],root?:string}} alias
   * @returns
   */


  function setModuleAliasToJest(cnf, alias) {
    let builtinExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue'];
    builtinExtensions = likeNoDot(builtinExtensions); // cnf['moduleNameMapper'] = alias.moduleNameMapper
    // setLikeTransformFunctions(cnf, 'moduleFileExtensions', likeArr(alias.moduleFileExtensions))

    cnf.moduleNameMapper = alias.map;
    setLikeTransformFunctions(cnf, 'moduleFileExtensions', builtinExtensions);
    setLikeTransformFunctions(cnf, 'moduleFileExtensions', likeNoDot(likeArr(alias.extensions)));
    return cnf;
  }
  /**
   *
   * @param {{}} cnf
   * @param {{map:{},extensions:string[],root?:string}} alias
   * @returns
   */


  function setModuleAliasToJsconfig(cnf, alias) {
    let context = setting(cnf, 'compilerOptions');
    context = context.compilerOptions;
    context.paths = alias.map;

    if (alias.root) {
      context.baseUrl = alias.root;
    }

    return cnf;
  }

  /* eslint-disable no-unused-vars */

  class BabelbabelAliasHelp {
    constructor() {
      this.data = {};
    }
    /**
     * set the working directory for module resolve
     * @param {string} [cwd=''] the working directory setting
     * @description
     * ```
     * '' - the working directory is the one used for the resolver
     * 'babelrc' - look for the closest babelrc configuration based on the file to parse
     * 'packagejson' - look for the closest package.json based on the file to parse
     *
     * refs:
     * https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md#cwd
     * ```
     */


    cwd(cwd) {
      const {
        data
      } = this;
      if (!isOneOfValues(cwd, ['packagejson', 'babelrc', ''])) return this;

      switch (cwd) {
        case '':
          delete data.cwd;
          break;

        default:
          data.cwd = cwd;
          break;
      }

      return this;
    }
    /**
     * add a directory to resolve modules
     * @param {string} dir a directory to resolve modules
     */


    root(dir) {
      if (!dir) return this;
      let {
        data: {
          root
        }
      } = this;
      if (!root) root = [];

      if (!isOneOfValues(dir, root)) {
        root.push(dir);
        this.data.root = root;
      }

      return this;
    }
    /**
     * add a alias
     * @param {string} src from where
     * @param {string} des to where
     * @param {string} desc the description of a alias
     */


    alias(src, des, desc) {
      if (!src) return this;
      if (!des) return this; // get and ini alias map

      let {
        data: {
          alias
        }
      } = this;
      if (!alias) alias = {}; // add,put,del support

      alias[src] = des; // log desc

      this.data.alias = alias;
      return this;
    }

  }

  exports.BabelbabelAliasDefineEng = BabelbabelAliasHelp;
  exports.getModuleAliasInBabelConfig = getModuleAliasInBabelConfig;
  exports.hunmanJson = hunmanJson;
  exports.jsonstream = jsonstream;
  exports.ma2babel = ma2babel;
  exports.ma2eslint = ma2eslint;
  exports.ma2jest = ma2jest;
  exports.ma2jsconfig = ma2jsconfig;
  exports.ma2tsconfig = ma2jsconfig;
  exports.ma2vscodeconfig = ma2vscodeconfig;
  exports.setModuleAliasToBabelConfig = setModuleAliasToBabelConfig;
  exports.setModuleAliasToEslintConfig = setModuleAliasToEslintConfig;
  exports.setModuleAliasToJest = setModuleAliasToJest;
  exports.setModuleAliasToJsconfig = setModuleAliasToJsconfig;
  exports.setModuleAliasToVscodeSettings = setModuleAliasToVscodeSettings;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
