import { cliOptionHelp } from '@ymc/cli-option'
import parserArgs from '@ymc/nano-parse'
import { ycsRunner } from '@ymc/cli-runner'
import { main, param } from './index'

// desc: get usage with @ycs/cli-option
main.usage = cliOptionHelp.param(param()).usage().replace('{ns}', 'runjest')

// desc: parse cli args with nano-parser then run main
// main(parserArgs(process.argv))

// desc: run main trough @ycs/cli-runner
ycsRunner.ns('runjest').version('1.0.0').nanoparse(parserArgs).entry(main)
ycsRunner.run(process.argv)

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/tes-pkg-file/src/ycs-style.js -h
