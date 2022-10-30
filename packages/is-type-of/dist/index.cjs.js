/**
  * isTypeOf v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

// import {kindOf,kindOfTest,typeOfTest} from "@ymc/kind-of";
const {
  toString
} = Object.prototype;
const {
  getPrototypeOf
} = Object;
/* eslint-disable  no-return-assign,no-param-reassign */

/**
 * get kind of thing
 * @param {*} thing
 * @returns {string}
 * @description
 * ```
 * ## good ?
 * - [x] cache result
 * - [x] zero middle var with iifn
 * ```
 */

const kindOf = (cache => thing => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));
/* eslint-enable  no-return-assign,no-param-reassign */

/**
 *
 * @param {string} type
 * @description
 * ```
 * idea:to-lowercase -> kind-of -> eq-type
 * ```
 */


const kindOfTest = type => thing => kindOf(thing) === type.toLowerCase();
/* eslint-disable  valid-typeof */

/**
 *
 * @param {*} type
 * @description
 * ```
 * idea:type-of -> eq-type
 * ```
 */


const typeOfTest = type => thing => typeof thing === type;
/* eslint-enable  valid-typeof */
// idea:pkg-design
// kindof -> is


const {
  isArray
} = Array;
/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */

const isUndefined = typeOfTest('undefined');
/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */

const isString = typeOfTest('string');
/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */

const isFunction = typeOfTest('function');
/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */

const isNumber = typeOfTest('number');
/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */

const isObject = thing => thing !== null && typeof thing === 'object';
/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */


const isBoolean = thing => thing === true || thing === false;
/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */


function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */


const isArrayBuffer = kindOfTest('ArrayBuffer');
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */

function isArrayBufferView(val) {
  let result;

  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }

  return result;
}
/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */


const isPlainObject = val => {
  if (kindOf(val) !== 'object') {
    return false;
  }

  const prototype = getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
};
/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */


const isDate = kindOfTest('Date');
/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */

const isFile = kindOfTest('File');
/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */

const isBlob = kindOfTest('Blob');
/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */

const isFileList = kindOfTest('FileList');
/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */

const isStream = val => isObject(val) && isFunction(val.pipe);
/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */


const isFormData = thing => {
  const pattern = '[object FormData]';
  return thing && (typeof FormData === 'function' && thing instanceof FormData || toString.call(thing) === pattern || isFunction(thing.toString) && thing.toString() === pattern);
};
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */


const isURLSearchParams = kindOfTest('URLSearchParams');
/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */

const isRegExp = kindOfTest('RegExp');
/** eslint-disable func-names */

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */

const isTypedArray = (TypedArray => thing => TypedArray && thing instanceof TypedArray)(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));
/** eslint-enable func-names */

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */


const isHTMLForm = kindOfTest('HTMLFormElement');
var index = {
  kindOf,
  kindOfTest,
  typeOfTest,
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  isHTMLForm
};

module.exports = index;
