import { getDstDir } from './index.js'
import { log, blue } from './index-too.js'
// sam here

let option = {
  excludes: ['dist', 'lib', 'libtpl-rollup-plugins', 'vagrant']
}
// log(blue(`get dst dir: node_modules`))
// getDstDir("D:\\code-store",/node_modules/ig)

// log(blue(`get dst dir: the dirs that with empty space`))
// getDstDir("F:\\bilibili-dance",/ +/ig)

// log(blue(`get dst file: the file that name with copy and ends with .js`))
// DST_MODE='file'
// getDstDir("D:\\code-store",/copy.*\.js$/ig)

// log(blue(`get dst file: the file that name with fav and ends with .js`))
// DST_MODE='file'
// getDstDir("D:\\code-store",/fav.*\.js$/ig)

log(blue(`get dst file: the file that name with hua and ends with .sh`))
// DST_MODE = 'file'
option.regexp = /hzh.*\.sh$/gi
getDstDir('D:\\code-store', option)

// log(blue(`get dst file: the file that file text with ycs and name ends with .js`))
// DST_MODE='file_text'
// DST_FILE_REGEXP=/ycs/ig
// getDstDir("H:\\js-project",/\.js$/ig)

// log(blue(`get dst file: the file that file text with ycs and name ends with .js`))
// DST_MODE='file_text'
// DST_FILE_REGEXP=/curd-dirs-sync/ig
// getDstDir("H:\\js-project",/\.js$/ig)

// log(blue(`get dst file: the file that file text with jsdoc and name ends with .js`))
// DST_MODE='file_text'
// DST_FILE_REGEXP=/jsdoc/ig
// IGNORE_DIR_REGEXP=/node_modules/ig
// // getDstDir("H:\\js-project",/\.js$/ig)
// getDstDir("D:\\code-store\\typescript",/\.js$/ig)

// log(blue(`get dst file: the file that file text with eslint and name ends with .js`))
// DST_MODE='file_text'
// DST_FILE_REGEXP=/eslint/ig
// IGNORE_DIR_REGEXP=/node_modules/ig
// getDstDir("D:\\code-store\\typescript",/\.js$/ig)
// node packages/read-diretory/src/index-ins.js
