/**
  * extendFunction v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/* eslint-disable prefer-rest-params,func-names */

/* eslint-disable import/prefer-default-export */

/* eslint-disable new-cap */

/* eslint-disable max-len */
function bind(context) {
  // feat: change scope
  // 1. call func with Function.prototype.apply
  // 2. cache this to bind this to context
  // feat: passe cached args
  // 1. cache args
  // 2. concat args
  // feat: new constrcutor able
  // 1. use middle function temp
  // 2. set context prototype as its
  // 3. set temp instance as bound's prototype
  // feat:
  if (typeof this !== 'function') {
    throw new Error('this must be function');
  } // desc: cache this to self


  const self = this; // desc: cache args
  // 1. use Array.prototype.slice
  // 2. use Function.prototype.call
  // 3. use arguments
  // 4. call slice with arguments

  const {
    slice
  } = Array.prototype;
  const args = slice.apply(arguments, [1]);

  const temp = function () {};

  temp.prototype = self.prototype;

  const bound = function () {
    // desc: concat cache args
    // 1. use Array.prototype.concat
    // 2. use Array.prototype.slice
    // 3. use Function.prototype.apply
    // 4. use arguments
    // 5. contact cached args and arguments
    const bindedArgs = args.concat(Array.prototype.slice.apply(arguments, [0]));
    return self.apply(this instanceof temp ? this : context || window, bindedArgs);
  };

  bound.prototype = new temp();
  return bound;
} // refs:

exports.bind = bind;
