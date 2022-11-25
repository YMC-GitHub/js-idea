import { hasOwnProperty } from './helps'
// {{loader:string,options:{}}|{hooks:loader,options:{}}|{loader:loader,hooks:any,options:{}}}
/**
 * normalize a loader definition
 * @param {loader} loader
 * @returns
 * @description
 * ```
 * ## task
 * - [x] string -> {loader:string,options:{}} //1.
 * - [x] {loader:string,options:{}} -> {loader:string,options:{}}
 * - [x] x -> {loader:string,options:{}}
 * - [x] {hooks:any,options:{}} -> {hooks:any,options:{}}
 * ```
 */
function normalize(loader) {
    // 1
    if (typeof loader === 'string') {
        return {
            loader,
            options: {}
        }
    }
    // 2
    if (hasOwnProperty(loader, 'loader')) {
        return {
            loader: loader.loader,
            options: { ...loader.options }
        }
    }
    // 3
    if (!hasOwnProperty(loader, 'hooks')) {
        return {
            hooks: loader,
            options: {}
        }
    }
    // 4
    return loader
}
export default normalize
