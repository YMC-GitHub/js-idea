import GE from './ycs-hel-ge-api.js'
import genOptionFromUsage from './ycs-hel-uo.js'

//(GE,genOptionFromUsage)=>{}

const { log } = console
// idea: define usage likes below
const defUsage = (ns = 'ns') => {
  const msg = `cnf gen for ymc repo
  mgnt .ymcrc.json file
  usage:ns [subcmd] [option]
    ${ns} -h
    ${ns} -v

  subcmd:add|del|get|put|cls|log
    add - add des file
    del - del des file
    get - get des file
  option:
    -n,--name cnf file name
    -w,--wkd use working dir
    -u,--usd use user dir
    -c,--crd use current dir
    -h,--help get help
    -v,--version get version
`
  return msg
}

// feat: use built in flags
const builtinFlags = { name: '.ymcrc.json', wkd: true, usd: false, crd: true }

// idea:cli-fy api to cli with ymc style
const entrys = (flags = {}) => {
  // log nano parser result 's flags (flags vs _ vs extras)
  // log(flags)
  log(`hello ns`)
}
// 1. gen cmd fun
const defFun =
  (cmd = 'add') =>
  (flags = {}) => {
    // flags = { ...builtinFlags, ...flags }
    // comEntry(cmd, flags)
    log(`hello ${cmd}`)
  }
// 2. bind cmd fun
const ge = new GE()
// ge.entrys(entrys).bind('add|get|del|put|cls|log',defFun,'call')
// ge.entrys(entrys).bind('add|del|put',defFun,'call')

ge.entrys(entrys).bind('eslint|jest|babel|tsc', defFun, 'call')
// log(entrys)

// entrys.add = (flags = {}) => {
//   flags = { ...builtinFlags, ...flags }
//   comEntry('add', flags)
// }
// entrys.del = (flags = {}) => {
//   flags = { ...builtinFlags, ...flags }
//   comEntry('del', flags)
// }
// entrys.get = (flags = {}) => {
//   flags = { ...builtinFlags, ...flags }
//   let data = comEntry('get', flags)
//   let key, value
//   key = flags.k || flags.key
//   value = data.bin[key]
//   log(`${key} ${value}`)
// }
// entrys.put = (flags = {}) => {
//   flags = { ...builtinFlags, ...flags }
//   comEntry('put', flags)
// }
// entrys.cls = (flags = {}) => {
//   flags = { ...builtinFlags, ...flags }
//   comEntry('cls', flags)
// }

// entrys.log = (flags = {}) => {
//   flags = { ...builtinFlags, ...flags }
//   comEntry('log', flags)
// }

const ns = 'jcm'
const usage = defUsage(ns)
const option = genOptionFromUsage(ns, '1.0.0', usage)

entrys.usage = usage
entrys.option = option

// feat: enable zero option
// entrys.log.enableZeroOption=true
// entrys.cls.enableZeroOption=true
entrys.enableZeroOption = true
entrys.notOnlyFlags = true
export default entrys

// opv:
// 1. check this file js syantx
// node script/jcm-clify.js

// 2.
// jcm user.name --des=packages/noop -c -u -w --name=.ymcrc.json
// jcm user.name ymc --des=packages/noop -c -u -w --name=.ymcrc.json

// node script/jcm-cli.js user.name --des=packages/noop -c -u -w --name=.ymcrc.json --debugArgs
// node script/jcm-cli.js user.name ymc --des=packages/noop -c -u -w --name=.ymcrc.json --debugArgs
