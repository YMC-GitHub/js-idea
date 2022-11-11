/* eslint-disable no-unused-vars,max-len */
/* eslint-disable no-continue */

/**
 * get obj only define keys
 * @param {{}} option
 * @return {{}}
 */
function getObjOnlyDefinedKeys(option = {}) {
  const res = {}
  Object.keys(option).forEach(v => {
    if (option[v] !== undefined) {
      res[v] = option[v]
    }
  })
  return res
}

function isOneOfValues(one, values) {
  return values.some(value => value === one)
}
/**
 * get or ini setting with namespace path
 * @param {{}} data
 * @param {string} ns
 * @param {{seq:string,val:unknown}} options
 * @returns {{}}
 */
function setting(data = {}, ns = '', options = {}) {
  const option = {
    sep: '.',
    ...options
  }
  const { val, sep } = option
  let p = data
  const nsp = ns.split(sep)
  if (nsp.length <= 1) return p
  const lastIndex = nsp.length - 1
  const last = nsp[lastIndex]
  for (let index = 0; index < lastIndex; index += 1) {
    const key = nsp[index]
    if (!p[key]) p[key] = {} // desc: ini p.key
    p = p[key] // desc: put p to p.key
  }
  // ini the last key with val
  if (p && val !== undefined) {
    p[last] = val
  }
  return p
}
function hunmanJson(json, n = 4) {
  return JSON.stringify(json, null, n)
}
/**
 * get module alisa config in babel.config.json
 * @param {{}} cnf
 * @returns {{}}
 */
function getModuleAliasInBabelConfig(cnf) {
  let res = {}
  //   if (!cnf.plugins) cnf.plugins = [[]]
  const { plugins = [[]] } = cnf
  for (let index = 0; index < plugins.length; index += 1) {
    const [name, opts] = plugins[index]
    if (name === 'babel-plugin-module-resolver') {
      res = opts
      break
    }
  }
  return res
}

function resloveAlias(url, options) {
  const { alias = {}, onlyRoot = false } = options
}

/**
 * replace alias - update url with alias map
 * @param {*} url
 * @param {*} options
 * @returns
 */
function replaceAlias(url, options) {
  let spec = url
  const { alias = {}, onlyRoot = false, onlyOnce = false, isGlobal = false } = options

  const keys = Object.keys(alias)
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index]
    const val = alias[key]
    // ^ xx
    let reg
    let autoOnce = false
    // ^ or $
    if (key.startsWith('^') || key.endsWith('$')) {
      reg = new RegExp(`${key}`)
      autoOnce = true
    } else {
      // how many
      let rm = 'i'
      if (isGlobal) {
        rm = 'ig'
      }
      reg = new RegExp(`${key}`, rm)
    }
    if (onlyRoot) {
      // feat: only relpace root dir
      if (spec.startsWith(key)) {
        spec = spec.replace(reg, val)
        if (onlyOnce || autoOnce) {
          // only once
          break
        } else {
          // no - limited
          continue
        }
      }
    } else {
      spec = spec.replace(reg, val)
      if (onlyOnce || autoOnce) {
        // feat: at any dir once
        break
      } else {
        // feat: at any dir no-limit
        continue
      }
    }
  }
  return spec
}
export { setting, hunmanJson, getModuleAliasInBabelConfig, isOneOfValues, replaceAlias, getObjOnlyDefinedKeys }
