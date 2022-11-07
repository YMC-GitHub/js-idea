// import getFilelist from '@ymc/get-file-list'
import getNodeBuitInModule from '@ymc/get-node-builtin-modules'
import ParseHelp from './dep-file-parser'
import { log } from './helps'

async function main() {
  const builinModules = getNodeBuitInModule()
  // log(builinModules)
  const ph = new ParseHelp()
  ph.option.nodedeps = builinModules
  ph.option.ignoreComment = true
  await ph.parse('packages/dep-parse/src/helps.js')
  log('[info] dep out-of-pkg')
  log(ph.outlibDeps)
  log('[info] dep int-of-pkg')

  log(ph.inLibDeps)
  log('[info] dep all-of-pkg')

  log(ph.alldeps)
  // log(ph)
  // return ph.outlibDeps
  // return ph.inLibDeps
}
main()
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/dep-parse/src/demo.js
