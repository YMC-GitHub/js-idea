/* eslint-disable no-new,no-param-reassign */

// docs(core): add docs comment
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

/**
 *
 * @param {{option:{}}} entrys
 * @returns
 * @description
 * ```
 * - [x] bind entrys.option to ysc.option
 * - [x] bind entrys.xx to ysc.option (xx is some of version,ns,autoSubCmd,autoSubNs)
 * - [x] bind entrys to ysc.context
 * ```
 */
export const installEntrys =
    (entrys = {}) =>
    ycs => {
        if (!ycs) new Error('need Ycs instance') // Do not use 'new' for side effects
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
            // Assignment to property of function parameter 'ycs'
        }

        // idea: bind entrys.xx to ysc.option
        // xx is some of version,ns,autoSubCmd,autoSubNs
        'version,ns,autoSubCmd,autoSubNs'.split(',').forEach(item => {
            if (entrys[item]) {
                ycs.option[item] = entrys[item]
            }
            // Assignment to property of function parameter 'ycs'
        })
        ycs.entry(entrys)
        // ysc.run(input)
        return ycs
    }
