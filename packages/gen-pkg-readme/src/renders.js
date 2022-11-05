import { getTplExpRegByName, defineRender } from './helps'

// @ymc/readme-plugin-render-lib-size,@ymc/readme-render-lib-size
function renderLibSize(text = '', data = '') {
  let res = text
  const name = 'LIB_SIZE_INFO'
  const reg = getTplExpRegByName(name)
  const hasTag = reg.test(res)

  // add exp to tpl
  if (!hasTag) {
    res = `
${res}
## Lib size  
{{LIB_SIZE_INFO}}
`.trim()
  }

  // render
  res = res.replace(reg, data)
  return res
}

// @ymc/readme-render-lib-name
// const renderLibName = (text = '', data = '') => {
//     // define tag , load tpl / define tpl , render tpl
//     const name = 'LIB_NAME'
//     const reg = getTplExpRegByName(name)
//     const hasTag = reg.test(text)
//     // defineTag

//     if (!hasTag) {
//         text = `
//         # Pkg {{${name}}}
//         ${text}
//         `.trim()
//     }
//     text = text.replace(reg, data)
//     return text
// }
function renderLibName(text, data) {
  const name = 'LIB_NAME'
  const tpl = ` # Pkg {{${name}}}\n${text}`
  return defineRender('LIB_NAME', tpl)(text, data)
}

// @ymc/readme-render-help
// @ymc/readme-render-other
const renderOther = (text, data) => {
  let res = text
  let key
  let cache
  let defaultTpl

  // render description with packagejson
  key = 'description'
  if (key in data && data[key]) {
    cache = data[key]
    defaultTpl = `
## Desc
{{PKG_DESC}}
`.trim()
    res = defineRender('PKG_DESC', defaultTpl)(res, cache)
  }

  // render liense with packagejson
  key = 'license'
  if (key in data && data[key]) {
    cache = data[key]
    defaultTpl = `
## License
{{LICENSE}}
`.trim()
    res = defineRender('LICENSE', defaultTpl)(res, cache)
  }

  // render author with packagejson
  key = 'author'
  if (key in data && data[key]) {
    cache = data[key]
    const { name } = cache
    const { email } = cache
    cache = email ? `${name} <${email}>` : `${name}`
    defaultTpl = `
## Author
{{AUTHOR_LIST}}
`.trim()
    res = defineRender('AUTHOR_LIST', defaultTpl)(res, cache)
  }

  return res
}

function renderLibState(text, data) {
  const name = 'LIB_STATE'
  const tpl = `{{${name}}}\n${text}`
  return defineRender('LIB_STATE', tpl)(text, data)
}

export { renderLibSize, renderLibName, renderOther, renderLibState }
