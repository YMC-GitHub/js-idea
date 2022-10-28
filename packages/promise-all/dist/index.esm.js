/**
  * promiseAll v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
/**
  * limitAsyncHandle v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
// @ymc/promise-all # @ymc/limit-all-promise
// @ymc/limit-async-handle

/* eslint-disable no-underscore-dangle */
const { log } = console;
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
    return this
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
    })
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
      handle(...args)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          this._next();
        });
      this._nextTick();
    }
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
new LimitAsyncHandle();

/**
  * kindOf v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
// @ymc/kind-of # @ymc/type-of
// @ymc/is-type # @ymc/is
const { toString } = Object.prototype;

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
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase()) //eslint-disable-line
  // Return statement should not contain assignment        no-return-assign
  // Assignment to property of function parameter 'cache' no-param-reassign
})(Object.create(null));

// @ymc/promise-all # @ymc/limit-all-promise

/* eslint-disable no-underscore-dangle,no-unused-vars */
// promise all promise with limit (idea 2)
/**
 *
 * @param {Promise[]} all
 * @param {number|undefined} max
 * @returns {Promise[]}
 */
function promiseAll(all, max) {
  return new Promise((resolve, reject) => {
    // 'reject' is defined but never used  no-unused-vars
    const num = max || all.length;
    const lah = new LimitAsyncHandle(num);

    const data = [];
    // limit max , create task , run task
    const storeHandleResult = i => {
      let promise = all[i];
      // feat: all is async functions
      if (kindOf(promise) === 'asyncfunction') {
        promise = promise();
      } else if (kindOf(promise) === 'function') {
        // feat: all is functions
        promise = Promise.resolve(promise());
      }
      return promise
        .then(
          res => {
            if (lah._debug) {
              data[i] = { index: i, data: res, state: 'ok' };
            } else {
              data[i] = res;
            }
          },
          error => {
            if (lah._debug) {
              data[i] = { index: i, state: 'no', error };
            } else {
              data[i] = error;
            }
          }
        )
        .finally(() => {
          // promise has been settled
          // if (!this._taskQueue.length && this._count===1) {
          //     resolve(data);
          // }
          // or:
          lah._cb = () => {
            //! this._taskQueue.length && this._count===0
            if (lah._count === 0) {
              resolve(data);
            }
          };
        })
    };

    for (let i = 0; i < all.length; i += 1) {
      // call handle storeHandleResult with limit number
      lah.call(storeHandleResult, i);
    }
    // or:
    // all.forEach((v,i)=>{
    //     lah.call(storeHandleResult, i);
    // })
  })
}

export { promiseAll as default };
