/**
  * createEsmLoader v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

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

function satisfiesVersion(ve1, ve2) {
  // let cps = `=,>,<,`
  const cpsReg = /=|>|</;
  const matched = ve2.match(cpsReg);
  let cp;
  let v2;

  if (matched) {
    [cp] = matched;
    [, v2] = ve2.split(cpsReg);
  } else {
    v2 = ve2; // return compare(ve1, ve2) >= 0
  }

  if (cp === '<') {
    return compare(ve1, v2) === -1;
  }

  if (cp === '=') {
    return compare(ve1, v2) === 0;
  }

  if (cp === '>') {
    return compare(ve1, v2) === 1;
  }

  return compare(ve1, v2) >= 0;
}

/* eslint-disable func-names */
// to specify explicitly that we're
// short-circuiting, which is what this function does.

/**
 * cache a function -  set result.shortCircuit=true and run fn and pre-construt its result
 * @param {()=>{}} fn
 * @returns
 */

function shortCircuit(fn) {
  /**
   * @return {{shortCircuit:boolean}}
   */
  return async function (...args) {
    return {
      shortCircuit: true,
      ...(await fn(...args))
    };
  };
}
/* eslint-enable func-names */

/* eslint-disable  no-param-reassign */

/**
 * create an empty stack for keys
 * @param {string[]} keys
 * @returns {{}}
 */


function createStack(keys) {
  return keys.reduce((mem, key) => {
    mem[key] = [];
    return mem;
  }, {});
}
/* eslint-enable  no-param-reassign */
// # arr(obj)

/**
 * ensure an object is a *flat* array
 * @param {*} obj
 * @returns {[]}
 */


function ensureFlatArr(obj) {
  if (!obj) {
    return [];
  }

  if (!Array.isArray(obj)) {
    return [obj];
  }

  return obj.flat(Infinity);
} // # has(obj, prop)

/**
 * has own property
 * @param {{}} obj
 * @param {string} prop
 * @returns {boolean}
 */


function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
} // # noop()


function noop() {}

/**
 * normalize a loader definition
 * @param {loader} loader
 * @returns
 * @description
 * ```
 * ## task
 * - [x] string -> {loader:string,options:{}} //1.
 * - [x] {loader:string,options:{}} -> {loader:string,options:{}}
 * - [x] x -> {loader:string,options:{}}
 * - [x] {hooks:any,options:{}} -> {hooks:any,options:{}}
 * ```
 */

function normalize(loader) {
  //1
  if (typeof loader === 'string') {
    return {
      loader,
      options: {}
    };
  } //2


  if (hasOwnProperty(loader, 'loader')) {
    return {
      loader: loader.loader,
      options: { ...loader.options
      }
    };
  } //3


  if (!hasOwnProperty(loader, 'hooks')) {
    return {
      hooks: loader,
      options: {}
    };
  } //4


  return loader;
}

// https://github.com/sebamarynissen/create-esm-loader/blob/master/lib/create-loader.js
// compare node version

/* eslint-disable no-restricted-syntax,no-await-in-loop,class-methods-use-this */
// # Loader

const keys = ['resolve', 'format', 'fetch', 'transform'];

function createEmptyStack() {
  return createStack(keys);
}
/* eslint-disable no-async-promise-executor */


class Loader {
  // ## constructor(loaders, options)
  // The loader can be created in two ways: either by specifying a single
  // object containing { loaders, options }, or by specifing a loaders and
  // options object separately.
  constructor(loaders = {}, options = {}) {
    /* eslint-disable no-param-reassign */
    //idea: ressign loaders and options
    if (hasOwnProperty(loaders, 'loaders')) {
      ({
        loaders,
        options = {}
      } = loaders);
    }

    this.options = options;
    this.stack = null; //idea: loading
    //build-stack -> resolve-this

    const loading = new Promise(async resolve => {
      this.stack = await this.buildStack(loaders);
      resolve(this);
    }); //idea: ready
    // return-loading

    this.ready = () => loading;
    /* eslint-enable no-param-reassign */

  } // ## handleStack(id, resource, ctx, defaultFunction)
  // Loops all functions in the given stack and returns the first one that
  // returns something truthy.

