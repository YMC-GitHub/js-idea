/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */

import { exec, execOpts } from '@ymc/run-bash'
import { writeTpl } from '@ymc/render-tpl'
import { store as gitlog } from '@ymc/git-commit-msg-read'
// import { parse as parsemsg } from '@ymc/git-commit-msg-parse'
import { ChangelogStyle } from '@ymc/changlog-style'
import { changelogfile as changelogio } from '@ymc/changlog-file-io'
import { jsonstream, writeFileSync, readJsonSync, getLibNameFromPath, getPackagesLocFromPath } from './helps'

const { log } = console

async function main() {
    let data
    let loc

    log('[task] filter msg for pkg')
    log('[task] make changelog with tpl')

    log('[info] read gitlog')
    // gitlog.options.n = 1
    // data = await gitlog.parse()
    loc = 'gitlog-info.shim.tmp.json'
    jsonstream.init(loc)
    data = await jsonstream.read([])
    log(`[info] src: ${loc}`)

    log('[info] read pkglog')
    loc = 'pkgs-info.json'
    jsonstream.init(loc)
    let pkglog
    // pkglog = await jsonstream.read([])
    // log(`[info] src: ${loc}`)
    // pkglog = pkglog.filter(v => v.name && v.loc).filter(v => !/@private-pkgs/.test(v.name))
    // pkglog.forEach(v => (v.loc = v.loc.replace(/\/package.json$/, '')))

    pkglog = await rungit('git ls-tree --full-tree --name-only -r HEAD', execOpts)
    pkglog = pkglog.split(/\r?\n/).filter(v => v)
    pkglog = await getCmtedVcPkgNameInLoc({ files: pkglog, for: 'pkg-loc' })
    pkglog = pkglog.map(v => ({
        loc: v
    }))
    // log(pkglog)
    // return
    let res = []
    pkglog.forEach(v => {
        // log(v.name, v.loc)
        // res.push(render(data, { wkd: v.loc }))
        const txt = render(data, { wkd: v.loc })
        res.push(txt)
        // txt = setTableStyle(txt)
        writeFileSync(`${v.loc}/CHANGELOG.md`, txt)
        log(`[info] out: ${v.loc}/CHANGELOG.md`)
        // res.push(txt)
    })
    res = res.filter(v => v)
    // res = res.join(`\n`)
    // log(res)
    res = res.join('\n\n')
    // res = setTableStyle(res)
    log('[info] write changelog')
    loc = 'CHANGELOG.md'
    changelogio.init(loc)
    log(`[info] out: ${loc}`)
    await changelogio.write(res)

    // render(data)
}
//@ymc/git-commit-msg-template
//get-git-commit-msg-template
/**
 * get angular style commit-msg template
 * @param {{}} data
 * @returns {string}
 */
function getAngularStyleTpl(data) {
    let tpl = ''
    // tpl = `{type}`
    if (data.type) {
        tpl = '{type}'
    }
    if (data.scope) {
        tpl = `${tpl}({scope})`
    }
    if (data.type || data.scope) {
        tpl = `${tpl}: {subject}`
    }

    if (data.body) {
        tpl = `${tpl}\n\n{body}`
    }

    if (data.foot || data.issue) {
        tpl = `${tpl}\n\n`
    }
    if (data.issue) {
        tpl = `${tpl}{issue}\n`
    }
    if (data.foot) {
        tpl = `${tpl}{foot}`
    }
    return tpl
}
//@ymc/render-cmted-msgs-to-pkg-changelog
/**
 * rendet data to changelog.md text
 * @param {[]} data
 * @param {{}} options
 * @returns {string}
 */
