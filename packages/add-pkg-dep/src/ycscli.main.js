/* eslint-disable no-unused-vars */
import { getBuiltinConfig, getCliFlags } from '@ymc/cli-param'
import param from './param'
import handle from './main'
import { log, getObjOnlyDefinedKeys } from './helps'

async function main(options = {}) {
  const option = getObjOnlyDefinedKeys({
    ...getBuiltinConfig(param()),
    ...getCliFlags(options)
  })
  // log(option, options)
  // process.exit(0)
  return handle(option)
}
export { param, main }
// xx -> xx.main -> xx.cli
