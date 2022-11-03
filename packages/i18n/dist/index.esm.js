/**
  * i18n v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
/* eslint-disable no-use-before-define */
/**
 * is string and not empty
 * @param {*} s
 * @returns
 */
function validString(s) {
  return isString(s) && !isEmpty(s)
}
function isString(s) {
  return typeof s === 'string'
}
function isEmpty(s) {
  return s === '' || s === null || s === undefined
}
function isArray(s) {
  return Array.isArray(s)
}

/**
 *
 * @param {*} s
 * @returns
 * @description
 * ```
 * it is no safe--no perform, please only use in i18n.set
 * ```
 */
function isObject(s) {
  return typeof s === 'object'
}

/**
 * has value but not false then true
 * @param {string} s
 * @returns {boolean}
 * @sample
 * ```
 * truthly(option.noOnce) //option={} -> true
 * truthly(option.noOnce) //option={noOnce} -> true
 * //todo
 * enable(option.once) //--once=true --no-once ////if undefiend , isEmpty , or s!=false then true
 * //if undefiend , isEmpty , or s!=false then true
 * ```
 * @description
 * ```
 * when true?
 * s!=false
 * - and has value
 * - has value ?
 * - warn: here turn-on undefined and empty
 * ```
 */
function truthly(s) {
  return s !== false
  // return !isDefine(s) || isEmpty(s) || s; eq ? s!=false
}

/**
 * @description
 * ```
 * why use?
 * - [x] name alias
 * - [x] optional dup
 * ```
 */
class NameAlias {
  constructor() {
    this.aliasMap = {};
    this.option = {};
  }

  /**
   *
   * @param {string} name
   * @returns {aliasMapItem}
   */
  getAlias(name) {
    return this.aliasMap[name]
  }

  /**
   * check alias in aliasMap
   * @param {string} alias
   * @returns {boolean}
   */
  hasAlias(alias) {
    const { aliasMap } = this;
    // console.log(aliasMap);
    const list = Object.keys(aliasMap);

    let res = false;
    if (list.length === 0) {
      res = false;
    } else {
      res = list.some(name => {
        const db = aliasMap[name];
        return db.includes(alias)
      });
    }
    return res
  }

  /**
   *
   * @param {string} name
   * @returns {this}
   */
  iniAlias(name) {
    const { aliasMap } = this;
    if (!aliasMap[name]) {
      aliasMap[name] = [];
    }
    return this
  }

  /**
   *
   * @param {string} name
   * @param {string|string[]|{[string]:string}} alias
   * @returns {this}
   */
  addAlias(name, alias) {
    const chain = this;
    const { option, aliasMap } = this;
    if (!validString(name)) return chain

    if (Array.isArray(alias)) {
      alias.forEach(item => {
        this.addAlias(name, item);
      });
    } else if (isString(alias)) {
      if (validString(alias)) {
        // if (truthly(option.once) && !this.hasAlias(alias)) {
        //   //dup
        //   this.iniAlias(name);
        //   aliasMap[name].push(alias);
        // } else {
        //   //not-dup
        //   this.iniAlias(name);
        //   aliasMap[name].push(alias);
        // }
        if (!(truthly(option.once) && this.hasAlias(alias))) {
          this.iniAlias(name);
          aliasMap[name].push(alias);
        }
      }
    } else if (isObject(alias)) {
      Object.keys(alias).forEach(item => {
        this.addAlias(name, item);
      });
    }
    return chain
  }

  /**
   * get name by alias
   * @param {string} alias
   * @returns {string}
   */
  getName(alias) {
    const { aliasMap } = this; // [{name:[alias1,alias2]}]
    const res = [];
    const list = Object.keys(aliasMap);
    // order-diff when foreach,map,filter ...
    // list.forEach((name) => {
    //   let db = aliasMap[name];
    //   if (db.includes(alias)) {
    //     res.push(name);
    //   }
    // });
    // alias in list
    if (this.hasAlias(alias)) {
      for (let index = 0; index < list.length; index += 1) {
        const name = list[index];
        const db = aliasMap[name];
        if (db.includes(alias)) {
          res.push(name);
        }
      }
    } else {
      res[0] = alias;
    }
    return res[0]
  }
}