  /**
   *
   * @param {string} id - one of reslove,format,fetch,translorm
   * @param {string} resource
   * @param {{}} ctx
   * @param {()=>any} defaultFunction
   * @returns
   */


  async handleStack(id, resource, ctx, defaultFunction) {
    // Our stack might still be building from the configuration objct, so
    // make sure to await it.

    /* eslint-disable no-restricted-syntax,no-await-in-loop */
    //idea:
    // get-fns,get-global-options
    // get-fn,get-fn-options,get-final-options
    // run-fn,return-fn-result-if-exists,run-default-fn-and-return

    /**@type fns */
    const fns = this.stack[id] || [];
    const baseOptions = { ...this.options
    };

    for (const {
      fn,
      options
    } of fns) {
      const finalOptions = { ...baseOptions,
        ...options,
        ...ctx
      };
      const result = await fn(resource, finalOptions);

      if (result) {
        return result;
      }
    }

    return defaultFunction(resource, ctx, defaultFunction);
    /* eslint-enable no-restricted-syntax,no-await-in-loop */
  } // ## hooks()
  // This function returns an object containing all Node.js loader hooks as
  // properties so that the loader entry file can re-export them. See #1.
  // Given that the api changed in v16.12.0, we'll inspect the current
  // process version and adapt accordingly.


  hooks() {
    // For backwards compatibility purposes, we will manually compose
    // `format()`, `fetch()` and `transform()` into a `load()` function.
    // idea: compose format,fetch,transform to load manually
    // get-resolve-hook,short-circuit
    // get-format-hook,get-fetch-hook
    // advance: cache args in it
    const hook = id => (...args) => this.handleStack(id, ...args);
    /**
     * @param {}
     * @returns {{url:string,format:string|null|undefined,shortCircuit:boolean|undefined}}
     */


    const resolve = shortCircuit(hook('resolve'));
    /**
     * @type {()=>Promise<{format:string|null|undefined}>}
     */

    const getFormat = hook('format');
    /**
     * @type {()=>Promise<{source:any}>}
     */

    const getSource = hook('fetch');
    /* eslint-disable no-restricted-syntax,no-await-in-loop */
    // Handling transformation is fundamentally different as we have to
    // chain results here.
    //idea:
    // get-fns-of-transform,get-global-options
    // get-fn,get-fn-options,get-final-options
    // run-fn,return-fn-result-if-exsits,run-default-fn-and-return

    /**
     *
     * @param {string} source
     * @param {{}} ctx
     * @param {()=>Promise} node
     * @returns {{source:string|unknow}|next}
     */

    const transformSource = async (source, ctx, node) => {
      const fns = this.stack.transform || [];
      const baseOptions = { ...this.options
      };
      let mem = source;
      let flag = true;

      for (const {
        fn,
        options
      } of fns) {
        const finalOptions = { ...baseOptions,
          ...options,
          ...ctx
        };
        const result = await fn(mem, finalOptions);

        if (result || typeof result === 'string') {
          flag = false;

          if (typeof result === 'string') {
            mem = result;
          } else {
            mem = result.source;
          }
        }
      } // run default fn


      if (flag) {
        return node(source, ctx, node);
      }

      return {
        source: mem
      };
    };
    /* eslint-enable no-restricted-syntax,no-await-in-loop */
    // Now compose the correct hooks based on the Node version we're
    // running.
    // semver.satisfies(process.version, '<16.12.0')


    if (satisfiesVersion(process.version, '<16.12.0')) {
      return {
        resolve,
        getFormat,
        getSource,
        transformSource
      };
    }
    /* eslint-disable no-restricted-syntax,no-await-in-loop,class-methods-use-this */

    /* eslint-disable no-shadow,no-unused-vars  */
    // If we reach this point, it means we're running on Node v16.12.0 or
    // higher, which uses the new approach. We only have to export a
    // `resolve` and `load` function here, but the difficulty is that the
    // `load()` function has to be composed manually!


    const load = shortCircuit(async (url, ctx, defaultLoad) => {
      // idea:
      // get-format -> get-source -> get transform
      // If the format was already specified by the resolve hook, we
      // won't try to fetch it again. Note that this functionality is
      // specific to v16.12.
      const grab = (obj = {}) => obj.format;

      let {
        format = await getFormat(url, ctx, noop).then(grab)
      } = ctx; // Mock the default `getSource` function. What's important here is
      // that if we the default getSource is used, we'll also set it as
      // default format!

      /**
       *
       * @param {string} url
       * @param {{}} ctx
       * @returns {{format:string}}
       */

      const defaultGetSource = async (url, ctx) => {
        const result = await defaultLoad(url, {
          format
        });

        if (!format) {
          format = result.format;
        }

        return result;
      };

      const {
        source
      } = await getSource(url, ctx, defaultGetSource); // At last transform.

      const defaultTransform = source => ({
        source
      });

      const transform = await transformSource(source, {
        url,
        format
      }, defaultTransform);
      return {
        format,
        source: transform.source
      };
    });
    /* eslint-enable no-shadow,no-unused-vars  */

    return {
      resolve,
      load
    };
  } // ## buildStack(config)
  // The function that will build an object containing the function stacks
  // for each loader hook based on the given hooks configuration.