function render(data, options = {}) {
    let text
    const option = {
        ...options
    }
    const { wkd } = option

    const libname = getLibNameFromPath(wkd, { camelize: false })
    const libdir = getPackagesLocFromPath(wkd)

    log('[info] get pkgjson ')
    const pkgjson = readJsonSync(`${libdir}/${libname}/package.json`, {})
    const { version, name } = { version: '0.0.1', ...pkgjson }

    log('[info] filter pkgs commits')
    let cache
    const reg = new RegExp(`${libdir}/${libname}/`, 'i')
    cache = data.filter(v => v.file.some(f => reg.test(f)))
    // cache = gitlog.filterInfoByFile(new RegExp(`${libdir}/${libname}/`, 'i'))

    // log('[info] filter since last commit id')
    // cache = gitlog.filterSinceLastChanglog(cache, lastId)
    // filter:ignore docs
    // cache = gitlog.filterIgnoreScope(cache, docsReg);

    log('[info] ignore docs commits')
    let ignores = 'docs,style,chore,tool'.split(',')
    cache = cache.filter(v => !ignores.some(ig => ig === v.type))
    // only the latest
    // if (cache.length > 0) cache = cache[0];

    log('[info] render new changlog')

    // let cmds = definecmds(libname);
    // await runcmds(cmds);

    // get tpl and render
    const changelogstyle = new ChangelogStyle()
    changelogstyle.data = cache
    changelogstyle.option = { style: 'custom' } // table|list|custom
    changelogstyle.plugin = [pluginRoottable()]
    changelogstyle.plugin = [pluginRootList()]

    text = changelogstyle.render()
    // log(text);
    text = changelogstyle.writeTpl(text, {
        version,
        libname: name, // libname,
        repo: 'https://github.com/ymc-github/js-idea'
    })
    return text.trim()
}

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
            inlinebody = getAngularStyleTpl(obj)

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
 * @param {*} option
 * @returns
 */
function setTableCenter(content, option) {
    const text = `
<p align="center" style="background:white;">
${content}
</p>
`
    return text
}

// /**
//  * beauty text - add some space a
//  * @param {string|string[]} text
//  * @returns {string[]}
//  */
// function beautyText(text) {
//     let list = Array.isArray(text) ? text : [text]

//     // get the max-str length of name property value
//     const max = Math.max(...list.map(line => line.split(' ')[0].length))
//     list = list.map(line => {
//         const arr = line.split(' ')
//         let name = arr[0]
//         const desc = arr.slice(1)
//         name = padEndString(name, max + 6, ' ')
//         return `${name}${desc.join(' ')}`
//     })
//     // log(max)
//     return list
//     // padding suffix space
// }

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
            inlinebody = getAngularStyleTpl(obj)
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

            head = getHeadByKeys('commit|type|desciption', 'l')
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

/**
 * get pkg name of version control (vc) - mono repo -cmted
 * @param {{packageslocReg:regexp,pathSplit:string}} options
 * @returns {string[]}
 */
async function getCmtedVcPkgNameInLoc(options = {}) {
    const option = {
        EOFReg: /\r?\n/,
        pathSplit: '/',
        packageslocReg: /^packages\//,
        files: '',
        for: 'pkg-name',
        ...options
    }

    let { files } = option
    if (!files) return []
    // only in package loc
    files = files.filter(v => option.packageslocReg.test(v))

    const sep = option.pathSplit
    // get name or loc
    // eg. file=packages/noop/xx ; name=noop;loc=packages/noop;
    switch (option.for.toLowerCase()) {
        case 'pkg-loc':
            files = files.map(v => v.split(sep).slice(0, 2).join(sep)).filter(v => v)
            break
        case 'pkg-name':
        default:
            files = files.map(v => v.split(sep)[1]).filter(v => v)
            break
    }

    // del dup
    files = [...new Set(files)]
    return files
}
/**
 * get cli args and the first args is wkd
 * @param {string} def
 * @returns {string[]}
 */
function getArgs(def = 'packages/noop') {
    const args = process.argv.slice(2)
    if (args.length === 0) args[0] = def
    return args
}
async function rungit(cmd, execOpts) {
    const { stdout, stderr } = await exec(cmd, execOpts)
    return stdout
}

main()
// run as node script
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/gen-pkg-changelog/src/roots.js