/* eslint-disable no-param-reassign,prefer-const,no-unused-vars */
function iniObjValByKey(json, key, val) {
  if (json && json[key]) ; else {
    json[key] = val;
  }
}
function iniLangVal(data, language, val, express) {
  iniObjValByKey(data, language, val);
  // iniObjValByKey(data[language], express, val);
}
/**
 * @description
 * ```
 * why use?
 * -[x] i18n
 * -[x] no vendor dep for ymc
 * ```
 * @sample
 * ```
 * const i8n = new I18n()
 * i8n.lang('en')
 * i8n.lang('en')
 * ```
 */
class I18n extends NameAlias {
  constructor() {
    super();
    this.data = {};
    this.current = 'en';
    this.defaultLang = 'en';
  }

  /**
   * get or set current in data
   * @param {string} lang
   * @returns
   * @description
   * ```
   * please use iso 3166 (country or region) and iso 639(language)
   * refer 'https://www.iso.org/iso-3166-country-codes.html'
   * ```
   */
  lang(lang) {
    let context;
    // context = this.data; //bind lang to data.current
    context = this; // bind lang to this.current
    if (lang) {
      context.current = lang;
      return this
    }
    return context.current
  }

  /**
   * get value with key in current language
   * @param {string} express
   * @param {string} def
   * @returns
   * @description
   * ```
   * get value
   * if no exsits, set default when default value exsits
   * if no exsits, get in default lang
   * ```
   */
  translate(express, def) {
    let txt;
    // let language = this.lang();
    const { defaultLang } = this;
    txt = this.getName(express);

    // get
    let res;
    // res = this.data[language][express];//not rewrite here,please use it.set method
    if (validString(txt)) {
      res = this.set(txt);
    }

    // set default and get
    if (!validString(res) && validString(def)) {
      // this.data[language][express] = def;
      this.set(txt, def); // warn:update it when translate!!
      res = def;
    }
    // get in default lang
    if (!res && defaultLang) {
      const cacheLang = this.lang();
      this.lang(defaultLang);
      res = this.set(txt);
      this.lang(cacheLang);
    }
    return res
  }

  /**
   * alias for translate
   * @param  {...any} option
   * @returns
   */
  t(...option) {
    return this.translate(...option)
  }

  /**
   *
   * @param {string|array|object} txt
   * @param {string} def
   * @returns {string|this}
   * @sample
   * ```
   * it.set('perf','perform') //set-one  {en:{'perf':'perform'}}
   * it.set('perf') //get-one
   * it.set([['perf','perform'],['feat','feature']]) //set-many-by-array:1
   * it.set([{'perf':'perform'}]) //set-many-by-array:2
   * it.set({'perf':'perform'}) //set-many-by-object
   * it.set([{'perf':'perform'},['feat','feature']]) //set-many:mix
   * ```
   */
  set(express, def) {
    let txt = express;
    const chain = this;
    if (!txt) return chain // warn:chain here ,not undefined when no work.
    const language = this.lang();
    // // get-one
    // if (isString(express) && !def) {
    //   this.inilang();
    //   return this.data[language][express];
    // } else if (isString(express) && isString(def)) {
    //   this.inilang();
    //   // set-one
    //   this.data[language][express] = def;
    //   return this;
    // }

    if (isString(txt)) {
      txt = this.getName(txt);
      this.inilang();
      if (!def) {
        // get-one
        return this.data[language][txt]
      }
      if (isString(def)) {
        // set-one
        this.data[language][txt] = def;
        return this
      }
    }
    // set-many-by-array
    if (isArray(txt)) {
      txt.forEach(item => {
        if (isArray(item)) {
          const [key, val] = item;
          this.set(key, val);
          // this.data[language][item[0]]=item[1]
        } else if (isObject(item)) {
          // Object.keys(item).forEach((key) => {
          //   let val = item[key];
          //   this.set(key, val);
          // });
          this.set(item);
        }
      });
    } else if (isObject(txt)) {
      // console.log(`[info] set laguage for obj`);
      Object.keys(txt).forEach(key => {
        const val = txt[key];
        this.set(key, val);
      });
    }
    return this
  }

  inilang() {
    const language = this.lang();
    const { data } = this;
    iniLangVal(data, language, {});
    return this
  }
}

export { I18n as default };
