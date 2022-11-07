/* eslint-disable prefer-const,no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */

// import { existsSync, readdirSync, statSync, rmSync } from 'fs'
// import { resolve, relative, join as joinPath, dirname } from 'path'
import './types'
// import { exec, execOpts } from '@ymc/run-bash'
import { textstream } from '@ymc/text-stream-io'
// import getFilelist from '@ymc/get-file-list'
// import getNodeBuitInModule from '@ymc/get-node-builtin-modules'
import { join as joinPath, dirname } from './mock'

const { log } = console
// @ymc/get-obj-only-selected-keys
/**
 * get obj only selected keys
 * @param {{}} data
 * @param {string} keys
 * @param {string|regexp} sc
 * @returns {{}}
 * @sample
 * ```
 * selectDataKeys(option, 'commentReg, ignoreComment')
 * selectDataKeys(option, '{text:filetext,commentReg, ignoreComment}')
 * ```
 */
function getObjOnlySelectedKeys(data, keys, sc = /,/) {
  let res = {}
  keys
    .replace(/^ +{|} +$/gi, '')
    .split(sc)
    .forEach(key => {
      // keys=''
      let [alias, name] = key
        .trim()
        .split(':')
        .map(v => v.trim())

      // get val by key
      let val = name ? data[name] : data[alias]
      if (val !== undefined) {
        // feat: set val bind new name
        if (!name) name = alias
        res[name] = val
      }
    })
  return res
}

// function deleteUndefiendKeys(option = {}) {
//     Object.keys(option).forEach(v => {
//         if (option[v] === undefined) {
//             delete option[v]
//         }
//     })
// }
// @ymc/get-obj-only-define-keys
/**
 * get obj only define keys
 * @param {{}} option
 */
function getObjOnlyDefinedKeys(option = {}) {
  let res = {}
  Object.keys(option).forEach(v => {
    if (option[v] !== undefined) {
      res[v] = option[v]
    }
  })
  return res
}

// @ymc/del-macthed-line
/**
 * del macthed line
 * @param {{}} options
 * @returns {string}
 */
function delMatchedLine(options = {}) {
  const option = {
    text: '',
    eof: '\n',
    deletedLabel: '# - DELETE',
    reg: /^#/,
    ...options
  }

  let { text, eof, reg, deletedLabel } = option
  // only work  one line
  // if (!Array.isArray(text)) {
  //     text = text.split(/\r?\n/)
  // }
  // text = text
  //     .map(line => {
  //         if (reg && reg.test(line)) {
  //             line = deletedLabel
  //         }
  //         return line
  //     })
  //     .filter(line => line != deletedLabel)

  // feat: set matched multi-line able
  text = text.replace(reg, deletedLabel)
  // desc: ignore deleted-label line
  if (!Array.isArray(text)) {
    text = text.split(/\r?\n/)
  }
  text = text.filter(line => line.indexOf(deletedLabel) >= 0)
  return text.join(eof)
}

// @ymc/del-comment,@ymc/comment-preset-js,@ymc/comment-preset-shell
/**
 * delete comment
 * @param {deleteCommentOption} options
 * @returns
 */
function delComment(options = {}) {
  const option = {
    text: '',
    ignoreComment: true,
    commentReg: [
      /\/\/.*/gi,
      // /\/\*+.*\*+\//gim,
      /(\/)([*])+(.|\n)+?(\2\1)/gi
    ],
    ...options
  }
  let { text, commentReg } = option
  // log(options, commentReg)
  // bugs:  space line at replace location
  if (option.ignoreComment) {
    // log(`[step] del-comment`);
    // https://www.codegrepper.com/code-examples/whatever/Regex+to+match+a+multiline+comment
    commentReg.forEach(reg => {
      text = text.replace(reg, '')
      // text = delLineByMatch({text,reg})
    })
  }
  return text
}
/**
 * del requries-exp path - for package.json-ed pkg
 * @param {string[]} list
 * @returns {string[]}
 */
