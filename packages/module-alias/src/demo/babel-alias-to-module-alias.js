/* eslint-disable  no-unused-vars,prefer-const */
/* eslint-disable  max-len */

import {
    BabelbabelAliasDefineEng,
    getModuleAliasInBabelConfig,
    jsonstream,
    ma2babel,
    ma2eslint,
    ma2jest,
    ma2jsconfig,
    ma2tsconfig,
    ma2vscodeconfig,
    setModuleAliasToBabelConfig,
    setModuleAliasToEslintConfig,
    setModuleAliasToVscodeSettings,
    setModuleAliasToJest,
    setModuleAliasToJsconfig,
    hunmanJson
} from '../index'

const { log } = console
async function main(options = {}) {
    let option = {
        ...options
    }
    const configStore = {}
    let loc

    // idea: get-babel-alias-map-in-babel-config
    // babel config of module alias
    loc = 'babel.config.json'
    jsonstream.init(loc)
    configStore['babel.config.json'] = await jsonstream.read({})

    configStore['babel.alias.json'] = getModuleAliasInBabelConfig(configStore['babel.config.json'])
    log('[info] babel alias map')
    log(JSON.stringify(configStore['babel.alias.json'], null, 4))

    loc = 'module-alias.json'
    jsonstream.init(loc)
    await jsonstream.write(configStore['babel.alias.json'])
    log(`[info] out: ${loc}`)
}
main()
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/module-alias/src/demo/babel-alias-to-module-alias.js
