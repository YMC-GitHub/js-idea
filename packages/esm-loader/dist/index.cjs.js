/**
  * esmLoader v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var node_path = require('node:path');
var node_url = require('node:url');
var node_fs = require('node:fs');

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
  * compareVersion v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */

/**
 * split version expression to flat array - version expression = version + tail
 * @param {boolean} flag
 * @param {string} verExp
 * @returns {string[]}
 * @sample
 * ```
 * split(true,`1.0.0-alpha.2`)// => ['1','0','0','alpha','2']
 * split(true,`1.0.0-alpha`)// => ['1','0','0','alpha']
 * split(false,`1.0.0`)// => ['1','0','0']
 * ```
 */
function split(flag, verExp) {
  const input = `${verExp}`;
  let result = [];

  if (flag) {
    // get ver and tail
    let tail = input.split('-')[1];
    const version = input.split('-')[0]; // get result

    result = version.split('.');
    tail = tail.split('.');
    result = result.concat(tail);
  } else {
    result = input.split('.');
  }

  return result;
}
/* eslint-disable radix */

/**
 * str to num
 * @param {string[]} arr
 * @returns {[number & string][]}
 * @sample
 * ```
 * convertToNumber(['1','0','0'])// [1,0,0]
 * convertToNumber(['1','0','0','alpha'])// [1,0,0,'alpha']
 * ```
 */


function convertToNumber(arr) {
  return arr.map(el => Number.isNaN(el) ? el : parseInt(el));
} // https://github.com/leohihimax/node-version-compare/blob/master/index.js

/**
 * compare version - result -1 lt, 0 eq, 1 gt
 * @param {string|number} ve1
 * @param {string|number} ve2
 * @returns {number}
 * @sample
 * ```
 * compare('1.0.0-beta.2','1.0.0')//-1
 * compare('1.0.0','1.0.0')//0
 * compare('1.0.0','1.0.0-beta.2')//1
 * ```
 */


function compare(ve1, ve2) {
  // number to string
  const v1 = `${ve1}`;
  const v2 = `${ve2}`; // has - char

  const flag1 = v1.indexOf('-') > -1;
  const flag2 = v2.indexOf('-') > -1; //

  let arr1 = split(flag1, v1);
  let arr2 = split(flag2, v2);
  arr1 = convertToNumber(arr1);
  arr2 = convertToNumber(arr2); // get max len

  const len = Math.max(arr1.length, arr2.length);

  for (let i = 0; i < len; i += 1) {
    // 1.0.0 > 1.0.0-beta.2
    // case: with tail and the val of index x one undefined
    if (i === 3 && (arr1[i] === undefined || arr2[i] === undefined)) {
      if (arr1[i] === undefined && Number.isNaN(arr2[i])) {
        return 1;
      }

      if (Number.isNaN(arr1[i]) && arr2[i] === undefined) {
        return -1;
      }
    } // case: the val of index x one undefined


    if (arr1[i] === undefined) {
      return -1;
    }

    if (arr2[i] === undefined) {
      return 1;
    } // case: the val of index x both defined


    if (arr1[i] > arr2[i]) {
      return 1;
    }

    if (arr1[i] < arr2[i]) {
      return -1;
    }
  }

  return 0;
}

/**
 * read .json file sync
 * @param {string} loc
 * @param {{}|[]} def
 * @returns {{}|[]}
 */

function readJsonSync(loc, def = {}) {
  let res;

  try {
    res = node_fs.readFileSync(loc);
    res = JSON.parse(res);
  } catch (error) {
    res = def;
  }

  return res;
}

/**
 * load alias from file
 * @param {string} name
 * @returns {{}}
 */

function loadAlias(name = 'module-alias.json') {
  // return jsonstream.init(name).read({})
  // std 1.2 get alias map
  const data = readJsonSync(name, {});
  return data;
}

/* eslint-disable  no-return-assign */

/**
 * replace alias - update url with alias map
 * @param {string} url
 * @param {{}} options
 * @returns {string}
 */