function delRequriesExpPath(list) {
  return list.map(txt => {
    let to = 1
    let res = txt
    if (res.match(/^@/)) {
      to += 1
    }
    res = res.split(/\//).slice(0, to).join('/')
    return res
  })
}

// @ymc/get-requires-exp,@ymc/requires-exp-preset-js,@ymc/requires-exp-preset-hbs
/**
 * get requires expression - like js require,import , hbs include and other
 * @param {{text:string,requireReg:regexp[]}} options
 * @returns {string[]}
 */
function getRequriesExp(options = {}) {
  const option = {
    text: '',
    // ignoreComment: true,
    requireReg: [/require\(.*\)/gi, /from +("|').*("|')/gi, /import +("|').*("|')/gi],
    ...options
  }
  const { requireReg, text } = option
  let matchs

  // descx: get-origin-matched
  // log(`[step] get-origin-matched`);
  matchs = requireReg.map(reg => {
    let match
    match = text.match(reg)
    // log(`[debug] log match`);
    // log(match);
    return match
  })
  matchs = matchs.filter(v => v)
  matchs = matchs.flat(1)
  matchs = [...new Set(matchs)]

  // del-require-exp
  // get custom del-require-exp // todo
  // handle del-require-exp with custom handle when custom requireReg
  matchs = matchs.map(txt => {
    const to = ''
    let res = txt
    if (res.match(requireReg[0])) {
      res = res.replace(/require\(/, to).replace(/\)/, to)
    } else if (res.match(requireReg[1])) {
      res = res.replace(/from +/, to)
    } else if (res.match(requireReg[2])) {
      res = res.replace(/import +/, to)
    }
    res = res.replace(/^("|')/, to).replace(/("|')$/, to)
    // no-useless-escape \' \*
    // log(`[debug] log txt`);
    // log(res);
    return res
  })

  // del path
  matchs = delRequriesExpPath(matchs)
  return matchs
}

/**
 * get local deps - dep is project-pkg in mono repo
 * @param {{data:string[],localDepReg:regexp[]}} options
 * @returns {string[]}
 */
function getLocalDeps(options = {}) {
  const option = {
    data: [''],
    localDepReg: [/^\./, /@src/],
    ...options
  }
  const { localDepReg, data } = option
  let localDep
  // log(data, localDepReg)
  // localDep = data.filter(txt => {
  //     return localDepReg.some(reg => {
  //         log(reg.test(txt), reg, txt)
  //         return reg.test(txt)
  //     })
  // })
  localDep = data.filter(txt => localDepReg.some(reg => reg.test(txt)))
  // log(`[info] local dep`)
  // log(localDep)
  return localDep
}

/**
 * get out-of-project deps - dep is project-pkg in mono repo
 * @param {{data:string[],localDepReg:regexp[],disableLocalDepReg:boolean,localDep:string[],builintDep:string[]}} options
 * @returns {string[]}
 */
function getOutProjectDeps(options = {}) {
  const option = {
    localDep: [''],
    builintDep: [''],
    disableLocalDepReg: false,
    ...options
  }
  // get-out-lib-dep
  const { data, localDep, localDepReg, builintDep } = option

  let outlibdep
  outlibdep = [...data]

  // feat: exclude  local-dep deps
  // feat: find with localDepReg is optional , default enable
  // on,off vs disable,enable, vs no // short and semantic
  if (!option.disableLocalDepReg) {
    outlibdep = outlibdep.filter(txt => !localDepReg.some(reg => reg.test(txt)))
  }
  if (localDep) {
    // outlibdep = outlibdep.filter(txt => !localDep.some(ndp => txt === ndp))
    // outlibdep = excludeIt(outlibdep, localDep)
    outlibdep = excludeDep(outlibdep, localDep)
  }

  // feat: exclude  built-in deps
  if (builintDep) {
    // outlibdep = outlibdep.filter(txt => !builintDep.some(ndp => txt === ndp))
    // outlibdep = excludeIt(outlibdep, builintDep)
    outlibdep = excludeDep(outlibdep, builintDep)
  }
  return outlibdep

  function excludeDep(store, exclude) {
    const deps = exclude.filter(v => typeof v === 'string')
    return excludeIt(store, deps)
  }
  function excludeIt(store, ignore) {
    return store.filter(txt => !ignore.some(ndp => txt === ndp))
  }
}

// @ymc/mock-path,@ymc/mock-path-dirname,@ymc/mock-path-join,@ymc/mock-path-basename //todo
// @ymc/resolve-local-dep
/**
 * resolve local dep
 * @param {{data:string[],skipResolveReg:regexp[],fileloc:string}} options
 * @returns  {string[]}
 */
function resolveLocalDep(options = {}) {
  const option = {
    data: [''],
    skipResolveReg: [/^@private-pkgs/, /^@/],
    ...options
  }
  const { skipResolveReg, fileloc } = option
  let localdep = [...option.data]
  localdep = localdep.map(dep => {
    if (skipResolveReg.some(reg => reg.test(dep))) {
      return dep
    }
    // if (/^@private-pkgs/.test(dep)) {
    //     return dep
    // }

    // if (/^@/.test(dep)) {
    //     return dep
    // }
    let abs = joinPath(dirname(fileloc), dep)
    // \ to /
    abs = abs.replace(/\\/gi, '/')
    return abs
  })
  return localdep
}

// @ymc/dep-parse,@ymc/dep-tree
// @ymc/get-file-dep
// @ymc/add-file-dep

export {
  log,
  textstream,
  getObjOnlySelectedKeys,
  getObjOnlyDefinedKeys,
  delMatchedLine,
  delComment,
  getRequriesExp,
  getLocalDeps,
  getOutProjectDeps,
  resolveLocalDep
  // getNodeBuitInModule,
  // getFilelist
}
