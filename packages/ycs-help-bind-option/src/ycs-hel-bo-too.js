/* eslint-disable prefer-destructuring,prefer-const */
export const { log } = console

export const getOptName = (s = '', t = 'l') => {
    // idea: get l or loc as name
    // get -l,--loc
    // get l or loc
    let keys = ''
    keys = s
        .split(' ')[0]
        .split(',')
        .map(v => v.replace(/^-*/gi, '')) // fix Unnecessary escape character: \-

    // fix Use array destructuring  //todo

    switch (t.toLowerCase()) {
        case 's':
            keys = keys[0]
            break
        case 'l':
        default: // fix Expected a default case
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

export const getMapPathValue = (map, ns, def = {}) => {
    // fix no-param-reassign
    let res
    // map[ns] = map[ns] ? map[ns] : def
    res = map[ns] ? map[ns] : def
    return res
}

export const getMap = (optionMap, ns = '', cmd = '') => {
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
export const getFormatOptStr = (opts, s = '', num = 2) => {
    // fix Assignment to function parameter 'opts'
    let res
    res = Array.isArray(opts) ? opts : [opts]
    return res.join('\n').replace(/^/gim, Array(num).fill(s).join(''))
}
