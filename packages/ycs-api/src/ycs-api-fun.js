/* eslint-disable consistent-return */
import nanoparse from './nano-parse'
import entrys from './ycs-ins'

// idea:
// get args from cli
// parse nano args

// feat: support subcmd alias (todo)

const { log } = console

const run = () => {
  const input = process.argv

  // idea: extract share var
  let helpmsg = 'usage:ns option'
  let argvIndexS = 2 // argv index start position
  let enbaleSubCmd = false
  let subcmd = ''
  const allowAutoSubCmd = true
  let autoSubCmd = 'add|del|get|put'
  let version = '1.0.0'
  // let ns = getRelScriptFileName()
  const ns = 'npm-bin'

  let enbaleSubNs = false
  let subns = ''
  const allowAutoSubNs = true
  let autoSubNs = 'npm|lerna|yarn|pnpm|eslint|babel|postcss|ts'

  // likes docker,npm

  // idea: input format is 'ns [subcmd] [option]'
  // option is argv

  // feat: auto check sub ns enable
  if (!enbaleSubNs && allowAutoSubNs && autoSubNs) {
    autoSubNs = Array.isArray(autoSubNs) ? autoSubNs : autoSubNs.split('|')
    enbaleSubNs = autoSubNs.includes(input[argvIndexS])
  }

  // feat: support sub ns
  if (enbaleSubNs) {
    subns = input[argvIndexS]
    argvIndexS += 1 // fix Unary operator '++' used
    helpmsg = helpmsg.replace(/option$/, 'subns option')
  }

  // feat: auto check sub cmd enable
  if (!enbaleSubCmd && allowAutoSubCmd && autoSubCmd) {
    autoSubCmd = Array.isArray(autoSubCmd) ? autoSubCmd : autoSubCmd.split('|')
    enbaleSubCmd = autoSubCmd.includes(input[argvIndexS])
  }

  // feat: support sub cmd
  if (enbaleSubCmd) {
    // subcmd = input[2]
    subcmd = input[argvIndexS]
    argvIndexS += 1 // fix Unary operator '++' used
    // helpmsg=`usage:ns subcmd option`
    helpmsg = helpmsg.replace(/option$/, 'subcmd option')
  }

  // feat: get usage,entry,version
  // helpmsg is alias of usage
  let entry = entrys
  helpmsg = entrys.usage

  if (enbaleSubNs && subns) {
    if (!entry[subns]) {
      log(`${helpmsg}`)
      log(`todo:subns:${subns}`)
      // process.exit(1)
      return
    }
    // log(`run subns ${subns}`)
    helpmsg = entry[subns].usage ? entry[subns].usage : helpmsg // fix 'usage' is not defined
    version = entry[subns].version ? entry[subns].version : version
    entry = entry[subns] ? entry[subns] : () => {}
  }

  if (enbaleSubCmd && subcmd) {
    if (!entry[subcmd]) {
      log(`${helpmsg}`)
      log(`todo:subcmd:${subcmd}`)
      // process.exit(1)
      return
    }
    // log(`run subcmd ${subcmd}`)
    helpmsg = entry[subcmd].usage ? entry[subcmd].usage : helpmsg // fix 'usage' is not defined
    version = entry[subcmd].version ? entry[subcmd].version : version
    entry = entry[subcmd] ? entry[subcmd] : () => {}
  }
  // helpmsg=defUsage()

  // feat: check argv length
  const invalidArgvLength = input.length <= argvIndexS
  if (invalidArgvLength) {
    log(`${helpmsg}`)
    log('error:invalid argv length')
    return
  }

  // feat: parse nano argv
  // let [,,...sinput ] = input
  // let sinput = input.slice(2)
  const sinput = input.slice(argvIndexS)

  // flags vs _ vs extras
  const argv = nanoparse(sinput)
  // log(sinput)
  // log(argv)
  const option = argv.flags

  // feat: support log flags,_,and extras
  if (option.debugArgs || option.da) {
    // log(argv.flags)
    // log(argv._)
    // log(argv.extras)
    log(argv)
  }

  // feat: support out version
  if (option.version || option.v) {
    log(`${ns} version:${version}`)
    return
  }

  // feat: support out help
  if (option.help || option.h) {
    log(`${helpmsg}`)
    return
  }

  // feat: support run main
  // let entry = entrys
  // if(enbaleSubCmd && subcmd){
  //   log(`run subcmd ${subcmd}`)
  //   entry=entrys[subcmd]?entrys[subcmd]:()=>{}
  // }
  // flags,_,extras
  // option is alias of flags
  return entry(option)
  // fix  Arrow function expected no return value
}
export default run

// usage:
// 1. check syt
// node script/ycs-api.js
