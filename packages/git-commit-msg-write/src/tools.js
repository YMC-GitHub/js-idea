export function isDefine(s) {
  return s !== undefined
}
export function isString(s) {
  return typeof s === 'string'
}
export function isEmpty(s) {
  return s === ''
}
export function validString(s) {
  return isString(s) && !isEmpty(s)
}
