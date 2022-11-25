/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-shadow */
import getMsgTemplate from './get-git-commit-msg-template'

function pluginRootList(pluginOpt = {}) {
    return ctx => {
        const { data, option } = ctx

        let meniefest
        const useHtmlTable = false
        const useHtmlLink = false
        meniefest = data.map(item => {
            const obj = { ...item }
            let { issue } = obj
            let link
            const mdlink = '[#{issue}]({repo}/pull/{issue})'
            const htmllink = '<a hrel="{repo}/pull/{issue}"> #{issue} </a>'
            link = useHtmlLink ? htmllink : mdlink

            if (issue && issue.length > 0) {
                issue = issue.filter(v => v)
                obj.issue = issue
                    .map(ic =>
                        ctx.writeTpl(link, {
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

        // format subject length
        // let max = Math.max(...meniefest.map(line => line.subject.length))
        // //  ''.padEnd(max < 120 ? 120 : max, ' ')
        // let limitedmax = 130
        // max = max < limitedmax ? limitedmax : max
        // meniefest = meniefest.map((item, index) => {
        //     // item.subject = item.subject.padEnd(max, ' ') //&nbsp;
        //     if (item.subject.length < max) {
        //         let count = max - item.subject.length
        //         item.subject = item.subject.replace(/$/, Array(count).fill('&nbsp;').join('')) //'&nbsp;|' '
        //     }
        //     return item
        // })

        meniefest = meniefest.map((item, index) => {
            const obj = { ...item }
            // feat: add link tips to commit id
            // desc: escape html new line with Entity Name or Entity Code
            // https://mateam.net/html-escape-characters/
            let inlinebody
            inlinebody = getMsgTemplate(obj)

            // feat: fix body when body is empty when commiting
            // which leads body includes subject in gitlog-parses
            if (obj.body.indexOf(obj.subject) >= 0) obj.body = ''

            inlinebody = ctx.writeTpl(inlinebody, {
                ...obj
            })
            inlinebody = inlinebody.replace(/\r?\n/gi, '&#10;')

            // obj.inlinebody = obj.body.replace(/\r?\n/gi, '&#10;') //&NewLine;|&#10;
            obj.inlinebody = inlinebody
            // markdown link expression
            let link
            const mdlink = '[{commit}]({repo}/commit/{hash} "{inlinebody}")'
            const htmllink = '<a title="{inlinebody}" hrel="{repo}/commit/{hash}"> {commit} </a>'
            link = useHtmlLink ? htmllink : mdlink
            obj.commit = ctx.writeTpl(link, {
                ...obj
                // ...github,
            })
            return obj
        })

        // tpl,dat
        let itemtpl
        itemtpl = '- {commit} {subject}'
        itemtpl = '- [{commit}]({repo}/commit/{hash}) {subject}'
        itemtpl = '- [{commit}]({repo}/commit/{hash}) - {type} - {subject}'
        itemtpl = '- [{commit}]({repo}/commit/{hash}) - {type} - {subject}'
        itemtpl = '- {commit} - {type} - {subject}'
        itemtpl = '- {subject} - {type} - {commit}'
        itemtpl = '- {type} - {subject} - {commit}'
        itemtpl = '- {type}: {subject} - {commit}'

        const body = meniefest.map((item, index) => ctx.writeTpl(itemtpl, item)).join('\n')

        let titletpl = '<a name="{version}"></a>\n\n## {libname} {version}({date}) \n{changes}'
        titletpl = '<a name="{version}">\n\n## {libname} {version}({date})</a> \n{changes}'
        let res = ''
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
 * set table style - col width
 * @param {string} content
 * @param {*} option
 * @returns
 */
function setTableStyle(content, option) {
    const tablestyle = `
<!-- <link rel="stylesheet" href="md.table.tmp.css"> -->
<style>
table{display:table;width:100%;}
table th:nth-of-type(1),table th:nth-of-type(2){width:12%;}
tr:nth-child(2n){background-color:#fdcee8;}
tr:nth-child(2n-1){background-color:white;}
th{background-color:#fdcee8;}
</style>
`

    // if (!option.style) content = `${tablestyle}\n\n${content}`;
    const text = `${tablestyle}\n\n${content}`
    return text
}

/**
 * set table center - h
 * @param {string} content
 * @param {{tag:string,inlineStyle:string}} options
 * @returns {string}
 */
function setTableCenter(content, options = {}) {
    // tag,inline style
    const option = {
        tag: 'p',
        style: 'background:white;',
        ...options
    }
    const text = `
<p align="center" style="background:white;">
${content}
</p>
`
    return text
}

/**
 * get html table head tr
 * @param {string} keys
 * @returns
 */
function getHtmlTableHeadByTds(keys) {
    // let htmlTableHead = `<thead><th>commit</th><th>type</th><th style="width:80%">desciption</th></thead>`
    let txt
    txt = keys
        .split('|')
        .map((v, i) => {
            if (i === 2) {
                return `<th style="width:80%">${v}</th>`
            }
            return `<th>${v}</th>`
        })
        .join('')
    txt = `<tr>${txt}</tr>`
    return txt
}

/**
 * get html table body tr
 * @param {string} keys
 * @param {number} index
 * @returns
 */
function getHtmlTableTrByTds(keys, index) {
    // let htmlTableBodyTpl = `<tr style="background-color:#fdcee8;"><td>{commit}</td><td>{type}</td><td>{subject}</td></tr>`
    let txt
    txt = keys
        .split('|')
        .map((v, i) => `<td>${v}</td>`)
        .join('\n')
    if (index % 2 === 0) {
        txt = `<tr>${txt}</tr>`
    } else {
        txt = `<tr style="background-color:#fdcee8;" >${txt}</tr>`
    }
    // txt = `<tbody>${txt}</tbody>`
    return txt
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
function getMarkdownTableHeadByKeys(keys, align = 'l') {
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

function pluginRoottable(pluginOpt = {}) {
    return ctx => {
        const { data, option } = ctx
        let meniefest
        const useHtmlTable = false
        const useHtmlLink = false

        meniefest = data.map(item => {
            const obj = { ...item }
            let { issue } = obj
            let link
            const mdlink = '[#{issue}]({repo}/pull/{issue})'
            const htmllink = '<a hrel="{repo}/pull/{issue}"> #{issue} </a>'
            link = useHtmlLink ? htmllink : mdlink

            if (issue && issue.length > 0) {
                issue = issue.filter(v => v)
                obj.issue = issue
                    .map(ic =>
                        ctx.writeTpl(link, {
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

        // format subject length
        // let max = Math.max(...meniefest.map(line => line.subject.length))
        // //  ''.padEnd(max < 120 ? 120 : max, ' ')
        // let limitedmax = 130
        // max = max < limitedmax ? limitedmax : max
        // meniefest = meniefest.map((item, index) => {
        //     // item.subject = item.subject.padEnd(max, ' ') //&nbsp;
        //     if (item.subject.length < max) {
        //         let count = max - item.subject.length
        //         item.subject = item.subject.replace(/$/, Array(count).fill('&nbsp;').join('')) //'&nbsp;|' '
        //     }
        //     return item
        // })

        meniefest = meniefest.map((item, index) => {
            const obj = { ...item }
            // '[{commit}]({repo}/commit/{hash})'
            // feat: add link tips to commit id
            // desc: escape html new line with Entity Name or Entity Code
            // https://mateam.net/html-escape-characters/
            let inlinebody
            // inlinebody = `{type}({scope}): {subject}\n\n{body}\n\n{issue}\n{foot}`
            inlinebody = getMsgTemplate(obj)
            // feat: fix body when body is empty when commiting
            // which leads body includes subject in gitlog-parses
            if (obj.body.indexOf(obj.subject) >= 0) obj.body = ''
            inlinebody = ctx.writeTpl(inlinebody, {
                ...obj
            })
            inlinebody = inlinebody.replace(/\r?\n/gi, '&#10;')
            // obj.inlinebody = obj.body.replace(/\r?\n/gi, '&#10;') //&NewLine;|&#10;
            obj.inlinebody = inlinebody
            // markdown link expression
            let link
            const mdlink = '[{commit}]({repo}/commit/{hash} "{inlinebody}")'
            const htmllink = '<a title="{inlinebody}" hrel="{repo}/commit/{hash}"> {commit} </a>'
            link = useHtmlLink ? htmllink : mdlink
            obj.commit = ctx.writeTpl(link, {
                ...obj
                // ...github,
            })
            return obj
        })

        // option.tpl = `{hash}|{type}|{subject}`;

        let link
        const mdlink = '[{commit}]({repo}/commit/{hash} "{inlinebody}")'
        const htmllink = '<a title="{inlinebody}" hrel="{repo}/commit/{hash}"> {commit} </a>'
        link = useHtmlLink ? htmllink : mdlink

        // markdown table
        // let body = ctx.renderLine().join("\n");
        let body
        let head
        let table
        if (!useHtmlTable) {
            body = meniefest
                .map(
                    line => ctx.writeTpl('{commit}|{type}|{subject}', line) // ...line, ...github }
                )
                .join('\n')

            head = getMarkdownTableHeadByKeys('commit|type|desciption', 'l')
            table = `${head}\n${body}\n\n`
        } else {
            // html table
            const body = meniefest
                .map((line, index) => ctx.writeTpl(getHtmlTableTrByTds('{commit}|{type}|{subject}', index), line))
                .join('\n')

            head = getHtmlTableHeadByTds('commit|type|desciption')
            table = `<table><thead>${head}</thead><tbody>${body}</tbody></table>`
        }

        let res = ''
        let whtpl = '<a name="{version}"></a>\n# {version}({date})\n### {libname}'
        const changestpl = '{changes}'
        let tbcentertpl = `<p align="center" style="background:white;">\n\n${changestpl}</p>`
        tbcentertpl = `<div align="center" style="margin-left: auto;margin-right: auto;background:white;">\n\n${changestpl}</div>`
        whtpl = `${whtpl}\n${changestpl}`
        // whtpl = `${whtpl}\n\n${tbcentertpl}`

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

export { pluginRoottable, pluginRootList }
