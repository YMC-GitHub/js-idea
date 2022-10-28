// @ymc/promise-all # @ymc/limit-all-promise
// limit promise all
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled

import { LimitAsyncHandle } from '@ymc/limit-async-handle'
import { kindOf } from '@ymc/kind-of'

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
    const num = max || all.length
    const lah = new LimitAsyncHandle(num)

    const data = []
    // limit max , create task , run task
    const storeHandleResult = i => {
      let promise = all[i]
      // feat: all is async functions
      if (kindOf(promise) === 'asyncfunction') {
        promise = promise()
      } else if (kindOf(promise) === 'function') {
        // feat: all is functions
        promise = Promise.resolve(promise())
      }
      return promise
        .then(
          res => {
            if (lah._debug) {
              data[i] = { index: i, data: res, state: 'ok' }
            } else {
              data[i] = res
            }
          },
          error => {
            if (lah._debug) {
              data[i] = { index: i, state: 'no', error }
            } else {
              data[i] = error
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
              resolve(data)
            }
          }
        })
    }

    for (let i = 0; i < all.length; i += 1) {
      // call handle storeHandleResult with limit number
      lah.call(storeHandleResult, i)
    }
    // or:
    // all.forEach((v,i)=>{
    //     lah.call(storeHandleResult, i);
    // })
  })
}

export default promiseAll
