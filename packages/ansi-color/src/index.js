/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable no-restricted-exports */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable  no-shadow */
/* eslint-disable no-restricted-syntax */

import defualtColors from './color'
import defualtSymbols from './symbols'
import './types'

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val)
const isFunction = val => typeof val === 'function'
const isNotEmptyString = str => typeof str === 'string' && str !== ''
const iString = str => typeof str === 'string'

/* eslint-disable no-control-regex */
// this is a modified version of https://github.com/chalk/ansi-regex (MIT License)
const ANSI_REGEX =
    /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g

/**
 * check if color enable
 * @returns
 */
const hasColor = () => {
    if (typeof process !== 'undefined') {
        return process.env.FORCE_COLOR !== '0'
    }
    return false
}
/**
 * init colors store
 * @returns
 */
const iniColors = () => ({
    enabled: hasColor(),
    visible: true,
    styles: {},
    keys: {}
})

// define ansi color - wrap text to terminal color
// define ansi style - to wrap text to terminal color
// ansi-color-codes -> ansi-color-style
/**
 * color codes to  ansi text - to wrap text to terminal color
 * @param {*} style
 * @returns
 */
const colorAnsify = style => {
    // feat: cache color open , close text
    // feat: cache color close regexp
    const open = (style.open = `\u001b[${style.codes[0]}m`)
    const close = (style.close = `\u001b[${style.codes[1]}m`)
    const closeRegex = (style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, 'g'))
    // feat: return wrap handle to call any where
    style.wrap = (input, newline) => {
        // feat: wrap text to terminal color
        if (input.includes(close)) input = input.replace(closeRegex, close + open)
        const output = open + input + close
        // feat: auto newline when symbol in text
        return newline ? output.replace(/\r?\n/g, `${close}$&${open}`) : output
    }
    return style
}

// ansi-color-style -> ansi-color-text
const wrapStyleToText = (style, input, newline) => (isFunction(style) ? style(input) : style.wrap(input, newline))
// /**
//  *
//  * @param {string} input
//  * @param {string[]} stack
//  * @param {{}} store
//  * @returns {string}
//  */

/**
 *
 * @param {store} store
 * @returns {(input:string,stack:string[])=>string}
 */
const style2text = store => (input, stack) => {
    if (input === '' || input == null) return ''
    // feat: color enabled is optional
    if (store.enabled === false) return input
    // feat: color visible is optional
    if (store.visible === false) return ''
    let str = `${input}`
    // feat: auto newline when symbol in text
    const nl = str.includes('\n')
    // feat: enable many style in styles stack
    let n = stack.length
    if (n > 0 && stack.includes('unstyle')) {
        stack = [...new Set(['unstyle', ...stack])].reverse()
    }
    while (n-- > 0) str = wrapStyleToText(store.styles[stack[n]], str, nl)
    return str
}
// ansi-color-name -> ansi-color-style

// /**
//  *
//  * @param {string} name
//  * @param {number[]} codes
//  * @param {string} type
//  * @param {{}} store
//  */
/**
 *
 * @param {store} store
 * @returns {(name:string,codes:number[],type:string)=>undefined}
 */
const defineColor = store => (name, codes, type) => {
    // feat: enable color name
    store.styles[name] = colorAnsify({ name, codes })
    // feat: enable style type
    const keys = store.keys[type] || (store.keys[type] = [])
    keys.push(name)
    // feat: reflect color name
    Reflect.defineProperty(store, name, {
        configurable: true,
        enumerable: true,
        set(value) {
            store.alias(name, value)
        },
        get() {
            // feat: get style when get color name
            const color = input => style2text(store)(input, color.stack)
            Reflect.setPrototypeOf(color, store)
            // desc: set color stack with color name
            color.stack = this.stack ? this.stack.concat(name) : [name]
            return color
        }
    })
}

// desc: check if has ansi
// desc: check if has color
/**
 * check if has ansi
 * @param {{}} store
 * @returns {(str:string)=>boolean}
 */
const hasAnsi = store => str => {
    store.ansiRegex.lastIndex = 0
    return isNotEmptyString(str) && store.ansiRegex.test(str)
}

// color alias -> color name
/**
 *
 * @param {{}} store
 * @returns {(name:string,color:string|()=>{})=>undefined}
 */
const defineAlias = store => (name, color) => {
    // feat: enable color alias
    // feat: enable function as color alias
    const fn = iString(color) ? store[color] : color
    if (!isFunction(fn)) {
        throw new TypeError('Expected alias to be the name of an existing color (string) or a function')
    }

    // desc: set color stack in alias
    if (!fn.stack) {
        Reflect.defineProperty(fn, 'name', { value: name })
        store.styles[name] = fn
        fn.stack = [name]
    }

    // feat: reflect color name
    Reflect.defineProperty(store, name, {
        configurable: true,
        enumerable: true,
        set(value) {
            store.alias(name, value)
        },
        get() {
            // feat: get style when get color name
            const color = input => style2text(store)(input, color.stack)
            Reflect.setPrototypeOf(color, store)
            // desc: set color stack with color name for  name or alias
            color.stack = this.stack ? this.stack.concat(fn.stack) : fn.stack
            return color
        }
    })
}

// color theme -> color alias
/**
 *
 * @param {store} store
 * @returns {(custom:{})=>store}
 */
const defineTheme = store => custom => {
    if (!isObject(custom)) throw new TypeError('Expected theme to be an object')
    for (const name of Object.keys(custom)) {
        store.alias(name, custom[name])
    }
    return store
}

// ansi-text -> plian-text
/**
 * ansi-text to plian-text
 * @param {store} store
 * @returns {(str:string)=>string}
 */
const unstyle = store => str => {
    if (isNotEmptyString(str)) {
        store.ansiRegex.lastIndex = 0
        return str.replace(store.ansiRegex, '')
    }
    return ''
}
const create = () => {
    const colors = iniColors()

    // const ansi = colorAnsify
    // const wrap = wrapStyleToText
    // const style = style2text

    const define = defineColor(colors)
    // feat: built in color
    const colorset = [...defualtColors]
    colorset.forEach(cs => {
        define(...cs)
    })

    // desc: add method
    // desc: check if has ansi
    // desc: check if has color
    colors.ansiRegex = ANSI_REGEX
    colors.hasColor = colors.hasAnsi = hasAnsi(colors)

    // desc: define color or alias
    colors.alias = defineAlias(colors)

    // desc: define color theme
    colors.theme = defineTheme(colors)

    // feat: built in alias
    colors.alias('unstyle', unstyle(colors))
    colors.alias('noop', str => str)
    colors.none = colors.clear = colors.noop

    colors.stripColor = colors.unstyle
    colors.symbols = defualtSymbols
    colors.define = define
    return colors
}
const instance = create()
export { instance as default, create }
