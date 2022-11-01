/**
  * classEs5Help v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
/* eslint-disable  no-use-before-define,no-unused-vars,prefer-rest-params */
function isFunction(s) {
  return typeof s === 'function'
}

/**
 * set class constructor (<=es5)
 * @param {function} cls
 * @param {()=>{}} constructor
 * @description
 * ```
 * cls.prototype.constructor = constructor;
 * ```
 * @sample
 * ```
 * //for itself
 * constructorClass(Github,Github)
 * ```
 */
function constructorClass(cls, constructor) {
  cls.prototype.constructor = constructor;
  // cls.prototype = {
  //   constructor: constructor,
  // };
}
/**
 * extend class (<=es5)
 * @param {function} cls
 * @param {string} name
 * @param {()=>{}} fun
 * @description
 * ```
 * set clss.prototype[name] = fun
 * ```
 */
function extendClass(cls, name, fun) {
  cls.prototype[name] = fun;
}

/**
 * mix class (<=es5)
 * @param {function} cls
 * @param {{[string]:function}} mix
 * @description
 * ```
 * set clss.prototype[name] = fun
 * ```
 * @sample
 * ```
 * mixClass(Github, RestApi.prototype);
 * ```
 */
function mixClass(cls, mix) {
  Object.keys(mix).forEach(name => {
    const fun = mix[name];
    if (isFunction(fun)) {
      cls.prototype[name] = fun;
    }
  });
}

// function inheritsClass(cls){}

/**
 * set class method alias
 * @param {function} cls
 * @param {string} method
 * @param {string|string[]} alias
 * @param {string|regexp} char
 * @param {boolean} force
 * @description
 * ```
 * set cls.prototype[alias] = cls.prototype[method]
 * ```
 */
function setClassMethodAlias(cls, method, alias, char = ',', force = false) {
  multiItemtoArray(alias, char).forEach(aname => {
    if (force || !cls.prototype[aname]) {
      cls.prototype[aname] = cls.prototype[method];
    }
  });
}

/**
 *
 * @param {string|string[]} s
 * @param {string|regexp} char
 * @returns
 */
function multiItemtoArray(s, char) {
  if (Array.isArray(s)) {
    return s
  }
  return s
    .split(char)
    .map(v => v.trim())
    .filter(v => v)
}

export { mixClass as MethodByMixer, constructorClass, extendClass, mixClass, constructorClass as setClassConstructor, extendClass as setClassMethod, setClassMethodAlias, mixClass as setClassMethodByMixer, constructorClass as setConstructor, extendClass as setMethod };
