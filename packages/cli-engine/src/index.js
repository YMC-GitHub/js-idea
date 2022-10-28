/* eslint-disable no-unused-vars, class-methods-use-this , import/prefer-default-export */
import { CliOptionHelp } from '@ymc/cli-option'
import { paramJsonToString, getValFromParam, camelizeFlags, getBuiltinConfig, getCliFlags } from '@ymc/cli-param'
// import argsParser from "./cli-parser.js";
import argsParser from '@ymc/nano-parse'
import { YcsRunner, ycsRunner } from '@ymc/cli-runner'
// import { stylizeFlags} from "./cli-flags.js";
import { defEntry, bindCmdToEntry, runEntry } from '@ymc/cli-entry'

class YcsNext {
  constructor() {
    this.init()
  }

  init() {
    this.too = new CliOptionHelp()
    this.data = {}
    this.ycs = new YcsRunner()
    this.ycs.nanoparse(argsParser)
    return this
  }

  param(list) {
    const { too } = this
    too.param(list)
    return this
  }

  usage(...args) {
    const { too, data } = this
    data.usage = too.usage(...args)
    return this
  }

  option(entryOption, ns, version) {
    const { too, data } = this
    data.option = too.updateEntryOption(entryOption, ns, version)
    return this
  }

  /**
   * define entry
   * @param {()=>{}} handle
   * @param {*} settings
   * @returns
   */
  entry(handle, settings = {}) {
    const { data, ycs } = this
    data.entry = defEntry(handle, {
      ...{ usage: data.usage, option: data.option, ...settings }
    })
    // log(data.entry,data.usage)
    // ycs.entry(data.entry);
    return this
  }

  run() {
    const { data, ycs } = this
    // runEntry(data.entry);
    // ycs.nanoparse(argsParser).entry(data.entry)
    ycs.entry(data.entry)
    ycs.run(process.argv)
  }

  new() {
    return new YcsNext()
  }

  /**
   * camelize param-json - nano-parser-flags
   * @param {object} flags
   * @param {{}} options
   * @returns
   */
  camelizeFlags(flags = {}, options = {}) {
    // let { too } = this;
    // return too.getBuiltinConfig(flags,options);
    // return camelizeFlags(...args);
    return camelizeFlags(flags, options)
  }

  getBuiltinFlags(...args) {
    const { too } = this
    return too.getBuiltinConfig(...args)
  }

  getCurrentFlags(...args) {
    const { data, ycs } = this
    const builtinFlags = this.getBuiltinFlags()
    let nowFlags
    const cliFlags = this.getCliFlags(args[0], args[1])
    nowFlags = { ...builtinFlags, ...cliFlags }
    nowFlags = this.camelizeFlags(nowFlags, args[1])
    return nowFlags
  }

  getCliFlags(flags, options = {}) {
    const { data } = this
    const entrys = data.entry
    return getCliFlags(flags, { ...options, entrys })
  }
}

const ycs = new YcsNext()
export { ycs }
