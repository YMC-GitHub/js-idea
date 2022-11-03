import { defOption } from './ycs-too'

const { log } = console

// idea: define main likes below
// likes docker,npm
const entrys = (data = {}) => {
  log(data)
}
entrys.add = (data = {}) => {
  log(data)
}
entrys.usage = `usage:ns [subcmd] [option]
subcmd:add|del|get|put
option:
`
// idea: define subcmd usage likes below
entrys.add.usage = `usage:
ns add [option]
option:
--host
--domain
--user
--port
--name
`
// idea: define subns usage likes below
entrys.npm = (data = {}) => {
  log(data)
}
entrys.npm.add = (data = {}) => {
  log(data)
}
entrys.npm.usage = `usage:ns [subns] [option]
subns:npm|yarn|pnpm
subcmd:add|del|get|put
option:
`
// idea: define subcmd usage likes below
entrys.npm.add.usage = `usage:ns [subns] [subcmd] [option]
ns npm add [option]
option:
--host
--domain
--user
--port
--name
`

let option = defOption()
option = {
  ...option,
  ...{
    version: '1.0.0',
    ns: 'npm-bin',
    autoSubCmd: 'add|del|get|put',
    autoSubNs: 'npm|lerna|yarn|pnpm|eslint|babel|postcss|ts'
  }
}
// entrys.option = defOption()
entrys.option = option
export default entrys
