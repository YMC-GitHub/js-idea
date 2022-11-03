/* eslint-disable no-unused-vars,consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-case-declarations */
/* eslint-disable prefer-const */
/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */

import { joinPath, addDirs, readJson, saveJson, getUserHome } from './jcm-too'
import { Gsc, readConf } from './jcm-sha'

// const { log } = console

// idea:
// get des dir
// log msg
// load pkg json
// update pkg json

/**
 * @description
 * ```
 * idea:genreate config to des dir
 * make dir
 * mgnt cnf
 * ```
 */
function main(cmd = '', flags = {}) {
  // idea: get-cli-args -> get-wkd
  // get cli args and the first args is wkd
  const args = getArgs()
  const cliOption = {
    wkd: args[0],
    name: '.ymcrc.json'
  }
  const { wkd, name } = cliOption
  const cnfLocList = [joinPath(getUserHome(), name), name, joinPath(wkd, name)]
  // const cnfLocList = []
  // if (flags.usd || flags.u) {
  //   cnfLocList.push(joinPath(getUserHome(), name))
  // }
  // if (flags.crd || flags.c) {
  //   cnfLocList.push(name)
  // }
  // if (flags.wkd || flags.w) {
  //   cnfLocList.push(joinPath(wkd, name))
  // }

  let data = {}
  switch (cmd) {
    case 'add':
      // add
      // add to wkd dir
      // todo:it.writeConf(flags)
      data = magicDefineConfig(data)
      addDirs(wkd)
      const loc = joinPath(wkd, name)
      saveJson(loc, data)
      break
    case 'del':
      // del
      // todo:it.deleteConfFile(flags)
      break
    case 'get':
      return magicReadConfig(name)
    default:
      break
  }
  // addDirs(wkd)
  // delDirs(wkd)
  data = magicReadConfig(name)
  // idea: read config
  data = magicDefineConfig(data)
  // idea:
  // save-json-to-local
  // idea:add-wkd-diretory -> save-json-to-wkd-dir
  // addDirs(wkd)
  // let loc = joinPath(wkd, name)
  // saveJson(loc, data)

  /**
   * get cli args and the first args is wkd
   * @param {string} def
   * @returns {string[]}
   */
  function getArgs(def = 'packages/noop') {
    const args = process.argv.slice(2)
    if (args.length === 0) args[0] = def
    return args
  }
  /**
   * read config
   * @param {string} name
   * @returns {[]|{}}
   * @description
   * ```
   * user-path-> project-path -> des-path
   * ```
   */
  function magicReadConfig(name = '.ymcrc.json') {
    let data
    // const cnfLocList = [joinPath(getUserHome(), name), name, joinPath(wkd, name)]
    data = readConf(cnfLocList, readJson)
    return data
  }
  /**
   * @param {{}} data
   * @description
   * ```
   * ## why use?
   * - [x] easy to write json config in node.js
   *
   * - [x] idea: bind-cache-data -> define-json-data
   * ```
   */
  function magicDefineConfig(data) {
    const gsc = new Gsc()
    gsc.bind(data)
    // preset - 1. set spilt char different with key 2. use one level
    gsc.split('/')
    gsc.conf('npm.user', 'hualei')
    gsc.conf('git.user.name', 'ymc-github')
    gsc.conf('git.user.email', 'ymc.github@gmail.com')
    gsc.conf('git.remote', 'github')
    gsc.conf('github.enable', true)
    gsc.conf('github.user.name', 'ymc-github')
    // gsc.conf('github.user.email','ymc.github@gmail.com')
    gsc.conf('github.repo.name', 'sam')
    gsc.conf('gitlab.enable', true)

    gsc.conf('npm.scope', 'sam')
    gsc.conf('npm.pkg', 'sam')
    gsc.conf('is.monorepo', true)
    gsc.conf('is.monorepo.root', true)
    // gsc.conf(key,val)
    return gsc.data
  }
}
// main()
export { main }
// run as node script
// node script/conf-gen.js ./packages/noop
// node script/conf-gen.js packages/noop

// node script/conf-gen.js --des=packages/noop -c -u -w --name=.ymcrc.json
// idea: json conf mgnt
// jcm is short for json conf mgnt

// case - 1. set cnf
// jcm user.name ymc
// case - 1. get cnf
// jcm user.name

// case - 1. get cnf 2. set data file name
// jcm user.name --name=.ymcrc.json

// case - 1. set cnf 2. set data file dir 3. use current dir 4. use des dir 5. use user dir
// jcm user.name ymc --des=packages/noop -c -u -w --name=.ymcrc.json

// node script/jcm-ins.js
