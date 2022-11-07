import ycsRunner from './ycscli.entry'

ycsRunner.run(process.argv)

// node --no-warnings --loader ./scr/lib/esm-loader.js packages/add-pkg-dep/src/ycscli.cli.js -h
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/add-pkg-dep/src/ycscli.cli.js -h --pkg-loc ./packages/noop
// addpkgdep --pkg-loc ./packages/noop
// ycs.param -> ycs.main -> ycs.entry ->  ycs.runner ->  ycs.cli
