'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// @ymc/promise-all # @ymc/limit-all-promise
// @ymc/limit-async-handle

/* eslint-disable no-underscore-dangle */
const {
  log
} = console;
/**
 * @desciption
 * ```
 * ## why use?
 * - [x] limit a handle with limit max
 * - [x] run task with limit max
 * ```
 */

class LimitAsyncHandle {
  constructor(max) {
    this.init(max);
  }

  init(max) {
    this._max = max;
    this._count = 0;
    this._taskQueue = [];
    this._debug = false;
    this._cb = null;
    return this;
  }
  /**
   * call handle - caller - passed args to it
   * @param {()=>Promise<unknown>} handle
   * @param {*} args
   * @returns {Promise<unknown>} return a new promise
   * @description
   * ```
   * ## idea
   * - [x] limit a handle by max
   * ```
   * @sample
   * ```
   * if._max=3
   * function get (url, param){lf.call(equest.get, url, param)}
   * await get(url,param)
   * ```
   */


  call(handle, ...args) {
    return new Promise((resolve, reject) => {
      const task = this._createTask(handle, args, resolve, reject);

      if (this._count >= this._max) {
        // console.log('count >= max, push a task to queue')
        this._taskQueue.push(task);
      } else {
        task();
      }
    });
  }
  /**
   * create a task
   * @param {()=>{}} handle
   * @param {*} args
   * @param resolve
   * @param reject
   * @returns {()=>{}}
   * @private
   */


  _createTask(handle, args, resolve, reject) {
    return () => {
      handle(...args).then(resolve).catch(reject).finally(() => {
        this._next();
      });

      this._nextTick();
    };
  }

  _next() {
    // next in final
    this._count -= 1; // Unary operator '--' used                  no-plusplus

    if (this._taskQueue.length) {
      // console.log('a task run over, pop a task to run')
      const task = this._taskQueue.shift();

      task();
    } else {
      if (this._debug) {
        log('task count = ', this._count);
      }

      if (this._cb) {
        this._cb();
      }
    }
  }

  _nextTick() {
    this._count += 1; // Unary operator '++' used                  no-plusplus

    if (this._debug) {
      log('task count = ', this._count);
    }
  }

}

const limitAsyncHandle = new LimitAsyncHandle();

exports.LimitAsyncHandle = LimitAsyncHandle;
exports.limitAsyncHandle = limitAsyncHandle;
