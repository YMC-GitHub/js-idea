/* eslint-disable  no-use-before-define */
// fix 'isString' was used before it was defined  no-use-before-define
// Use array destructuring                    prefer-destructuring

/**
 * slim data by keys
 * @param {{}[]} data
 * @param {{keys:string|string[],span?:string,excludeKeys:string|string[]}} option
 * @returns {{}[]}
 */
function slimDataByKeys(data, option) {
  const opts = {
    span: ';',
    excludeKeys: '',
    ...option
  }

  let list = opts.keys
  list = isString(list) ? list.split(opts.span) : list

  let excludeList = opts.excludeKeys
  excludeList = isString(excludeList) ? excludeList.split(opts.span) : excludeList
  list = list.filter(v => !excludeList.some(ex => ex === v))

  let res
  let isOne
  let cache = Array.isArray(data) ? data : [data]
  if (Array.isArray(data)) {
    cache = data
  } else {
    cache = [data]
    isOne = true
  }

  res = cache.map(item => {
    const slim = {}
    list.forEach(key => {
      if (key in item) {
        slim[key] = item[key]
      }
    })
    return slim
  })

  // fix Use array destructuring                    prefer-destructuring
  if (isOne) [res] = res
  return res
}
function isString(s) {
  return typeof s === 'string'
}

export default slimDataByKeys
