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
  // const eslint = {}
  // let cache
  // cache = setting(eslint, 'settings.import/resolver.alias')
  // log(eslint, cache)

  // idea: define-babel-alias-map -> babel-alias-map-to-babel-config
  // log('[task] define babel alias map')
  // const babelAliasHelp = new BabelbabelAliasHelpEng()
  // // babelAliasHelp.root('node_modules').root('./').root('./secrets/script')
  // // babelAliasHelp.cwd('babelrc')//optional for work in packages
  // // babelAliasHelp.cwd('packagejson')//no work in packages
  // // babelAliasHelp.alias('', './', `xx to ./xx`)
  // // babelAliasHelp.alias('^@root/(.+)$', './\\1', `@root/xx to ./xx`)
  // // babelAliasHelp.alias('^@src/(.+)$', './src/\\1', `@src/xx to ./src/xx`)
  // // babelAliasHelp.alias('^@pkg/(.+)$', './packages/\\1', `@pkg/xx to ./packages/xx`)
  // // babelAliasHelp.alias('^@teabag/(.+)$', './packages/\\1', `@teabag/xx to ./packages/xx`)
  // // babelAliasHelp.alias('^@scripts/(.+)$', './secrets/script/\\1', `@scripts/xx to ./secrets/script/xx`)
  // babelAliasHelp.root('node_modules').root('./')
  // babelAliasHelp.alias('@ymc', './pacakges', 'xx to ./xx')
  // babelAliasHelp.alias('@provate-pkgs', './private-pkgs', 'xx to ./xx')
  // // https://www.npmjs.com/package/babel-plugin-module-resolver
  // // https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md#regular-expressions
  // // https://dev.to/karanpratapsingh/cleaning-up-imports-using-module-resolver-in-react-native-58g8
  // // https://gist.github.com/nodkz/41e189ff22325a27fe6a5ca81df2cb91
  // configStore.babelAliasHelpdata = babelAliasHelp.data
  // log(configStore.babelAliasHelpdata)

  // babel alias to mudule alias //tool,lib
  // log('[task] set babel alias to babel config')
  // configStore['babel.config.json'] = setModuleAliasToBabelConfig({}, babelAliasHelp.data)
  // // log(JSON.stringify(configStore['babel.config.json'], null, 4))

  // // idea: get-babel-alias-map-in-babel-config
  // // babel config of module alias
  // configStore['babel.alias.json'] = getModuleAliasInBabelConfig(configStore['babel.config.json'])
  // log('[info] babel alias map')
  // log(JSON.stringify(configStore['babel.alias.json'], null, 4))

  // log('[task] set babel alias to eslint alias')
  // log('[task] set eslint alias to eslint config')
  // jsonstream.init(`module-alias.json`)
  // await jsonstream.write(configStore['babel.alias.json'])
  // log(`[info] out: module-alias.json`)

  log('[task] start with module-alias')
  // idea: load-module-alias-map -> mam-to-babel-alias
  // load-module-alias-map -> mam-to-eslint-alias
  // load-module-alias-map -> mam-to-jest-alias
  // load-module-alias-map -> mam-to-vscodesettings-alias

  log('[info] src: module-alias.json')
  let ma
  jsonstream.init('module-alias.json')
  ma = await jsonstream.read({})
  let { root, alias, transformFunctions, extensions } = ma

  // log('[task] set module alias to babel alias')
  // configStore.ma2babel = ma2babel(ma)
  // log(configStore.ma2babel)

  // log('[task] set module alias to eslint alias')
  // configStore.ma2eslint = ma2eslint(ma)
  // log(configStore.ma2eslint)

  // log('[task] set module alias to jest alias')
  // configStore.ma2Jest = ma2jest(ma)
  // log(configStore.ma2Jest)

  // log('[task] set module alias to jsconfig.json or tsconfig.json alias')
  // configStore.ma2Jsconfig = ma2jsconfig(ma)
  // log(configStore.ma2Jsconfig)

  // log('[task] set module alias to .vscode/settings.json alias')
  // configStore.ma2Vscodeconfig = ma2vscodeconfig(ma)
  // log(configStore.ma2Vscodeconfig)

  log('[task] set module alias to .eslintrc.json')
  loc = '.eslintrc.json'
  jsonstream.init(loc)
  configStore[loc] = await jsonstream.read({})
  configStore[loc] = setModuleAliasToEslintConfig(configStore[loc], { map: ma2eslint(ma) })
  // log(hunmanJson(configStore[loc]))
  // log(`[info] info ${loc}`)
  // log(hunmanJson(configStore[loc]))
  // log(`[info] write ${loc}`)
  await jsonstream.write(configStore[loc])
  log(`[info] out: ${loc}`)

  log('[task] set module alias to babel.config.json')
  log('[info] load babel.config.json')
  loc = 'babel.config.json'
  jsonstream.init(loc)
  configStore[loc] = await jsonstream.read({})
  // log(`[info] re-make ${loc}`)
  configStore[loc] = setModuleAliasToBabelConfig(configStore[loc], { root, transformFunctions, alias: ma2babel(ma) })
  // log(`[info] info ${loc}`)
  // log(hunmanJson(configStore[loc]))
  // log(`[info] write ${loc}`)
  await jsonstream.write(configStore[loc])
  log(`[info] out: ${loc}`)

  loc = 'test/unit/jest.config.json'
  log(`[task] set module alias to ${loc}`)
  jsonstream.init(loc)
  configStore[loc] = await jsonstream.read({})
  configStore[loc] = setModuleAliasToJest(configStore[loc], { map: ma2jest(ma), extensions })
  // log(hunmanJson(configStore[loc]))
  // log(`[info] info ${loc}`)
  // log(hunmanJson(configStore[loc]))
  // log(`[info] write ${loc}`)
  await jsonstream.write(configStore[loc])
  log(`[info] out: ${loc}`)

  loc = '.vscode/settings.json'
  log(`[task] set module alias to ${loc}`)
  jsonstream.init(loc)
  configStore[loc] = await jsonstream.read({})
  configStore[loc] = setModuleAliasToVscodeSettings(configStore[loc], ma2vscodeconfig(ma))
  // log(hunmanJson(configStore[loc]))
  // log(`[info] info ${loc}`)
  // log(hunmanJson(configStore[loc]))
  // log(`[info] write ${loc}`)
  await jsonstream.write(configStore[loc])
  log(`[info] out: ${loc}`)

  loc = 'jsconfig.json'
  log(`[task] set module alias to ${loc}`)
  jsonstream.init(loc)
  configStore[loc] = await jsonstream.read({})
  configStore[loc] = setModuleAliasToJsconfig(configStore[loc], { map: ma2jsconfig(ma), extensions })
  // log(hunmanJson(configStore[loc]))
  // log(`[info] info ${loc}`)
  // log(hunmanJson(configStore[loc]))
  // log(`[info] write ${loc}`)
  await jsonstream.write(configStore[loc])
  log(`[info] out: ${loc}`)

  // map,extensions,root,transformFunctions

  // todo:
  // resolve,format,fetch,transform,load
}
main()
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/module-alias/src/demo/module-alias-to-config.js