function replaceAlias(url, options) {
  const map = resloveAlias(options);
  const aliaskeys = Object.keys(map);

  for (let index = 0; index < aliaskeys.length; index += 1) {
    const aliaskey = aliaskeys[index];
    const alias = map[aliaskey]; // if(option.resolve){
    //     alias=option.resolve(alias)
    // }

    if (url.startsWith(aliaskey)) {
      const reg = new RegExp(`^${aliaskey}`);
      const name = url.replace(reg, ''); // url = `${alias}${name}`;

      url = `${alias}/${name}`; // url = url.replace(/\//gi, pathSep);
      // url = url.replace(/\\\\/gi, pathSep);

      url = url.replace(/\\/gi, '/'); // log(`[info] get url by url.hrel - URL`)
      // // url = new URL(url).href;
      // log(new URL(url).href)
      // fix: file url protocol warn in window
      // Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only file and data URLs are supported by the default ESM loader. On Windows, absolute paths must be valid file:// URLs. Received protocol 'h:'

      url = `file:///${url}`; // console.log(new URL(url));
      // log(`[info] alias url ${url}`);
    }
  }

  return url;
}
/**
 * reslove alias to root dir
 * @param {{}} data
 * @returns {{}}
 */


function resloveAlias(data) {
  // std 1.1 get root path
  const root = node_path.resolve(process.cwd(), '.');
  const {
    alias = {}
  } = data; // std 1.3 replace <root> expression

  Object.keys(alias).forEach(k => {
    const val = alias[k]; // <root> -> .

    alias[k] = replaceRootExp(val); // ./ -> abs

    alias[k] = node_path.resolve(root, alias[k]);
  });
  return alias;
}
/**
 * replace root expression to string
 * @param {string} s
 * @param {string} rootvalue
 * @param {regexp} rootreg
 * @returns {string}
 */


function replaceRootExp(s, rootvalue = '.', rootreg = /^<root>/i) {
  return s.replace(rootreg, rootvalue);
}

/* eslint-disable no-unused-vars,prefer-const */
const {
  log
} = console;
const aliasmap = loadAlias();
const fileProtocol = 'file://';
const supportsNodePrefix = compare(process.version, '14.13.1') >= 0 || compare(process.version, '12.20.0') >= 0;

function debug(msg) {
  if (debug.enable) {
    log(msg);
  }
}

debug.enable = false;
async function resolve(specifier, context, next, recursiveCall) {
  debug('[info] compact node lib expression'); // feat: compact node lib expression
  // desc: del node lib prefix
  // Added in v12.20.0
  // https://nodejs.org/api/esm.html#esm_node_imports

  if (!supportsNodePrefix && specifier.startsWith('node:')) {
    specifier = specifier.slice(5);
  } // console.log(specifier);


  debug('[info] reslove alias'); // feat: reslove alias
  // todo: extract to esm-loader-alias or esm-reslover-alias
  // const aliasmap = await loadAlias()

  specifier = replaceAlias(specifier, aliasmap); // log(`[info] info url ${specifier}`);
  // log(specifier);

  debug('[info] reslove dirs'); // feat: support reslove diretory
  // If directory, can be index.js, index.ts, etc.

  if (specifier.endsWith('/')) {
    return await tryDirectory(specifier, context, next);
  } // todo: support reslove ts
  // const isPath = specifier.startsWith(fileProtocol) || isPathPattern.test(specifier)
  // if (
  //     tsconfigPathsMatcher &&
  //     !isPath && // bare specifier
  //     !context.parentURL?.includes("/node_modules/")
  // ) {
  //     const possiblePaths = tsconfigPathsMatcher(specifier);
  //     for (const possiblePath of possiblePaths) {
  //         try {
  //             return await resolve(
  //                 pathToFileURL(possiblePath).toString(),
  //                 context,
  //                 defaultResolve
  //             );
  //         } catch {}
  //     }
  // }
  // /**
  //  * Typescript gives .ts, .cts, or .mts priority over actual .js, .cjs, or .mjs extensions
  //  */
  // if (tsExtensionsPattern.test(context.parentURL)) {
  //     const tsPath = resolveTsPath(specifier);
  //     if (tsPath) {
  //         try {
  //             return await resolve(tsPath, context, defaultResolve, true);
  //         } catch (error) {
  //             const { code } = error;
  //             if (
  //                 code !== "ERR_MODULE_NOT_FOUND" &&
  //                 code !== "ERR_PACKAGE_PATH_NOT_EXPORTED"
  //             ) {
  //                 throw error;
  //             }
  //         }
  //     }
  // }


  debug('[info] reslove next'); // feat:compose next, recursive resovle dirs and exts

  let resolved;

  try {
    resolved = await next(specifier, context, next);
  } catch (error) {
    if (error instanceof Error && !recursiveCall) {
      if (error.code === 'ERR_UNSUPPORTED_DIR_IMPORT') {
        debug('[info] recursive reslove dirs');
        return await tryDirectory(specifier, context, next);
      } // feat: support reslove extentions


      if (error.code === 'ERR_MODULE_NOT_FOUND') {
        debug('[info] recursive reslove exts');
        return await tryExtensions(specifier, context, next);
      }
    }

    throw error;
  } // desc: get format
  // feat: set format for json file


  if (resolved.url.endsWith('.json')) {
    return { ...resolved,
      format: 'json'
    };
  } // feat: set format for module , commonjs or other


  let {
    format
  } = resolved;

  if (resolved.url.startsWith(fileProtocol)) {
    // ??
    // format = getFormatFromExtension(resolved.url) ?? format
    const tmpformat = getFormatFromExtension(resolved.url);
    format = tmpformat || format;
  } // console.log(resolved, format);


  return { ...resolved,
    format
  };
}
/**
 * try exts - resolve exts
 * @param {string} url
 * @param {{}} context
 * @param {()=>{}} next
 * @returns
 */

