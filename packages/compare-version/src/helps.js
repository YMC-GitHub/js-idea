/**
 * split version expression to flat array - version expression = version + tail
 * @param {boolean} flag
 * @param {string} verExp
 * @returns {string[]}
 * @sample
 * ```
 * split(true,`1.0.0-alpha.2`)// => ['1','0','0','alpha','2']
 * split(true,`1.0.0-alpha`)// => ['1','0','0','alpha']
 * split(false,`1.0.0`)// => ['1','0','0']
 * ```
 */
function split(flag, verExp) {
  const input = `${verExp}`

  let result = []
  if (flag) {
    // get ver and tail
    let tail = input.split('-')[1]
    const version = input.split('-')[0]

    // get result
    result = version.split('.')
    tail = tail.split('.')
    result = result.concat(tail)
  } else {
    result = input.split('.')
  }
  return result
}

/* eslint-disable radix */
/**
 * str to num
 * @param {string[]} arr
 * @returns {[number & string][]}
 * @sample
 * ```
 * convertToNumber(['1','0','0'])// [1,0,0]
 * convertToNumber(['1','0','0','alpha'])// [1,0,0,'alpha']
 * ```
 */
function convertToNumber(arr) {
  return arr.map(el => (Number.isNaN(el) ? el : parseInt(el)))
}
/* eslint-enable radix */

export { split, convertToNumber }
