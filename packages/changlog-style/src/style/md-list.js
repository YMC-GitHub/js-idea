/* eslint-disable  no-unused-vars */
export default function pluginList(pluginOpt = {}) {
    return ctx => {
        const { data, option } = ctx
        let itemtpl
        itemtpl = '- {commit} {subject}'
        itemtpl = '- [{commit}]({repo}/commit/{hash}) {subject}'
        itemtpl = '- [{commit}]({repo}/commit/{hash}) - {type} - {subject}'

        let titletpl
        titletpl = '<a name="{version}"></a>## {libname} {version}({date}) \n{changes}' // for roo list
        titletpl = '<a name="{version}"></a>\n# {version}({date})\n### {libname}\n{changes}' // for pkg

        const body = data.map((item, index) => ctx.writeTpl('- {commit} {subject}', item)).join('\n')
        let res = ''
        const meniefest = data
        if (meniefest.length > 0) {
            res = ctx.writeTpl('<a name="{version}"></a>\n# {version}({date})\n### {libname}\n{changes}', {
                date: meniefest[0].date,
                changes: body
            })
            ctx.result = res
        }
        return res
    }
}