async function tryExtensions(url, context, next) {
  // feat: use builtin exts
  const builtinExts = ['.js', '.json', '.ts', '.tsx', '.jsx']; // feat: use exts from context

  const {
    extensions = builtinExts
  } = context; // feat: use resolve from context (todo)
  // const {reslove} = context
  // feat: use next as resolve (todo)

  let res;
  let error;

  for (const extension of extensions) {
    try {
      debug(`[info] try reslove ${url + extension}`); // res= await resolve(url + extension, context, next, true)

      res = await next(url + extension, context, next);
      return res;
    } catch (_error) {
      if (error === undefined) {
        const {
          message
        } = _error;
        _error.message = _error.message.replace(`${extension}'`, "'");
        _error.stack = _error.stack.replace(message, _error.message);
        error = _error;
      }
    }
  }

  throw error;
}
/**
 * try dirs - resolve dirs
 * @param {string} url
 * @param {{}} context
 * @param {()=>{})} next
 * @returns
 */


async function tryDirectory(url, context, next) {
  let res; // feat: reslove packagejson index file in dirs

  res = await tryPackagejsonIndex(url, context, next);

  if (res) {
    return res;
  } // feat: reslove index file in dirs
  // feat: set default index to index


  let defalutIndex = 'index'; // feat: set default index to index.esm
  // defalutIndex = 'index.esm'

  const appendIndex = url.endsWith('/') ? defalutIndex : `/${defalutIndex}`;

  try {
    // feat: try extensions in diretory
    res = await tryExtensions(url + appendIndex, context, next);
    return res;
  } catch (error) {
    const {
      message
    } = error;
    error.message = error.message.replace(`${appendIndex.replace('/', node_path.sep)}'`, "'");
    error.stack = error.stack.replace(message, error.message);
    throw error;
  }
}
/**
 * try packagejson - resolve module,main,browser, in package.json
 * @param {string} url
 * @param {{}} context
 * @param {()=>{}} next
 * @returns
 */


async function tryPackagejsonIndex(url, context, next) {
  debug('[info] try resolve module,main,browser and other key in package.json');
  let res;
  const files = await getPackageIndexFiles(url, context);
  let error;
  if (files.length < 0) return res;

  for (const file of files) {
    try {
      // log(url + file);
      debug(`[info] try resolve ${url + file}`); // res = await resolve(url + file, context, next, true)

      res = await next(url + file, context, next);
      return res;
    } catch (_error) {
      if (error === undefined) {
        const {
          message
        } = _error;
        _error.message = _error.message.replace(`${file}'`, "'");
        _error.stack = _error.stack.replace(message, _error.message);
        error = _error;
      }

      throw error;
    }
  }
}
/**
 * get pacakgejson index files with order
 * @param {string} url
 * @param {{}} context
 * @param {()=>{}} defaultResolve
 * @returns
 */


