/* eslint-disable no-unused-vars,prefer-destructuring,prefer-const,class-methods-use-this */
// idea:
// def-option -> use-option -> to-string -> get-option-val

import { paramJsonToString, getValFromParam, camelizeFlags } from '@ymc/cli-param'
// import { stylizeFlags} from "@ymc/cli-flags";
import { camelize, padEndString } from '@ymc/extend-string'

const { log } = console

/**
 * get val by ns with default value
 * @param {{}} map
 * @param {string} ns
 * @param {*} def
 * @returns
 */
function getMapPathValue(map, ns, def = {}) {
    // fix no-param-reassign
    let res
    //   map[ns] = map[ns] ? map[ns] : def
    res = map[ns] ? map[ns] : def
    return res
}

/**
 * get cli ctx by ns and cmd in store
 * @param {{}} optionMap
 * @param {string} ns
 * @param {string} cmd
 * @returns
 * @description
 * ```
 * ## task
 * - [x] get ctx when ns and cmd
 * - [x] get ctx when ns
 * - [x] get ctx when no ns and cmd
 * ```
 */
function getMap(optionMap, ns = '', cmd = '') {
    let map = optionMap
    if (ns && cmd) {
        map = getMapPathValue(map, ns)
        map = getMapPathValue(map, cmd)
        // optionMap[ns]=optionMap[ns]?optionMap[ns]:{}
        // optionMap=[ns]
        // optionMap[cmd]=optionMap[cmd]?optionMap[cmd]:{}
        // optionMap=[cmd]
    } else if (ns) {
        map = getMapPathValue(map, ns)
    } else if (cmd) {
        map = getMapPathValue(map, cmd)
    }
    return map
}

/**
 * wrap option with name and desc
 * @param {string} name
 * @param {string} desc
 * @returns {string}
 */
function wrapOptionNameDesc(name, desc) {
    return `${name} ${desc}`
}

/**
 * get option name - short or long - in option-name-desc text
 * @param {string} desc
 * @param {string} nameType
 * @returns {string}
 */
function getCliOptionName(desc = '', nameType = 'l') {
    // idea: get l or loc as name
    // get -l,--loc
    // get l or loc
    let keys = ''
    keys = desc
        .split(' ')[0]
        .split(',')
        .map(v => v.replace(/^-*/gi, '')) // Unnecessary escape character: \-

    switch (nameType.toLowerCase()) {
        case 's':
            keys = keys[0]
            break
        case 'l':
        default:
            // feat: if not l , use s
            if (!keys[1]) {
                keys = keys[0]
            } else {
                keys = keys[1]
            }
            break
    }
    return keys
}

/**
 * format option usage - add some space as prefix of each line
 * @param {string|string[]} text
 * @param {string} prefix
 * @param {string} count
 * @returns {string}
 */
function formatOptionText(text, prefix = '', count = 2) {
    let res
    res = Array.isArray(text) ? text : [text]
    return res.join('\n').replace(/^/gim, Array(count).fill(prefix).join(''))
}

/**
 * beauty option usage - add some space between name and description
 * @param {string|string[]} text
 * @returns {string[]}
 */
function beautyOptionText(text) {
    let list = Array.isArray(text) ? text : [text]

    // get option name length
    const max = Math.max(...list.map(line => line.split(' ')[0].length))
    list = list.map(line => {
        const arr = line.split(' ')
        let name = arr[0]
        const desc = arr.slice(1)
        name = padEndString(name, max + 6, ' ')
        return `${name}${desc.join(' ')}`
    })
    // log(max)
    return list
    // padding suffix space
}

/**
 * get text from cli usage - subns ,subcmd
 * @param {string} keyword
 * @param {string} usage
 * @returns {string}
 */
function getTxtFromUsage(keyword, usage = '') {
    const regexp = new RegExp(` *${keyword}:.*`, 'ig')
    const match = usage.match(regexp)
    if (match) {
        return match[0].replace(new RegExp(` *${keyword}:`, 'i'), '')
    }
    return ''
}

/**
 * update entry option
 * @param {{[string]:any}} entryOption
 * @param {string} ns
 * @param {string} version
 * @param {string} usage
 * @returns
 * @description
 * ```
 * ## task
 * - [x] set ns and it's version
 * - [x] set auto subcmd
 * - [x] set auto subns
 * ```
 */
