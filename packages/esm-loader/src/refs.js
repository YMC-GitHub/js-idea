// https://dev.to/jakobjingleheimer/custom-esm-loaders-who-what-when-where-why-how-4i1o
// [ts-loader](https://github.com/nodejs/loaders-test/tree/HEAD/typescript-loader)
// [css-loader](https://github.com/JakobJingleheimer/demo-css-loader)
// [https-loader](https://github.com/nodejs/loaders-test/tree/HEAD/https-loader)
// [coffeescript-loader](https://github.com/nodejs/loaders-test/blob/main/coffeescript-loader/loader-esm-only.js)
// https://nodejs.org/api/esm.html#esm_experimental_loaders

// feat
// - [x] auto default ext
// - [x] custom dir alias
// - [x] import text file - text file is module too
// - [x] custom ext

// idea:
// node --experimental-loader=node-esm-loader --loader-config=./path/to/config.js ./your.file.js

// node --experimental-loader=node-esm-loader ./your.file.js
