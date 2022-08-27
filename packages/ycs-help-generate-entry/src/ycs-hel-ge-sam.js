import GE from './ycs-hel-ge-api.js'

const { log } = console
// idea: define usage likes below
const defUsage = (ns = 'ns') => {
  const msg = `ini pkg for npm repo
  mgnt des file
  usage:ns [subcmd] [option]
    ${ns} put --key npm-bin --value ./bin/index.js
    ${ns} -h
    ${ns} -v

  subns:eslint|jest|babel|tsc

  subcmd:add|del|put
    add - add des file
    del - del des file
    put - put des file
  option:
    -l,--loc the des file location
    -h,--help get help
    -v,--version get version
`
  return msg
}
// idea: write usage (todo)
// it.subcmd().option().bindcmdToOption().makeComUsage().makeCmdUsage().makeNsUsage()
// bindCmdToNs()
// it.ns('eslint').cmd('add|del|get')

// idea: usage to option
const getTxtFromUsage = (s, usage = '') => {
  const regexp = new RegExp(` *${s}:.*`, 'ig')
  const match = usage.match(regexp)
  if (match) {
    return match[0].replace(new RegExp(` *${s}:`, 'i'), '')
  }
  return ''
}

const genOptionFromUsage = (ns = 'npm-bin', version = '1.0.0', usage = '') => {
  let option = {}
  option = {
    ...option,
    ...{
      version,
      ns,
      autoSubCmd: getTxtFromUsage('subcmd', usage),
      autoSubNs: getTxtFromUsage('subns', usage)
    }
  }
  return option
}

// feat: use built in flags
const builtinFlags = { key: 'npm-bin', value: 'bin/index.js', loc: 'package.json' }

// idea:cli-fy api to cli with ymc style
const entrys = (flags = {}) => {
  // log nano parser result 's flags (flags vs _ vs extras)
  // log(flags)
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

const ns = 'ini-pkg'
const usage = defUsage(ns)
const option = genOptionFromUsage(ns, '1.0.0', usage)

entrys.usage = usage
entrys.option = option
// entrys.autoSubCmd= usage.match(/subcmd:.*/ig)[0]

// feat: enable zero option
// entrys.log.enableZeroOption=true
// entrys.cls.enableZeroOption=true
entrys.enableZeroOption = true
export default entrys

// opv:
// 1. check this file js syantx
// node script/ycs-hel-ge-sam.js
