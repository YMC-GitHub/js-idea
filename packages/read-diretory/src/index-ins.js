/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable no-new-func */
/* eslint-disable no-shadow */
// sam here
import { getBuiltinConfig, getCliFlags } from '@ymc/cli-param'
import paeseArgs from '@ymc/nano-parse'
import { baseParam } from '@ymc/cli-preset-param'
import { log, blue } from './index-too'
import getDstDir from './index'

const option = {
    excludes: ['dist', 'lib', 'libtpl-rollup-plugins', 'vagrant']
}
function param() {
    return [
        ...baseParam(),
        {
            name: '--find-in-dir',
            type: 'string',
            value: './',
            desc: 'the location to find'
        },
        {
            name: '--mode',
            type: 'string',
            value: '',
            desc: 'the mode how to find, file | file_text'
        },
        {
            name: '--regexp',
            type: 'regexp',
            value: '',
            desc: 'the regexp to match file path'
        },
        {
            name: '--desc',
            type: 'string',
            value: '',
            desc: 'the desc for the task'
        },
        {
            name: '--file-text-regexp',
            type: 'regexp',
            value: '',
            desc: 'the regexp to match file text'
        },
        {
            name: '--exclude',
            type: 'string',
            value: 'dist|lib|libtpl-rollup-plugins|vagrant',
            desc: 'the loc of no finding'
        }
    ]
}
function runsam(cnf) {
    // log(blue(cnf.desc))
    log(`[task] ${cnf.desc}`)
    // let opt = {
    //     ...option,
    //     ...cnf
    // }
    // option.mode = cnf.mode
    // option.regexp = cnf.regexp
    const res = getDstDir(cnf.loc, cnf)
    log(res)
}
function conf(opts) {
    return { ...option, ...opts }
}
function mainold() {
    const sams = {}
    // find file path
    sams['get-hzh-sh'] = conf({
        loc: 'D:\\code-store',
        mode: 'file',
        regexp: /hzh.*\.sh$/gi,
        desc: 'get dst file: the file that file text with hzh and name ends with .sh'
    })

    sams['get-fav-js'] = conf({
        loc: 'D:\\code-store',
        mode: 'file',
        regexp: /fav.*\.js$/gi,
        desc: 'get dst file: the file that name with fav and ends with .js'
    })
    sams['get-copy-js'] = conf({
        loc: 'D:\\code-store',
        mode: 'file',
        regexp: /copy.*\.js$/gi,
        desc: 'get dst file: the file that name with copy and ends with .js'
    })

    // find dir
    sams['get-space-dir'] = conf({
        loc: 'F:\\bilibili-dance',
        mode: '',
        regexp: / +/gi,
        desc: 'get dst dir: the dirs that with empty space'
    })
    sams['get-nodemodule-dir'] = conf({
        loc: 'D:\\code-store',
        mode: '',
        regexp: /node_modules/gi,
        desc: 'get dst dir: node_modules'
    })

    sams['get-ycs-file'] = conf({
        loc: 'H:\\js-project',
        mode: 'file_text',
        fileTextRegexp: /ycs/gi,
        desc: 'get dst file: the file that file text with ycs and name ends with .js'
    })

    let cnf
    cnf = sams['get-hzh-sh']
    runsam(cnf)
}
function getRegFromCli(s) {
    // s = '/ycs/gi'
    let res = s
    if (res) {
        res = res.replace(/^\\/, '') // escape regexp the first / in cli
        return new Function(`return ${res}`)()
    }
    return ''
}
function makeDescFromOpt(options = {}) {
    let res
    if (options.mode === '') {
        res = 'get dst dir:'
        res = `${res} with file-path reg ${options.regexp} in loc ${options.findInDir}`
    } else if (options.mode === 'file') {
        res = 'get dst file:'
        res = `${res} with file-path reg ${options.regexp} in loc ${options.findInDir}`
    } else {
        res = 'get dst file:'
        res = `${res} with file-path reg ${options.regexp} file-text reg ${options.fileTextRegexp} in loc ${options.findInDir}`
    }
    return res
}
function main(options = {}) {
    const option = {
        ...getBuiltinConfig(param()),
        ...getCliFlags(options)
    }
    // log(option)
    // set exclude to array
    option.excludes = option.exclude.split(/ |\||,/gi)

    // set cli-str to js-regexp from cli
    option.regexp = getRegFromCli(option.regexp)
    option.fileTextRegexp = getRegFromCli(option.fileTextRegexp)
    option.excludesRegexp = getRegFromCli(option.excludesRegexp)

    // set desc
    // desc: `get dst file: the file that name with copy and ends with .js`
    option.desc = makeDescFromOpt(option)
    option.loc = option.findInDir

    log(option)
    runsam(option)
}

main(paeseArgs(process.argv))
// log(getRegFromCli())
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
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/read-diretory/src/index-ins.js
// task:get-lod-code:txt-to-audio
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/read-diretory/src/index-ins.js --mode="file" --find-in-dir="D:\\code-store\\nodejs" --regexp="\/.*bd.*.js$/ig"
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/read-diretory/src/index-ins.js --mode="file_text" --find-in-dir="D:\\code-store\\nodejs" --regexp='\/.js$/ig' --file-text-regexp="\/i love you/ig" --excludes-regexp="\/.zip$/ig"
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/read-diretory/src/index-ins.js --mode="file_text" --find-in-dir="D:\\code-store\\nodejs" --regexp='\/.js$/ig' --file-text-regexp="\/md/ig"
