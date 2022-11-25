/* eslint-disable prefer-const */
/* eslint-disable no-param-reassign */
import { setting } from '../helps'

function setLikeTransformFunctions(oldOpts, ns, builtin) {
    let cache = oldOpts[ns]
    cache = cache ? [...new Set([...builtin, ...cache])] : builtin
    oldOpts[ns] = cache
}
function likeArr(obj) {
    let res = obj || []
    return Array.isArray(res) ? res : [res]
}
function likeNoDot(ext) {
    return ext.map(v => v.replace(/^./, ''))
}
/**
 *
 * @param {{}} cnf
 * @param {{root:string[],alias:{},transformFunctions:string[]}} options
 * @returns
 */
function setModuleAliasToBabelConfig(cnf, options) {
    if (!cnf.plugins) cnf.plugins = []
    const { plugins = [] } = cnf
    let added = false
    const builtinRoot = ['node_modules', './']
    const builtinTransformFunctions = [
        'require',
        'require.resolve',
        'System.import',
        'jest.genMockFromModule',
        'jest.mock',
        'jest.unmock',
        'jest.doMock',
        'jest.dontMock'
    ]
    for (let index = 0; index < plugins.length; index += 1) {
        let [name, oldOpts] = plugins[index]
        if (name === 'babel-plugin-module-resolver') {
            if (!oldOpts) oldOpts = {}
            oldOpts = {
                ...oldOpts,
                ...options
                // transformFunctions: builtinTransformFunctions
            }
            // let { transformFunctions } = oldOpts
            // transformFunctions = transformFunctions
            //     ? [...new Set([...builtinTransformFunctions, ...transformFunctions])]
            //     : builtinTransformFunctions
            // oldOpts.transformFunctions = transformFunctions
            setLikeTransformFunctions(oldOpts, 'transformFunctions', builtinTransformFunctions)
            setLikeTransformFunctions(oldOpts, 'root', builtinRoot)
            plugins[index] = [name, oldOpts]
            added = true
            break
        }
    }
    if (!added) {
        let nowOpts = { ...options }
        setLikeTransformFunctions(nowOpts, 'transformFunctions', builtinTransformFunctions)
        setLikeTransformFunctions(nowOpts, 'root', builtinRoot)
        plugins.push(['babel-plugin-module-resolver', nowOpts])
    }
    return cnf
}

/**
 *
 * @param {{}} cnf
 * @param {{map:[][],extensions:string[]}} alias
 * @returns
 */
function setModuleAliasToEslintConfig(cnf, alias) {
    const builtinExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue']
    let context
    context = setting(cnf, 'settings.import/resolver.alias', {})
    context = context.alias
    // set builtin to context
    setLikeTransformFunctions(context, 'extensions', builtinExtensions)
    // set options to context
    setLikeTransformFunctions(context, 'extensions', likeArr(alias.extensions))

    // context = setting(cnf, 'settings.import/resolver.alias', { val: alias })
    // const { extensions = [] } = context
    // context.extensions = [...new Set([...extensions, ...builtinExtensions])]
    return cnf
}

/**
 *
 * @param {{}} cnf
 * @param {{}} alias
 * @returns
 */
function setModuleAliasToVscodeSettings(cnf, alias) {
    cnf['path-intellisense.mappings'] = alias
    return cnf
}

/**
 *
 * @param {{}} cnf
 * @param {{map:{},extensions:string[],root?:string}} alias
 * @returns
 */
function setModuleAliasToJest(cnf, alias) {
    let builtinExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue']
    builtinExtensions = likeNoDot(builtinExtensions)
    // cnf['moduleNameMapper'] = alias.moduleNameMapper
    // setLikeTransformFunctions(cnf, 'moduleFileExtensions', likeArr(alias.moduleFileExtensions))
    cnf.moduleNameMapper = alias.map
    setLikeTransformFunctions(cnf, 'moduleFileExtensions', builtinExtensions)
    setLikeTransformFunctions(cnf, 'moduleFileExtensions', likeNoDot(likeArr(alias.extensions)))

    return cnf
}

/**
 *
 * @param {{}} cnf
 * @param {{map:{},extensions:string[],root?:string}} alias
 * @returns
 */
function setModuleAliasToJsconfig(cnf, alias) {
    let context = setting(cnf, 'compilerOptions')
    context = context.compilerOptions
    context.paths = alias.map
    if (alias.root) {
        context.baseUrl = alias.root
    }
    return cnf
}
export {
    setModuleAliasToBabelConfig,
    setModuleAliasToEslintConfig,
    setModuleAliasToVscodeSettings,
    setModuleAliasToJest,
    setModuleAliasToJsconfig
}
