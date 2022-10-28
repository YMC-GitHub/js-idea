/**
  * cliParam v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
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
    return s
        .replace(/(?:^\w|[A-Z_-]|\b\w)/g, (word, index) => {
            let res = '';
            // log(word, index); //desc: for debug
            // feat: replace multi - or _ to one space
            res = word.replace(/[-_]+/g, ' ');
            // feat: add space to the char that is uppercase and is not the first index
            res = index !== 0 ? res.replace(/[A-Z]/, ' $&') : res;
            // feat: the first char to upper ,other lowercase
            return index === 0 ? res.toUpperCase() : res.toLowerCase()
        })
        .replace(/\s+/g, ' ')
}

function camelize(s) {
    return humanize(s)
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase()))
        .replace(/\s+/g, '')
}

/* eslint-disable no-unused-vars */

// const { log } = console;

/** @typedef {{linkKeyAndVal:string,span:string}} pathParamTransferOption */

/** @typedef {{noAutoCamelize?:boolean,slim?:boolean,mode?:string,modeStyle:string}} getBuiltinFlagsOption */ /* eslint-disable-line  max-len */
/** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} camelizeFlagsOption */
/** @typedef {{noAutoCamelize?:boolean,slim?:boolean}} likeCamelizeFlagsOption */

/** @typedef {{name:string,type:string,value:string|boolean,desc:string}} cliParam */
/** @typedef {string} cliArgsStringExp */
/** @typedef {string} httpQueryStringExp */
/** @typedef {string} swithOptionStringExp */
/** @typedef {object|cliArgsStringExp|httpQueryStringExp|swithOptionStringExp} getValFromParamResult */ /* eslint-disable-line  max-len */

/**
 * get param-string from param-json
 * @param {{[string]:string}} json
 * @param {{modeStyle:string}} options
 * @returns {string}
 */
function paramJsonToString(json, options) {
  const option = {
    modeStyle: 'cli',
    ...options
  };
  let res = '';
  // param json to cli string exp
  if (option.mode === 'string' && option.modeStyle === 'cli') {
    res = Object.keys(json)
      .map(v => {
        if (v.length > 1) {
          return `--${v}=${json[v]}`
        }
        return `-${v}=${json[v]}`
      })
      .join(' ');
  }
  // param json to httpquery string exp
  if (option.mode === 'string' && option.modeStyle === 'httpquery') {
    res = Object.keys(json)
      .map(v => `${v}=${json[v]}`)
      .join('&');
  }
  // param json to swithoption string exp
  if (option.mode === 'string' && option.modeStyle === 'swithoption') {
    res = Object.keys(json)
      .map(v => `${v}=${json[v]}`)
      .join(';');
  }
  return res
}
/**
 * get value from param-json
 * @param {cliParam[]} param
 * @param {getBuiltinFlagsOption} options
 * @returns {getValFromParamResult}
 */
function getValFromParam(param, options = {}) {
  let res = {};
  const list = Object.keys(param).map(k => param[k]);
  const option = {
    slim: true,
    modeStyle: 'cli',
    ...options
  };
  if (option.mode === 'string') {
    option.slim = true;
  }
  for (let index = 0; index < list.length; index += 1) {
    const v = list[index];

    const { name, type, value, desc } = v;
    const [s, l] = name.split(/,/).map(i => i.trim().replace(/^-*/gi, ''));
    // 'hasLong' is assigned a value but never used
    const thelong = s.length > 1 ? s : l;

    // desc: set value for the long name
    if (thelong) {
      // feat: auto camelize
      if (!option.noAutoCamelize) {
        // res[camelize(thelong.replace(/-+/gi, " "))] = value;
        res[thelong.camelize()] = value;
      }
      // feat: slim them
      /* eslint-disable no-continue */
      if (option.slim) continue
      // Unexpected use of continue statement
      /* eslint-enable no-continue */
      res[thelong] = value;
    }
    // desc: set value for the short name
    res[s] = value;
  }
  if (option.mode === 'string') {
    res = paramJsonToString(res, option);
  }
  return res
}

/**
 * camelize param-json - nano-parser-flags
 * @param {object} flags
 * @param {camelizeFlagsOption} options
 * @returns
 */
function camelizeFlags(flags = {}, options = {}) {
  // let res = {}
  const option = {
    slim: true,
    ...options
  };
  if (option.noAutoCamelize) return flags
  Object.keys(flags).forEach(k => {
    const ck = camelize(k);
    // res[ck]=flags[k]
    if (ck !== k) {
      flags[ck] = flags[k]; // eslint-disable-line no-param-reassign
      // Assignment to property of function parameter
      if (option.slim) {
        delete flags[k]; // eslint-disable-line no-param-reassign
        // Assignment to property of function parameter
      }
    }
  });
  return flags
}

function getBuiltinConfig(param, options = {}) {
  return getValFromParam(param, options)
}
function getCliFlags(flags, options = {}) {
  let cliFlags;
  const { entrys } = options;
  if (flags.flags || (entrys && entrys.notOnlyFlags)) {
    cliFlags = flags.flags;
  } else {
    cliFlags = flags;
  }
  return camelizeFlags(cliFlags, options)
}

export { camelizeFlags, getBuiltinConfig, getCliFlags, getValFromParam, paramJsonToString };
