/* eslint-disable no-unused-vars,prefer-const */
/* eslint-disable max-len */

import main from './index'

/**
 * get cli args
 * @param {string} def
 * @returns {string[]}
 * @description
 * ```
 * - [x] set the first arg with default value 'def'
 * ```
 */
function getArgs(def = './packages/noop') {
  const args = process.argv.slice(2)
  if (args.length === 0) args[0] = def
  return args
}

const run = async () => {
  const args = getArgs('./packages/noop')
  const wkd = args[0]
  main(wkd)
}
run()

// run as node script
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/gen-pkg-readme/src/demo.js ./packages/nano-parse