async function getPackageIndexFiles(url, context, defaultResolve) {
  const {
    packagejsonIndexOrder = 'jsnext -> browser'
  } = context;
  const endswithsep = url.endsWith('/'); // feat: has package.json
  // let loc = resolvePath(
  //     context.parentURL.replace("file:///", ""),
  //     packagejsonloc
  // );
  // console.log(loc, context);
  // new URL(loc)
  // console.log(context);
  // console.log(text);
  // get packagejson loc

  let packagejsonname;
  let packagejsonloc;
  let packagejson;
  packagejsonname = 'package.json';
  packagejsonloc = endswithsep ? url + packagejsonname : `${url}/${packagejsonname}`; // packagejsonloc = resolvePath(
  //     context.parentURL.replace("file:///", ""),
  //     packagejsonloc
  // );
  // packagejsonloc = new URL(packagejsonloc);
  // if(!packagejsonloc.startsWith(fileProtocol)) return []

  packagejsonloc = packagejsonloc.replace('file:///', ''); // log(`[info] package.json loc : ${packagejsonloc}`);
  // get packagejson

  jsonstream.init(packagejsonloc);
  packagejson = await jsonstream.read({}); // textfileio.init(packagejsonloc);
  // let text = await textfileio.read();
  // get index in packagejson
  // feat: support order module -> main

  let files; // feat: set main first

  files = [packagejson.main, packagejson.module]; // feat: set module first\nwhen packagejson.type == "module"

  if (packagejson.type === 'module') {
    files = [packagejson.module, packagejson.main];
  } // feat: support order module -> main -> jsnext -> browser
  // files=getIndexByOrder("module -> main")
  // files = getIndexByOrder("module -> main -> jsnext -> browser");


  files = [...files, ...getIndexByOrder(packagejsonIndexOrder)];
  files = files.filter(v => v);

  if (!endswithsep) {
    files = files.map(v => `/${v}`);
  }

  return files;

  function getIndexByOrder(order = 'module -> main', sepreg = / ?-> ?/) {
    return order.split(sepreg).filter(v => v).map(v => packagejson[v]).filter(v => v);
  }
}
/**
 * esm loader
 * @param {*} url
 * @param {*} context
 * @param {*} defaultLoad
 * @returns
 * @desciption
 * ```
 * ## task
 * - [x] import .css,html,svg file as an esm module
 * ## idea
 * - [x] run custom loader
 * - [x] run defalut loader
 * ```
 */


async function load(url, context, defaultLoad) {
  const checkUrl = url.split('?')[0]; // Cutting the possible search parameters
  // console.log(parsePath(checkUrl));
  // let ext = extname(checkUrl);
  // if (!ext) {
  //     checkUrl = `${checkUrl}.js`;
  // }
  // feat: run custom load
  // feat: wrap text file esm module

  const txtExt = ['.md', '.css', '.html', '.htm', '.svg'];

  if (txtExt.some(ext => checkUrl.endsWith(ext))) {
    // console.log(url);
    return await wrapTextFileToEsmModule(url);
  } // if (!ext) {
  //     return defaultLoad(checkUrl, context, defaultLoad);
  // }
  // feat: run default load


  return defaultLoad(url, context, defaultLoad);
} // https://foxeyes.github.io/cv/pulse/custom_node_esm_loader.html

/**
 * wrap text file to es module
 * @param {*} url
 * @returns
 */

async function wrapTextFileToEsmModule(url) {
  // console.log(new URL(url))
  // const content = await readFile(new URL(url))
  textstream.init(new node_url.URL(url));
  const content = await textstream.read(''); // log(content)

  return {
    format: 'module',
    source: `export default ${JSON.stringify(content.toString())};`,
    shortCircuit: true
  };
}
/**
 * get format from path extension
 * @param {string|undefined} filePath
 * @returns
 */


function getFormatFromExtension(filePath) {
  const extension = node_path.extname(filePath);

  if (extension === '.mjs' || extension === '.mts') {
    return 'module';
  }

  if (extension === '.cjs' || extension === '.cts') {
    return 'commonjs';
  }
} // node --no-warnings --loader ./scr/lib/esm-loader.js packages/esm-loader-alias/src/index.js

exports.load = load;
exports.resolve = resolve;
