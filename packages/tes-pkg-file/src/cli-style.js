import { cliOptionHelp } from '@ymc/cli-option'
import parserArgs from '@ymc/nano-parse'
import { ycsRunner } from '@ymc/cli-runner'
import { main, param } from './index'

/**
 * cli agrs from string to array - mock preocess.argv
 * @param {string} s
 * @return {string[]}
 */
function mockArgv(s) {
  return s.split(/ +/)
}

// desc: get usage with @ycs/cli-option
main.usage = cliOptionHelp.param(param()).usage().replace('{ns}', 'runjest')

// desc: parse cli args with nano-parser then run main
// main(parserArgs(likeCliArgs))

// desc: run main trough @ycs/cli-runner
ycsRunner.ns('runjest').version('1.0.0').nanoparse(parserArgs).entry(main)

ycsRunner.run(mockArgv('run jest -h')) // some thing like

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/tes-pkg-file/src/cli-style.js
