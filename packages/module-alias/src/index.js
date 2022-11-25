/* eslint-disable  no-unused-vars,prefer-const */
/* eslint-disable  max-len */

import { jsonstream } from '@ymc/json-stream-io'
import {
    ma2babel,
    ma2eslint,
    ma2jest,
    ma2jsconfig,
    ma2tsconfig,
    ma2vscodeconfig
} from './helper/module-alias-to-other-alias'
import {
    setModuleAliasToBabelConfig,
    setModuleAliasToEslintConfig,
    setModuleAliasToVscodeSettings,
    setModuleAliasToJest,
    setModuleAliasToJsconfig
} from './helper/module-alias-to-other-config'
import BabelbabelAliasDefineEng from './helper/babel-alias-write'

import { getModuleAliasInBabelConfig, hunmanJson } from './helps'

export {
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
}
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/esm-loader/src/module-alias-help.js
