/* eslint-disable no-unused-vars,no-continue */
/* eslint-disable consistent-return */

/**
 * module alias to babel-alias
 * @param {{alias}} cnf
 * @returns {{}}
 */
function ma2babel(cnf, options = {}) {
    const option = {
        useRegexpPrefix: true,
        useRegexpSuffix: true,
        ...options
    }
    if (!cnf.alias) return
    const { alias } = cnf
    const keys = Object.keys(alias)
    const res = {}
    for (let index = 0; index < keys.length; index += 1) {
        let key = keys[index]
        key = key.trim()
        if (!key) continue
        let val = alias[key]
        if (!val) continue
        // add ^
        if (option.useRegexpPrefix) {
            key = key.replace(/^\^?/, '^')
        }
        if (option.useRegexpSuffix) {
            // add (.+)$
            key = key.replace(/\$?$/, '(.+)$')
            // add \\1
            val = val.replace(/\\?1?$/, '\\1')
        }

        res[key] = val
    }

    return res
}
/**
 * module alias to eslint-alias
 * @param {{alias}} cnf
 * @returns {[]}
 */
function ma2eslint(cnf, options = {}) {
    const option = {
        useRegexpPrefix: true,
        useRegexpSuffix: true,
        ...options
    }
    if (!cnf.alias) return
    const { alias } = cnf
    const keys = Object.keys(alias)
    let res = {}
    for (let index = 0; index < keys.length; index += 1) {
        let key = keys[index]
        key = key.trim()
        if (!key) continue
        const val = alias[key]
        if (!val) continue

        res[key] = [key, val]
    }
    res = Object.values(res)
    // res = { map: res }
    return res
}
/**
 * module alias to jest-alias
 * @param {{alias}} cnf
 * @returns {{}}
 */
function ma2jest(cnf, options = {}) {
    const option = {
        useRegexpPrefix: true,
        useRegexpSuffix: true,
        ...options
    }
    if (!cnf.alias) return
    const { alias } = cnf
    const keys = Object.keys(alias)
    const res = {}
    for (let index = 0; index < keys.length; index += 1) {
        let key = keys[index]
        key = key.trim()
        if (!key) continue
        let val = alias[key]
        if (!val) continue
        //    "^@ymc/(.*?.?(js|vue)?|)$": "<rootDir>/packages/$1",

        // add ^
        if (option.useRegexpPrefix) {
            key = key.replace(/^\^?/, '^')
            val = val.replace(/^(\.\/)?/, '<rootDir>/')
        }
        if (option.useRegexpSuffix) {
            // add (.*?.?(js|vue)?|)$
            key = key.replace(/\$?$/, '(.*?.?(js|vue)?|)$')
            // add $1
            val = val.replace(/\\?1?$/, '$1')
        }

        res[key] = val
    }

    return res
}
/**
 * module alias to jsconfig-alias
 * @param {{alias}} cnf
 * @returns {{}}
 */
function ma2jsconfig(cnf, options = {}) {
    const option = {
        useRegexpPrefix: true,
        useRegexpSuffix: true,
        ...options
    }
    if (!cnf.alias) return
    const { alias } = cnf
    const keys = Object.keys(alias)
    const res = {}
    for (let index = 0; index < keys.length; index += 1) {
        let key = keys[index]
        key = key.trim()
        if (!key) continue
        let val = alias[key]
        if (!val) continue
        // "@ymc/*": ["packages/*"],
        // add ^
        // if (option.useRegexpPrefix) {
        // }
        if (option.useRegexpSuffix) {
            // add /*?
            // key = key.replace(/(\/|\*)?$/, '/*')
            // // add /*
            // val = val.replace(/(\/|\*)?$/, '/*')
            // please add *  !!!
            key = key.replace(/(\*)?$/, '*')
            // add *
            val = val.replace(/(\*)?$/, '*')
        }
        res[key] = [val]
    }

    return res
}

/**
 * module alias to vscode-setting-alias
 * @param {{alias}} cnf
 * @returns {{}}
 */
function ma2vscodeconfig(cnf, options = {}) {
    const option = {
        useRegexpPrefix: true,
        useRegexpSuffix: true,
        ...options
    }
    if (!cnf.alias) return
    const { alias } = cnf
    const keys = Object.keys(alias)
    const res = {}
    for (let index = 0; index < keys.length; index += 1) {
        let key = keys[index]
        key = key.trim()
        if (!key) continue
        let val = alias[key]
        if (!val) continue
        // "@ymc/": "\${workspaceFolder}/packages",
        // add ^
        if (option.useRegexpPrefix) {
            // eslint-disable-next-line no-template-curly-in-string
            val = val.replace(/^(\.\/)?/, '${workspaceFolder}/')
        }
        if (option.useRegexpSuffix) {
            // // add /*
            // key = key.replace(/(\/\*)?$/, '/*')
            // // add /*
            // val = val.replace(/(\/\*)?$/, '/*')
        }
        res[key] = val
    }

    return res
}

export { ma2babel, ma2eslint, ma2jest, ma2jsconfig, ma2jsconfig as ma2tsconfig, ma2vscodeconfig }
