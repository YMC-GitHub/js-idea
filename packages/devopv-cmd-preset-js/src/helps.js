/**
 * render ns
 * @param {string} tpl
 * @param {string} ns
 * @returns {string}
 */
function renderns(tpl, ns) {
  return tpl.replace(/\{ns\}/gi, ns)
}
function donothing() {}
export { renderns, donothing }