  async buildStack(config) {
    // Ensure that the hooks that were specified are an actual flat array.
    const hooks = ensureFlatArr(config).flat(Infinity); // Build up our stack now.

    const wait = [];
    const stack = createEmptyStack();

    for (const obj of hooks) {
      // Make sure to get a normalized definition.
      const def = normalize(obj); // If the hook that was specified is a string, it's an es module
      // that we'll have to import first. Note that we are going to do
      // the loading *in parallel*.

      if (typeof def.loader === 'string') {
        // Create a dummy stack so that we reserve space for the
        // dynamically loaded loaders.
        const dummy = createEmptyStack();

        for (const key of keys) {
          const hook = stack[key];
          hook.push(dummy[key]);
        } // Now start loading.
        //import module  -> to-loader-definition -> normailize-definition


        wait.push((async () => {
          const module = await (function (t) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(t)); }); })(def.loader);
          const normalized = normalize({
            hooks: module.default,
            options: def.options
          });
          this.fill(normalized, dummy);
        })());
        continue;
        /* eslint-disable-line no-continue */
      } else {
        this.fill(def, stack);
      }
    } // Await everything that's still being loaded. Once that is done we'll
    // need to flatten everything in the stack again as the dynamically
    // loaded configurations might be arrays as well.
    // idea: promise-all-wait -> flatten-stack-each-key


    await Promise.all(wait);

    for (const key of keys) {
      stack[key] = stack[key].flat(Infinity);
    }

    return stack;
  }
  /**
   * fill loader to stack
   * @param {{hooks:{[string]:[()=>{}]},options:{}}} loader
   * @param {{[string]:[()=>{}]}} stack
   */


  fill(loader, stack) {
    // get hooks and options from loader,
    // get stack hook by key for each key
    // get loader hooks by key
    // stack-hook add handle and options for each loader-hook
    // hook exp = {fn,option}
    const {
      hooks,
      options
    } = loader;

    for (const key of keys) {
      const hook = stack[key];
      const fns = ensureFlatArr(hooks[key]);

      for (const fn of fns) {
        hook.push({
          fn,
          options
        });
      }
    }
  }

}

/**
 * create loaders with config
 * @param  {...any} args
 * @returns
 */

async function createLoader(...args) {
  const loader = await new Loader(...args).ready();
  return loader.hooks();
}

module.exports = createLoader;
