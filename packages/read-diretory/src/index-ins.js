import { getDstDir } from './index.js'
import { log, blue } from './index-too.js'
// sam here

let option = {
  excludes: ['dist', 'lib', 'libtpl-rollup-plugins', 'vagrant']
}
//docs: update usage comment in instance\nwith xx to option.xx
// log(blue(`get dst dir: node_modules`))
// getDstDir("D:\\code-store",/node_modules/ig)

// log(blue(`get dst dir: the dirs that with empty space`))
// getDstDir("F:\\bilibili-dance",/ +/ig)

// log(blue(`get dst file: the file that name with copy and ends with .js`))
// option.mode='file'
// getDstDir("D:\\code-store",/copy.*\.js$/ig)

// log(blue(`get dst file: the file that name with fav and ends with .js`))
// option.mode='file'
// getDstDir("D:\\code-store",/fav.*\.js$/ig)

log(blue(`get dst file: the file that name with hua and ends with .sh`))
// option.mode = 'file'
option.regexp = /hzh.*\.sh$/gi
getDstDir('D:\\code-store', option)

// log(blue(`get dst file: the file that file text with ycs and name ends with .js`))
// option.mode='file_text'
// option.fileTextRegexp=/ycs/ig
// getDstDir("H:\\js-project",/\.js$/ig)

// log(blue(`get dst file: the file that file text with ycs and name ends with .js`))
// option.mode='file_text'
// option.fileTextRegexp=/curd-dirs-sync/ig
// getDstDir("H:\\js-project",/\.js$/ig)

// log(blue(`get dst file: the file that file text with jsdoc and name ends with .js`))
// option.mode='file_text'
// option.fileTextRegexp=/jsdoc/ig
// option.excludesRegexp=/node_modules/ig
// // getDstDir("H:\\js-project",/\.js$/ig)
// getDstDir("D:\\code-store\\typescript",/\.js$/ig)

// log(blue(`get dst file: the file that file text with eslint and name ends with .js`))
// option.mode='file_text'
// option.fileTextRegexp=/eslint/ig
// option.excludesRegexp=/node_modules/ig
// getDstDir("D:\\code-store\\typescript",/\.js$/ig)
// node packages/read-diretory/src/index-ins.js
