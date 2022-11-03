/* eslint-disable no-param-reassign */
export const defOption = () => ({
  helpmsg: 'usage:ns option',
  argvIndexS: 2, // argv index start position
  enbaleSubCmd: false,
  subcmd: '',
  allowAutoSubCmd: true,
  autoSubCmd: '',
  version: '1.0.0',
  // ns : getRelScriptFileName(),
  ns: 'ycs',
  enbaleSubNs: false,
  subns: '',
  allowAutoSubNs: true,
  autoSubNs: ''
})

export const installEntrys =
  (entrys = {}) =>
  ycs => {
    if (!ycs) Error('need Ycs instance')
    // const ycs = new Ycs()
    // let input =process.argv
    // ycs.entry(entrys).run(input)
    // ycs.version('2.0.0').autosubns('npm|yarn|pnpm').autosubcmd('add|del|get|put').entry(entrys)

    // idea: bind entrys.option to ysc.option
    if (entrys.option) {
      ycs.option = {
        ...ycs.option,
        ...entrys.option
      }
    }

    // idea: bind entrys.xx to ysc.option
    // xx is some of version,ns,autoSubCmd,autoSubNs
    'version,ns,autoSubCmd,autoSubNs'.split(',').forEach(item => {
      if (entrys[item]) {
        ycs.option[item] = entrys[item]
      }
    })
    ycs.entry(entrys)
    // ysc.run(input)
    return ycs
  }
