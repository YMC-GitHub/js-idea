// https://github.com/sebamarynissen/create-esm-loader/blob/master/lib/create-loader.js
// https://github.com/sebamarynissen/node-esm-loader/blob/master/lib/loader.js

// import semver from 'semver'
import { noop, hasOwnProperty, ensureFlatArr, createStack, shortCircuit, satisfiesVersion } from './helps'
import normalize from './normalize-loader'

// todo:
// compare node version

/* eslint-disable no-restricted-syntax,no-await-in-loop,class-methods-use-this */

// # Loader
const keys = ['resolve', 'format', 'fetch', 'transform']
function createEmptyStack() {
    return createStack(keys)
}

/* eslint-disable no-async-promise-executor */
class Loader {
    // ## constructor(loaders, options)
    // The loader can be created in two ways: either by specifying a single
    // object containing { loaders, options }, or by specifing a loaders and
    // options object separately.
    constructor(loaders = {}, options = {}) {
        /* eslint-disable no-param-reassign */
        //idea: ressign loaders and options
        if (hasOwnProperty(loaders, 'loaders')) {
            ;({ loaders, options = {} } = loaders)
        }

        this.options = options
        this.stack = null

        //idea: loading
        //build-stack -> resolve-this
        const loading = new Promise(async resolve => {
            this.stack = await this.buildStack(loaders)
            resolve(this)
        })

        //idea: ready
        // return-loading
        this.ready = () => loading
        /* eslint-enable no-param-reassign */
    }

    // ## handleStack(id, resource, ctx, defaultFunction)
    // Loops all functions in the given stack and returns the first one that
    // returns something truthy.
    /**
     *
     * @param {string} id - one of reslove,format,fetch,translorm
     * @param {string} resource
     * @param {{}} ctx
     * @param {()=>any} defaultFunction
     * @returns
     */
    async handleStack(id, resource, ctx, defaultFunction) {
        // Our stack might still be building from the configuration objct, so
        // make sure to await it.
        /* eslint-disable no-restricted-syntax,no-await-in-loop */
        //idea:
        // get-fns,get-global-options
        // get-fn,get-fn-options,get-final-options
        // run-fn,return-fn-result-if-exists,run-default-fn-and-return
        /**@type fns */
        const fns = this.stack[id] || []
        const baseOptions = { ...this.options }
        for (const { fn, options } of fns) {
            const finalOptions = {
                ...baseOptions,
                ...options,
                ...ctx
            }
            const result = await fn(resource, finalOptions)
            if (result) {
                return result
            }
        }
        return defaultFunction(resource, ctx, defaultFunction)
        /* eslint-enable no-restricted-syntax,no-await-in-loop */
    }

