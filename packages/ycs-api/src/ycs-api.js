import nanoparse from './nano-parse.js'
// import entrys from './ycs-ins.js';
import { defOption } from './ycs-too.js'
// feat: support subcmd alias (todo)

// idea: extract function to class
// it.ns().version().entry().autosubcmd().autosubns().run()

const { log } = console

class Ycs {
  constructor() {
    this.option = defOption()
  }

  ns(s = 'ns') {
    this.option.ns = s
    return this
  }

  version(s = '1.0.0') {
    this.option.version = s
    return this
  }

  entry(o = {}) {
    this.option.entrys = o
    return this
  }

  autosubcmd(s = '') {
    this.option.autoSubCmd = s
    return this
  }

  autosubns(s = '') {
    this.option.autoSubNs = s
    return this
  }

  nanoparse(f = () => {}) {
    this.option.nanoparse = f
    return this
  }

  run(input) {
    // let input = process.argv

    // idea: extract share var
    let {
      entrys,
      helpmsg,
      argvIndexS,
      enbaleSubCmd,
      subcmd,
      allowAutoSubCmd,
      autoSubCmd,
      version,
      // ns ,
      ns,
      enbaleSubNs,
      subns,
      allowAutoSubNs,
      autoSubNs
    } = this.option

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
      argvIndexS++
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
      argvIndexS++
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
      helpmsg = entry[subns].usage ? entry[subns].usage : helpmsg
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
      helpmsg = entry[subcmd].usage ? entry[subcmd].usage : helpmsg
      version = entry[subcmd].version ? entry[subcmd].version : version
      entry = entry[subcmd] ? entry[subcmd] : () => {}
    }
    // helpmsg=defUsage()

    // feat: check argv length
    let invalidArgvLength = input.length <= argvIndexS

    if (entrys.enableZeroOption) {
      invalidArgvLength = input.length < argvIndexS
    }
    if (entry.enableZeroOption) {
      invalidArgvLength = input.length < argvIndexS
    }
    // if (enbaleSubNs && subns) {
    //   if (entry[subns] && entry[subns].enableZeroOption) {
    //     invalidArgvLength = input.length < argvIndexS
    //   }
    // }
    // if (enbaleSubCmd && subcmd) {
    //   if (entry[subcmd] && entry[subcmd].enableZeroOption) {
    //     invalidArgvLength = input.length < argvIndexS
    //   }
    // }

    if (invalidArgvLength) {
      log(`${helpmsg}`)
      log(`error:invalid argv length`)
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
    if (entrys.notOnlyFlags || entry.notOnlyFlags) {
      return entry(argv)
    }
    return entry(option)
  }
}
export default Ycs

// usage:
// 1. check syt
// node script/ycs-api.js
