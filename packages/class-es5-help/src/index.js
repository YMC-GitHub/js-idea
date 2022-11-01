/* eslint-disable  no-use-before-define,no-unused-vars,prefer-rest-params */
function isFunction(s) {
  return typeof s === 'function'
}
const { isArray } = Array

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
  cls.prototype.constructor = constructor
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
  cls.prototype[name] = fun
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
    const fun = mix[name]
    if (isFunction(fun)) {
      cls.prototype[name] = fun
    }
  })
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(
    b,
    (val, key) => {
      if (thisArg && isFunction(val)) {
        a[key] = bind(val, thisArg)
      } else {
        a[key] = val
      }
    },
    { allOwnKeys }
  )
  return a
}
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {void}
 */
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return
  }

  let i
  let l

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /* eslint no-param-reassign:0 */
    obj = [obj]
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i += 1) {
      fn.call(null, obj[i], i, obj)
    }
  } else {
    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj)
    const len = keys.length
    let key

    for (i = 0; i < len; i += 1) {
      key = keys[i]
      fn.call(null, obj[key], key, obj)
    }
  }
}
/**
 * bind fn to a ctx
 * @param {*} fn
 * @param {*} thisArg
 * @returns
 */
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments)
  }
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
      cls.prototype[aname] = cls.prototype[method]
    }
  })
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
// export default
export {
  constructorClass,
  constructorClass as setClassConstructor,
  constructorClass as setConstructor,
  extendClass,
  extendClass as setClassMethod,
  extendClass as setMethod,
  mixClass,
  mixClass as setClassMethodByMixer,
  mixClass as MethodByMixer,
  setClassMethodAlias
}