    // ## hooks()
    // This function returns an object containing all Node.js loader hooks as
    // properties so that the loader entry file can re-export them. See #1.
    // Given that the api changed in v16.12.0, we'll inspect the current
    // process version and adapt accordingly.
    hooks() {
        // For backwards compatibility purposes, we will manually compose
        // `format()`, `fetch()` and `transform()` into a `load()` function.
        // idea: compose format,fetch,transform to load manually
        // get-resolve-hook,short-circuit
        // get-format-hook,get-fetch-hook

        // advance: cache args in it
        const hook =
            id =>
            (...args) =>
                this.handleStack(id, ...args)

        /**
         * @param {}
         * @returns {{url:string,format:string|null|undefined,shortCircuit:boolean|undefined}}
         */
        const resolve = shortCircuit(hook('resolve'))
        /**
         * @type {()=>Promise<{format:string|null|undefined}>}
         */
        const getFormat = hook('format')
        /**
         * @type {()=>Promise<{source:any}>}
         */
        const getSource = hook('fetch')

        /* eslint-disable no-restricted-syntax,no-await-in-loop */

        // Handling transformation is fundamentally different as we have to
        // chain results here.
        //idea:
        // get-fns-of-transform,get-global-options
        // get-fn,get-fn-options,get-final-options
        // run-fn,return-fn-result-if-exsits,run-default-fn-and-return
        /**
         *
         * @param {string} source
         * @param {{}} ctx
         * @param {()=>Promise} node
         * @returns {{source:string|unknow}|next}
         */
        const transformSource = async (source, ctx, node) => {
            const fns = this.stack.transform || []
            const baseOptions = { ...this.options }
            let mem = source
            let flag = true
            for (const { fn, options } of fns) {
                const finalOptions = {
                    ...baseOptions,
                    ...options,
                    ...ctx
                }
                const result = await fn(mem, finalOptions)
                if (result || typeof result === 'string') {
                    flag = false
                    if (typeof result === 'string') {
                        mem = result
                    } else {
                        mem = result.source
                    }
                }
            }
            // run default fn
            if (flag) {
                return node(source, ctx, node)
            }
            return { source: mem }
        }
        /* eslint-enable no-restricted-syntax,no-await-in-loop */

        // Now compose the correct hooks based on the Node version we're
        // running.
        // semver.satisfies(process.version, '<16.12.0')

        if (satisfiesVersion(process.version, '<16.12.0')) {
            return {
                resolve,
                getFormat,
                getSource,
                transformSource
            }
        }
        /* eslint-disable no-restricted-syntax,no-await-in-loop,class-methods-use-this */
        /* eslint-disable no-shadow,no-unused-vars  */

        // If we reach this point, it means we're running on Node v16.12.0 or
        // higher, which uses the new approach. We only have to export a
        // `resolve` and `load` function here, but the difficulty is that the
        // `load()` function has to be composed manually!
        const load = shortCircuit(async (url, ctx, defaultLoad) => {
            // idea:
            // get-format -> get-source -> get transform
            // If the format was already specified by the resolve hook, we
            // won't try to fetch it again. Note that this functionality is
            // specific to v16.12.
            const grab = (obj = {}) => obj.format
            let { format = await getFormat(url, ctx, noop).then(grab) } = ctx

            // Mock the default `getSource` function. What's important here is
            // that if we the default getSource is used, we'll also set it as
            // default format!
            /**
             *
             * @param {string} url
             * @param {{}} ctx
             * @returns {{format:string}}
             */
            const defaultGetSource = async (url, ctx) => {
                const result = await defaultLoad(url, { format })
                if (!format) {
                    format = result.format
                }
                return result
            }
            const { source } = await getSource(url, ctx, defaultGetSource)

            // At last transform.
            const defaultTransform = source => ({ source })
            const transform = await transformSource(source, { url, format }, defaultTransform)
            return {
                format,
                source: transform.source
            }
        })
        /* eslint-enable no-shadow,no-unused-vars  */

        return { resolve, load }
    }

    // ## buildStack(config)
    // The function that will build an object containing the function stacks
    // for each loader hook based on the given hooks configuration.
    async buildStack(config) {
        // Ensure that the hooks that were specified are an actual flat array.
        const hooks = ensureFlatArr(config).flat(Infinity)

        // Build up our stack now.
        const wait = []
        const stack = createEmptyStack()
        for (const obj of hooks) {
            // Make sure to get a normalized definition.
            const def = normalize(obj)

            // If the hook that was specified is a string, it's an es module
            // that we'll have to import first. Note that we are going to do
            // the loading *in parallel*.
            if (typeof def.loader === 'string') {
                // Create a dummy stack so that we reserve space for the
                // dynamically loaded loaders.
                const dummy = createEmptyStack()
                for (const key of keys) {
                    const hook = stack[key]
                    hook.push(dummy[key])
                }

                // Now start loading.
                //import module  -> to-loader-definition -> normailize-definition
                wait.push(
                    (async () => {
                        const module = await import(def.loader)
                        const normalized = normalize({
                            hooks: module.default,
                            options: def.options
                        })
                        this.fill(normalized, dummy)
                    })()
                )

                continue /* eslint-disable-line no-continue */
            } else {
                this.fill(def, stack)
            }
        }

        // Await everything that's still being loaded. Once that is done we'll
        // need to flatten everything in the stack again as the dynamically
        // loaded configurations might be arrays as well.
        // idea: promise-all-wait -> flatten-stack-each-key
        await Promise.all(wait)
        for (const key of keys) {
            stack[key] = stack[key].flat(Infinity)
        }
        return stack
    }

    /**
     * fill loader to stack
     * @param {{hooks:{[string]:[()=>{}]},options:{}}} loader
     * @param {{[string]:[()=>{}]}} stack
     */
    fill(loader, stack) {
        // get hooks and options from loader,
        // get stack hook by key for each key
        // get loader hooks by key
        // stack-hook add handle and options for each loader-hook
        // hook exp = {fn,option}
        const { hooks, options } = loader
        for (const key of keys) {
            const hook = stack[key]
            const fns = ensureFlatArr(hooks[key])
            for (const fn of fns) {
                hook.push({
                    fn,
                    options
                })
            }
        }
    }
}
export { keys, Loader }