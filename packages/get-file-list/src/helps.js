// import { readdirSync, statSync } from 'fs'
import getCustomProp from '@ymc/get-custom-prop'
import defaultHandles from './custom-handle.node'

// todo: check tool setup ->throw-err-if-no-setup -> exit-code
const { log } = console
function noop() {}

// @ymc/get-file-list
/**
 * get file list in dir - only-name ? recursive?
 * @param {string} dir
 * @param {{onlyName?:boolean,recursive?:boolean}} options
 * @returns {string[]}
 */
function getFilelist(dir, options = {}) {
  // todo: custom readdirSync,statSync or mock it

  const option = {
    onlyName: false,
    recursive: true,
    ...defaultHandles,
    ...options
  }
  // const customReadDirSync = getCustomProp(option, 'readdirSync', readdirSync)
  // const customstatSync = getCustomProp(option, 'statSync', statSync)
  // const customReadDirSync = getCustomProp(option, 'readdirSync', defaultHandles['readdirSync'])
  // const customstatSync = getCustomProp(option, 'statSync', defaultHandles['statSync'])

  const customReadDirSync = getCustomProp(option, 'readdirSync')
  const customstatSync = getCustomProp(option, 'statSync')
  // getCustomProp(option, 'noop', noop)
  let list = customReadDirSync(dir)
  // log(list)
  list = list.map(v => {
    const loc = `${dir}/${v}`
    const stat = customstatSync(loc)
    if (stat.isFile()) {
      if (option.onlyName) {
        return v
      }
      return loc
    }
    if (stat.isDirectory() && option.recursive) {
      return getFilelist(loc, options)
    }
    return ''
  })
  list = list.flat(1)
  return list
}

export { noop, log, getFilelist }
