/**
  * getFileList v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import getCustomProp from '@ymc/get-custom-prop';
import { readdirSync, statSync } from 'node:fs';
import { camelize } from '@ymc/extend-string';

/**
 * get prefixed prop
 * @param {string} prop
 * @param {{prefix:string,camelize:boolean}} option
 * @returns
 */
function getPrefixedProp(prop, option) {
  let prefixedProp = prop;
  if (option.prefix) {
    prefixedProp = `${option.prefix}${prop}`;
  }

  if (option.camelize) {
    prefixedProp = `${option.prefix}-${prop}`;
    prefixedProp = camelize(prefixedProp);
  }
  return prefixedProp
}

/**
 * set custom prop to context
 * @param {{}} context
 * @param {string} prop
 * @param {()=>{}} def
 * @param {{prefix:string,camelize:boolean,override:boolean}} options
 * @returns {*}
 * @desciption
 * ```
 * ## task
 * - [x] auto bind custiom prefix to property
 * - [x] auto camelize property
 * - [x] over ride native is allow
 * ```
 */
function setCustomProp(context, prop, def, options = {}) {
  const option = {
    prefix: 'custom',
    camelize: true,
    override: false,
    ...options
  };
  // over ride native
  if (option.override) {
    context[prop] = def;
    return
  }
  const prefixedProp = getPrefixedProp(prop, option);
  context[prefixedProp] = def;
}

const handles = {};

setCustomProp(handles, 'readdirSync', readdirSync, { override: true });
setCustomProp(handles, 'statSync', statSync, { override: true });

// import { readdirSync, statSync } from 'fs'

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
    ...handles,
    ...options
  };
  // const customReadDirSync = getCustomProp(option, 'readdirSync', readdirSync)
  // const customstatSync = getCustomProp(option, 'statSync', statSync)
  // const customReadDirSync = getCustomProp(option, 'readdirSync', defaultHandles['readdirSync'])
  // const customstatSync = getCustomProp(option, 'statSync', defaultHandles['statSync'])

  const customReadDirSync = getCustomProp(option, 'readdirSync');
  const customstatSync = getCustomProp(option, 'statSync');
  // getCustomProp(option, 'noop', noop)
  let list = customReadDirSync(dir);
  // log(list)
  list = list.map(v => {
    const loc = `${dir}/${v}`;
    const stat = customstatSync(loc);
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
  });
  list = list.flat(1);
  return list
}

export { getFilelist as default };
