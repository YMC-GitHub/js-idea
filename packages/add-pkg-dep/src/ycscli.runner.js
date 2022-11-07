import parserArgs from '@ymc/nano-parse'
import { ycsRunner } from '@ymc/cli-runner'
import { main, version, ns } from './ycscli.entry'

// desc: parse cli args with nano-parser then run main
// main(parserArgs(process.argv))

export { main, ns, version }
// desc: run main trough @ycs/cli-runner
ycsRunner.ns(ns).version(ns).nanoparse(parserArgs).entry(main)

export default ycsRunner
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/add-pkg-dep/src/ycscli.cli.js -h
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/add-pkg-dep/src/ycscli.cli.js -h --pkg-loc ./packages/noop
// addpkgdep --pkg-loc ./packages/noop
