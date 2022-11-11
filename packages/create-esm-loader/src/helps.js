import './types'
import satisfiesVersion from './satisfy-version'

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
        }
    }
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
        mem[key] = []
        return mem
    }, {})
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
        return []
    }
    if (!Array.isArray(obj)) {
        return [obj]
    }
    return obj.flat(Infinity)
}

// # has(obj, prop)
/**
 * has own property
 * @param {{}} obj
 * @param {string} prop
 * @returns {boolean}
 */
function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
}

// # noop()
function noop() {}

export { noop, hasOwnProperty, ensureFlatArr, createStack, shortCircuit, satisfiesVersion }
