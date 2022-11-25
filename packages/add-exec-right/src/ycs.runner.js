import parserArgs from '@ymc/nano-parse'
import { ycsRunner } from '@ymc/cli-runner'
import { main, version, ns } from './ycs.entry'

// desc: parse cli args with nano-parser then run main
// main(parserArgs(process.argv))

export { main, ns, version }
// desc: run main trough @ycs/cli-runner
ycsRunner.ns(ns).version(ns).nanoparse(parserArgs).entry(main)

export default ycsRunner
