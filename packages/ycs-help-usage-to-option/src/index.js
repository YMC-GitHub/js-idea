// idea: usage to option
// uo is short for usage-to-option
// get subns
// get subcmd
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

export { genOptionFromUsage as usageToOption, getTxtFromUsage }
