/* eslint-disable  no-unused-vars,no-param-reassign */

function pluginRootList(pluginOpt = {}) {
    return ctx => {
        const { data, option } = ctx
        // tpl,dat
        let itemtpl
        itemtpl = '- {commit} {subject}'
        itemtpl = '- [{commit}]({repo}/commit/{hash}) {subject}'
        itemtpl = '- [{commit}]({repo}/commit/{hash}) - {type} - {subject}'

        const titletpl = '<a name="{version}"></a>## {libname} {version}({date}) \n{changes}'
        const body = data.map((item, index) => ctx.writeTpl(itemtpl, item)).join('\n')
        let res = ''
        const meniefest = data
        if (meniefest.length > 0) {
            res = ctx.writeTpl(titletpl, {
                date: meniefest[0].date,
                changes: body
            })
            ctx.result = res
        }
        return res
    }
}

/**
 * get md table head with keys with align
 * @param {string} keys
 * @param {string} align
 * @returns {string}
 * @sample
 * ```
 * getHeadByKeys('commit|type|desciption', 'l')
 * ```
 */
function getHeadByKeys(keys, align = 'l') {
    let res = ''
    const head = keys
    const hs = head
        .split('|')
        .map(() => {
            let exp = ''
            switch (align) {
                case 'm':
                case 'center':
                    exp = ':----:'
                    break
                case 'r':
                case 'right':
                    exp = '----:'
                    break
                case 'l':
                case 'left':
                default:
                    exp = ':----'
                    break
            }
            return exp
        })
        .join('|')
    res = `${head}\n${hs}`
    return res
}

// [{commit}]({repo}/commit/{hash})|{type}|{subject}({issue})
export default function pluginMarkdowntable(pluginOpt = {}) {
    return ctx => {
        const { data, option } = ctx
        let meniefest
        meniefest = data.map(item => {
            const obj = { ...item }
            let { issue } = obj
            if (issue && issue.length > 0) {
                issue = issue.filter(v => v)
                obj.issue = issue
                    .map(ic =>
                        ctx.writeTpl('[#{issue}]({repo}/pull/{issue})', {
                            issue: ic.trim().replace(/^#/, '')
                        })
                    )
                    .join(',')
            } else {
                obj.issue = ''
            }
            return obj
        })
        // ctx.data = data;

        // render subject
        meniefest = meniefest.map((item, index) => {
            const obj = { ...item }
            const { issue } = obj
            if (issue.length > 0) {
                obj.subject = ctx.writeTpl('{subject}({issue})', obj)
            } else {
                obj.subject = ctx.writeTpl('{subject}', obj)
            }
            return obj
        })

        meniefest = meniefest.map((item, index) => {
            const obj = { ...item }
            obj.commit = ctx.writeTpl('[{commit}]({repo}/commit/{hash})', {
                ...obj
                // ...github,
            })
            return obj
        })

        // option.tpl = `{hash}|{type}|{subject}`;
        // let body = ctx.renderLine().join("\n");
        const body = meniefest
            .map(
                line => ctx.writeTpl('{commit}|{type}|{subject}', line) // ...line, ...github }
            )
            .join('\n')

        const head = getHeadByKeys('commit|type|desciption', 'l')
        const table = `${head}\n${body}\n\n`

        let res = ''
        const whtpl = '<a name="{version}"></a>\n# {version}({date})\n### {libname}\n{changes}'
        if (meniefest.length > 0) {
            res = ctx.writeTpl(whtpl, {
                date: meniefest[0].date,
                changes: table
            })
            ctx.result = res
        }

        return res
    }
}
