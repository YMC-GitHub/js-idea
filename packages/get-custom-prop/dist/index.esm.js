/**
  * getCustomProp v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
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
 * get custom prop from context
 * @param {{}} context
 * @param {string} prop
 * @param {()=>{}} def
 * @param {{prefix:string,camelize:boolean}} options
 * @returns {*}
 * @desciption
 * ```
 * ## task
 * - [x] auto bind custiom prefix to property
 * - [x] auto camelize property
 * ```
 */
function getCustomProp(context, prop, def, options = {}) {
  const option = {
    prefix: 'custom',
    camelize: true,
    ...options
  };
  const prefixedProp = getPrefixedProp(prop, option);
  // idea:get-custom-if-presence -> get-native-if-presence -> get-default-if-presence
  const native = context[prop] ? context[prop] : def;
  return context[prefixedProp] ? context[prefixedProp] : native
}

export { getCustomProp as default };