function updateEntryOption(entryOption = {}, ns = 'npm-bin', version = '1.0.0', usage = '') {
    let option = {}
    option = {
        ...entryOption,
        ...{
            version,
            ns
        }
    }
    // set auto sub ns or cmd with usage
    if (usage) {
        option = {
            ...{
                autoSubCmd: getTxtFromUsage('subcmd', usage),
                autoSubNs: getTxtFromUsage('subns', usage)
            }
        }
    }
    return option
}

// idea:easier,faster to write ycs-cli usage when you clify your lib to ycs-cli
// add or get option
// bind option to ns or cmd
// make usage text with option
//
// bo.addOpt().getOpt().bind(cmd)
// bo.addOpt().getOpt().bind(ns)
// bo.addOpt().getOpt().bind(subns,subcmd)
// bo is short for bind-option
/**
 * @description
 * ```
 * ## why use?
 * - [x] write cli option in node.js
 * - [x] when many options is the same in subcmd or other cmd
 * ```
 * @sample
 * ```
 * //bo is short for bind-option
 * const bo = new CliOptionHelp();
 * //define option
 * bo.addOpt(`-l,--loc the des file location`);
 * bo.addOpt(`-h,--help get help`);
 * bo.addOpt(`-v,--version get version`);
 *
 * // feat:bind option to another subns,subcmd
 * bo.getOpt("loc").bindOpt("eslint", "add");
 *
 * // logMap()
 * // log(getMap(bo.optionMap))
 * // feat:option to usage
 * log(bo.usage());
 * // log(bo.usage('eslint','add'))
 * ```
 */
class CliOptionHelp {
    constructor() {
        this.init()
    }

    init() {
        this.optionMap = {}
        this.opt = ''
        this.relationMap = {}
        this.cmd = new Set()
        this.ns = new Set()
        this.paramMap = {}
        return this
    }

    // get(name,ns='',cmd=''){
    //   this.opt=getOpt(name,ns,cmd)
    //   return this
    // }
    /**
     * add option
     * @param {string} text
     * @param {string} ns
     * @param {string} cmd
     * @returns {this}
     * @description
     * ```
     * ## task
     * - [ ] add option to global scope ns when no ns and cmd
     * - [ ] add option to ns scope when ns and no cmd
     * - [ ] add option to cmd scope when ns and cmd
     * - [x] add option store and set relation
     * - [x] add ns and cmd to store
     * ```
     */
    addOpt(text = '', ns = '', cmd = '') {
        const { optionMap, relationMap } = this
        const name = getCliOptionName(text)

        // log(`add option ${name}`)
        let map = optionMap
        map[name] = text

        // log(`add relation ${name}`)
        map = getMap(relationMap, ns, cmd)
        map[name] = true

        // log(`label ns and cmd`)
        this.cmd.add(cmd)
        this.ns.add(ns)
        return this
    }

    /**
     * set current option with option name  - bind to ctx.opt
     * @param {string} name
     * @param {string} ns
     * @param {string} cmd
     * @returns {this} return this to chain
     */
    getOpt(name, ns = '', cmd = '') {
        const { optionMap, relationMap } = this
        const map = optionMap
        // map = getMap(optionMap,ns,cmd);
        this.opt = map[name]
        return this
    }

    /**
     * log current option
     * @returns {this} return this to chain
     */
    logOpt() {
        log(this.opt)
        return this
    }

    /**
     * bind current option to ns and cmd - call ctx.addOpt
     * @param {string} ns
     * @param {string} cmd
     * @returns {this} return this to chain
     */
    bindOpt(ns = '', cmd = '') {
        // log(`bind option to ns or cmd`)
        this.addOpt(this.opt, ns, cmd)
        return this
    }

