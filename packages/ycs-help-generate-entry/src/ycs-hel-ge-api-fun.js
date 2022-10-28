/* eslint-disable no-param-reassign */

// fix Assignment to property of function parameter 'entrys'
// idea: gen entry for some context
const genEntrys = (entrys, subcmd = '', defFun = () => {}, bindType = 'bind') => {
  if (!entrys) {
    Error('need entrys')
  }
  subcmd.split('|').forEach(cmd => {
    switch (bindType) {
      case 'call':
        // feat: support run then bind entry
        // defFun is a function return a entry-function
        entrys[cmd] = defFun(cmd)
        break
      case 'bind':
        // feat: support bind entry
        entrys[cmd] = defFun
        break
      default:
        break
      // fix Expected a default case
    }
  })
  return entrys
}

// idea: extract to clss style
// entrys().subcmd()
// entrys().bind(cmd.fun)

export default genEntrys
