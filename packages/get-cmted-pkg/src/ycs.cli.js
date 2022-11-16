import ycsRunner from './ycs.runner'

ycsRunner.run(process.argv)

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/get-cmted-pkg/src/ycs.cli.js -h
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/get-cmted-pkg/src/ycs.cli.js -v
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/get-cmted-pkg/src/ycs.cli.js
// todo:
// addpkgdep --pkg-loc ./packages/noop
// ycs.param -> ycs.main -> ycs.entry ->  ycs.runner ->  ycs.cli
