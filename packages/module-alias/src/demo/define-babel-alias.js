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
  log('[task] define babel alias map')
  const babelAliasHelp = new BabelbabelAliasDefineEng()
  // babelAliasHelp.root('node_modules').root('./').root('./secrets/script')
  // babelAliasHelp.cwd('babelrc')//optional for work in packages
  // babelAliasHelp.cwd('packagejson')//no work in packages
  // babelAliasHelp.alias('', './', `xx to ./xx`)
  // babelAliasHelp.alias('^@root/(.+)$', './\\1', `@root/xx to ./xx`)
  // babelAliasHelp.alias('^@src/(.+)$', './src/\\1', `@src/xx to ./src/xx`)
  // babelAliasHelp.alias('^@pkg/(.+)$', './packages/\\1', `@pkg/xx to ./packages/xx`)
  // babelAliasHelp.alias('^@teabag/(.+)$', './packages/\\1', `@teabag/xx to ./packages/xx`)
  // babelAliasHelp.alias('^@scripts/(.+)$', './secrets/script/\\1', `@scripts/xx to ./secrets/script/xx`)
  babelAliasHelp.root('node_modules').root('./')
  babelAliasHelp.alias('@ymc', './pacakges', 'xx to ./xx')
  babelAliasHelp.alias('@provate-pkgs', './private-pkgs', 'xx to ./xx')
  babelAliasHelp.alias('@script-pkgs', './scr/lib', 'xx to ./xx')
  // https://www.npmjs.com/package/babel-plugin-module-resolver
  // https://github.com/tleunen/babel-plugin-module-resolver/blob/master/DOCS.md#regular-expressions
  // https://dev.to/karanpratapsingh/cleaning-up-imports-using-module-resolver-in-react-native-58g8
  // https://gist.github.com/nodkz/41e189ff22325a27fe6a5ca81df2cb91
  configStore.babelAliasHelpdata = babelAliasHelp.data
  log(configStore.babelAliasHelpdata)

  // babel alias to mudule alias //tool,lib
  log('[task] set babel alias to babel config')
  configStore['babel.config.json'] = setModuleAliasToBabelConfig({}, babelAliasHelp.data)
  // log(JSON.stringify(configStore['babel.config.json'], null, 4))

  // idea: get-babel-alias-map-in-babel-config
  // babel config of module alias
  configStore['babel.alias.json'] = getModuleAliasInBabelConfig(configStore['babel.config.json'])
  log('[info] babel alias map')
  log(JSON.stringify(configStore['babel.alias.json'], null, 4))

  loc = 'module-alias.json'
  jsonstream.init(loc)
  await jsonstream.write(configStore['babel.alias.json'])
  log(`[info] out: ${loc}`)
}
main()
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/module-alias/src/demo/define-babel-alias.js
