/** @typedef {string} strLoader */
/** @typedef {{loader:{},options:{},hooks:{}}} objLoader */
/** @typedef {strLoader & objLoader} loader */
/** @typedef {[{fn:()=>any,options:{}}]} fns */

//https://nodejs.org/api/esm.html#resolvespecifier-context-nextresolve

/**@typedef {string|null|undefined} format */
/**@typedef {boolean} shortCircuit  */
/**@typedef {string} url  */
/**@typedef {{url:string,format:string|null|undefined,shortCircuit:boolean|undefined}} resolveResult  */
/**@typedef {{source:string|ArrayBuffer|TypedArray,format:string|null|undefined,shortCircuit:boolean|undefined}} loadResult  */