    // {ns:string,cmd:string,beauty:boolean}
    /**
     * get option usage text for root ,ns or cmd
     * @param {string} ns
     * @param {string} cmd
     * @returns {string}
     * @description
     * ```
     * ## task
     * - [x] get gloal scope option text when no ns and no cmd
     * - [x] get ns scope option text when only ns
     * - [x] get cmd scope option text when ns and cmd
     * ```
     */
    usage(ns = '', cmd = '') {
        const { optionMap, relationMap } = this
        let map
        // log(`get relation`)
        map = getMap(relationMap, ns, cmd)

        // log(`get option name`)

        let optNameList
        optNameList = Object.keys(map)
        // feat: filter cmd
        optNameList = optNameList.filter(name => !this.cmd.has(name))
        // feat: filter ns
        optNameList = optNameList.filter(name => !this.ns.has(name))
        // optNameList=optNameList.join(`\n`)

        // idea: option part
        let opts
        map = optionMap
        opts = Object.keys(map)
            .filter(name => optNameList.includes(name))
            .map(name => map[name])

        // log(`[info] info option usage`)
        opts = beautyOptionText(opts)
        // log(opts)

        opts = formatOptionText(opts, ' ', 2)
        opts = `option:\n${opts}`
        // opts=getFormatOptStr(opts,' ',2)

        let subns = [...this.ns].filter(v => v.trim()).join('|')
        subns = subns ? `subns:${subns}` : ''

        // log([...this.cmd].filter(v=>v.trim()))
        let subcmd = [...this.cmd].filter(v => v.trim()).join('|')
        subcmd = subcmd ? `subcmd:${subcmd}` : ''

        let usage = 'usage:{ns} [option]'
        if (subns) {
            usage = usage.replace(/\[option\]$/, '[subns] [option]')
        }
        if (subcmd) {
            usage = usage.replace(/\[option\]$/, '[subcmd] [option]')
        }

        if (subcmd) {
            opts = `${subcmd}\n${opts}`
        }
        if (subns) {
            opts = `${subns}\n${opts}`
        }
        opts = formatOptionText(opts, ' ', 2)
        if (usage) {
            opts = `${usage}\n${opts}`
        }
        // opts=getFormatOptStr(opts,' ',2)
        // this.usagemsg =opts
        return opts
    }

    // name,type,value,desc
    /**
     * add option by param (json-param) - call ctx.addOpt
     * @param {{name:string,type:string,value:*,desc:string}[]} list
     * @param {string} ns
     * @param {string} cmd
     * @description
     * ```
     * ## task
     * - [x] save param to param store
     * - [x] call ctx.addOpt
     * ```
     */
    param(list, ns = '', cmd = '') {
        const { paramMap } = this
        list.forEach(v => {
            // store param item
            if (!paramMap[v.name]) paramMap[v.name] = v
            // to option item
            const { name, type, value, desc } = v
            this.addOpt(`${name} ${desc}`, ns, cmd)
            // to builtIn confg
        })
        return this
    }

    /**
     * get built in config - by param - get val from param
     * @param {getBuiltinFlagsOption} options
     * @returns {{[string]:string|number|boolean}}
     */
    getBuiltinConfig(options = {}) {
        const { paramMap } = this
        return getValFromParam(paramMap, options)
    }

    getCliFlags(flags, options = {}) {
        let cliFlags
        const { entrys } = options
        if (flags.flags || (entrys && entrys.notOnlyFlags)) {
            cliFlags = flags.flags
        } else {
            cliFlags = flags
        }
        return camelizeFlags(cliFlags, options)
    }

    getCurrentFlags(flags, options = {}) {
        const builtinFlags = this.getBuiltinFlags()
        let nowFlags
        const cliFlags = this.getCliFlags(flags, options)
        nowFlags = { ...builtinFlags, ...cliFlags }
        nowFlags = camelizeFlags(nowFlags, options)
        return nowFlags
    }

    /**
     * camelize param-json - nano-parser-flags
     * @param {object} flags
     * @param {camelizeFlagsOption} options
     * @returns
     */
    camelizeFlags(flags = {}, options = {}) {
        // return camelizeFlags(...args);
        return camelizeFlags(flags, options)
    }

    /**
     * update entry-option by ctx.usagemsg - call updateEntryOption
     * @param {{}} entryOption
     * @param {string} ns
     * @param {string} version
     * @returns {{}}
     * @description
     * ```
     * ## task
     * - [x] set entry 's ns
     * - [x] set entry 's version
     * - [x] set entry 's autoSubns and autoSubCmd
     * ```
     */
    updateEntryOption(entryOption, ns = 'npm-bin', version = '1.0.0') {
        const { usagemsg } = this
        return updateEntryOption(entryOption, ns, version, usagemsg)
    }
}
const cliOptionHelp = new CliOptionHelp()
export {
    //   getMapPathValue,
    //   getMap,
    //   wrapOptionNameDesc,
    getCliOptionName,
    formatOptionText,
    beautyOptionText,
    getTxtFromUsage,
    updateEntryOption,
    CliOptionHelp,
    cliOptionHelp
}
