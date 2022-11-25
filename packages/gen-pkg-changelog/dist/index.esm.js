/**
  * genPkgChangelog v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import '@ymc/run-bash';
import '@ymc/render-tpl';
import '@ymc/git-commit-msg-read';
import { ChangelogStyle } from '@ymc/changlog-style';
import { changelogfile } from '@ymc/changlog-file-io';
import { camelize } from '@ymc/extend-string';
import { jsonstream } from '@ymc/json-stream-io';
import { basename, dirname } from '@ymc/mock-path';
import { readFileSync, writeFileSync } from 'node:fs';

/* eslint-disable func-names */

const { log: log$1 } = console;
/**
 * get lib name with working dir
 * @param {string} wkd
 * @param {{trim?:boolean,camelize?:boolean}} option
 * @returns
 */
function getLibNameFromPath(wkd, option = {}) {
    let res = basename(wkd);
    const opt = {
        trim: true,
        ...option
    };
    if (opt.trim) {
        res = res.trim();
    }
    if (opt.camelize) {
        res = camelize(res);
    }
    return res
}

/**
 * get lib dir with working dir
 * @param {string} wkd
 * @returns
 */
function getPackagesLocFromPath(wkd) {
    return dirname(wkd)
}
/**
 *
 * @param {string} loc
 * @param {{}} def
 * @returns data
 * @description
 * ```
 * warn: need to fix when json with bom
 * ```
 */
function readJsonSync(loc, def = {}) {
    let data;
    try {
        data = readFileSync(loc);
        data = JSON.parse(data);
    } catch (error) {
        data = def;
    }
    return data
}

// @ymc/log-info
/**
 * get loginfo function
 * @param {boolean} enable
 * @returns {()=>void} a function to log info
 */
function getLogInfo$1(enable) {
    return function (...msg) {
        if (enable) {
            log$1(...msg);
        }
    }
}

// @ymc/git-commit-msg-template
// get-git-commit-msg-template
/**
 * get angular style commit-msg template
 * @param {{}} data
 * @returns {string}
 */
function getAngularStyleTpl(data) {
    let tpl = '';
    // tpl = `{type}`
    if (data.type) {
        tpl = '{type}';
    }
    if (data.scope) {
        tpl = `${tpl}({scope})`;
    }
    if (data.type || data.scope) {
        tpl = `${tpl}: {subject}`;
    }

    if (data.body) {
        tpl = `${tpl}\n\n{body}`;
    }

    if (data.foot || data.issue) {
        tpl = `${tpl}\n\n`;
    }
    if (data.issue) {
        tpl = `${tpl}{issue}\n`;
    }
    if (data.foot) {
        tpl = `${tpl}{foot}`;
    }
    return tpl
}

/* eslint-disable no-unused-vars */

function pluginRootList(pluginOpt = {}) {
    return ctx => {
        const { data, option } = ctx;

        let meniefest;
        meniefest = data.map(item => {
            const obj = { ...item };
            let { issue } = obj;
            let link;
            const mdlink = '[#{issue}]({repo}/pull/{issue})';
            link = mdlink;

            if (issue && issue.length > 0) {
                issue = issue.filter(v => v);
                obj.issue = issue
                    .map(ic =>
                        ctx.writeTpl(link, {
                            issue: ic.trim().replace(/^#/, '')
                        })
                    )
                    .join(',');
            } else {
                obj.issue = '';
            }
            return obj
        });
        // ctx.data = data;

        // render subject
        meniefest = meniefest.map((item, index) => {
            const obj = { ...item };
            const { issue } = obj;
            if (issue.length > 0) {
                obj.subject = ctx.writeTpl('{subject}({issue})', obj);
            } else {
                obj.subject = ctx.writeTpl('{subject}', obj);
            }
            return obj
        });

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
            const obj = { ...item };
            // feat: add link tips to commit id
            // desc: escape html new line with Entity Name or Entity Code
            // https://mateam.net/html-escape-characters/
            let inlinebody;
            inlinebody = getAngularStyleTpl(obj);

            // feat: fix body when body is empty when commiting
            // which leads body includes subject in gitlog-parses
            if (obj.body.indexOf(obj.subject) >= 0) obj.body = '';

            inlinebody = ctx.writeTpl(inlinebody, {
                ...obj
            });
            inlinebody = inlinebody.replace(/\r?\n/gi, '&#10;');

            // obj.inlinebody = obj.body.replace(/\r?\n/gi, '&#10;') //&NewLine;|&#10;
            obj.inlinebody = inlinebody;
            // markdown link expression
            let link;
            const mdlink = '[{commit}]({repo}/commit/{hash} "{inlinebody}")';
            link = mdlink;
            obj.commit = ctx.writeTpl(link, {
                ...obj
                // ...github,
            });
            return obj
        });

        // tpl,dat
        let itemtpl;
        itemtpl = '- {commit} {subject}';
        itemtpl = '- [{commit}]({repo}/commit/{hash}) {subject}';
        itemtpl = '- [{commit}]({repo}/commit/{hash}) - {type} - {subject}';
        itemtpl = '- [{commit}]({repo}/commit/{hash}) - {type} - {subject}';
        itemtpl = '- {commit} - {type} - {subject}';
        itemtpl = '- {subject} - {type} - {commit}';
        itemtpl = '- {type} - {subject} - {commit}';
        itemtpl = '- {type}: {subject} - {commit}';

        const body = meniefest.map((item, index) => ctx.writeTpl(itemtpl, item)).join('\n');

        let titletpl = '<a name="{version}"></a>\n\n## {libname} {version}({date}) \n{changes}';
        titletpl = '<a name="{version}">\n\n## {libname} {version}({date})</a> \n{changes}';
        let res = '';
        if (meniefest.length > 0) {
            res = ctx.writeTpl(titletpl, {
                date: meniefest[0].date,
                changes: body
            });
            ctx.result = res;
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
function getMarkdownTableHeadByKeys(keys, align = 'l') {
    let res = '';
    const head = keys;
    const hs = head
        .split('|')
        .map(() => {
            let exp = '';
            switch (align) {
                case 'm':
                case 'center':
                    exp = ':----:';
                    break
                case 'r':
                case 'right':
                    exp = '----:';
                    break
                case 'l':
                case 'left':
                default:
                    exp = ':----';
                    break
            }
            return exp
        })
        .join('|');
    res = `${head}\n${hs}`;
    return res
}

function pluginRoottable(pluginOpt = {}) {
    return ctx => {
        const { data, option } = ctx;
        let meniefest;

        meniefest = data.map(item => {
            const obj = { ...item };
            let { issue } = obj;
            let link;
            const mdlink = '[#{issue}]({repo}/pull/{issue})';
            link = mdlink;

            if (issue && issue.length > 0) {
                issue = issue.filter(v => v);
                obj.issue = issue
                    .map(ic =>
                        ctx.writeTpl(link, {
                            issue: ic.trim().replace(/^#/, '')
                        })
                    )
                    .join(',');
            } else {
                obj.issue = '';
            }
            return obj
        });
        // ctx.data = data;

        // render subject
        meniefest = meniefest.map((item, index) => {
            const obj = { ...item };
            const { issue } = obj;
            if (issue.length > 0) {
                obj.subject = ctx.writeTpl('{subject}({issue})', obj);
            } else {
                obj.subject = ctx.writeTpl('{subject}', obj);
            }
            return obj
        });

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
            const obj = { ...item };
            // '[{commit}]({repo}/commit/{hash})'
            // feat: add link tips to commit id
            // desc: escape html new line with Entity Name or Entity Code
            // https://mateam.net/html-escape-characters/
            let inlinebody;
            // inlinebody = `{type}({scope}): {subject}\n\n{body}\n\n{issue}\n{foot}`
            inlinebody = getAngularStyleTpl(obj);
            // feat: fix body when body is empty when commiting
            // which leads body includes subject in gitlog-parses
            if (obj.body.indexOf(obj.subject) >= 0) obj.body = '';
            inlinebody = ctx.writeTpl(inlinebody, {
                ...obj
            });
            inlinebody = inlinebody.replace(/\r?\n/gi, '&#10;');
            // obj.inlinebody = obj.body.replace(/\r?\n/gi, '&#10;') //&NewLine;|&#10;
            obj.inlinebody = inlinebody;
            // markdown link expression
            let link;
            const mdlink = '[{commit}]({repo}/commit/{hash} "{inlinebody}")';
            link = mdlink;
            obj.commit = ctx.writeTpl(link, {
                ...obj
                // ...github,
            });
            return obj
        });

        // markdown table
        // let body = ctx.renderLine().join("\n");
        let body;
        let head;
        let table;
        {
            body = meniefest
                .map(
                    line => ctx.writeTpl('{commit}|{type}|{subject}', line) // ...line, ...github }
                )
                .join('\n');

            head = getMarkdownTableHeadByKeys('commit|type|desciption', 'l');
            table = `${head}\n${body}\n\n`;
        }

        let res = '';
        let whtpl = '<a name="{version}"></a>\n# {version}({date})\n### {libname}';
        const changestpl = '{changes}';
        whtpl = `${whtpl}\n${changestpl}`;
        // whtpl = `${whtpl}\n\n${tbcentertpl}`

        if (meniefest.length > 0) {
            res = ctx.writeTpl(whtpl, {
                date: meniefest[0].date,
                changes: table
            });
            ctx.result = res;
        }

        return res
    }
}

/* eslint-disable no-unused-vars */
/**
 *
 * @param {string|string[]} s
 * @param {{}} options
 * @returns {string[]}
 */
function clihooks2array(s, options = {}) {
    let option = {
        splitReg: /[,_;| ]/,
        ...options
    };
    let res = Array.isArray(s) ? s : s.split(option.splitReg);
    if (!option.useEmpty) {
        res = res.filter(v => v);
    }
    return res
}
// @ymc/render-cmted-msgs-to-pkg-changelog
/**
 * rendet data to changelog.md text
 * @param {[]} data
 * @param {{}} options
 * @returns {string}
 */
function render(data, options = {}) {
    let text;
    const option = {
        logInfo: false,
        // ignoreTypes: 'docs,chore,tool,style,',
        // latestCount: 8,
        ...options
    };
    const { wkd } = option;

    const libname = getLibNameFromPath(wkd, { camelize: false });
    const libdir = getPackagesLocFromPath(wkd);

    const loginfo = getLogInfo$1(option.logInfo);
    loginfo('[info] read pkgs pkgjson ');
    const pkgjson = readJsonSync(`${libdir}/${libname}/package.json`, {});
    const { version, name } = { version: '0.0.1', ...pkgjson };

    loginfo('[info] grep pkgs commits');
    let cache;
    const reg = new RegExp(`${libdir}/${libname}/`, 'i');
    cache = data.filter(v => v.file.some(f => reg.test(f)));
    // cache = gitlog.filterInfoByFile(new RegExp(`${libdir}/${libname}/`, 'i'))

    // log('[info] filter since last commit id')
    // cache = gitlog.filterSinceLastChanglog(cache, lastId)
    // filter:ignore docs
    // cache = gitlog.filterIgnoreScope(cache, docsReg);

    if (option.sinceDate) {
        loginfo('[info] only since date');
    }

    if (option.ignoreTypes) {
        loginfo('[info] filter types with ignore type');
        // cache = cache.filter(v => v.type !== 'docs')
        let ignoretypes = clihooks2array(option.ignoreTypes, { useEmpty: true });
        // ignore empty type
        // ignoretypes.push('')
        cache = cache.filter(v => !ignoretypes.some(vn => v.type === vn));
    }

    if (option.latestCount >= 1 && cache.length > 0) {
        loginfo('[info] only the latet count');
        cache = cache.slice(0, option.latestCount);
    }
    // only the latest
    // if (cache.length > 0) cache = cache[0];

    loginfo('[info] render new changlog');

    // let cmds = definecmds(libname);
    // await runcmds(cmds);

    // get tpl and render
    const changelogstyle = new ChangelogStyle();
    changelogstyle.data = cache;
    changelogstyle.option = { style: 'custom' }; // table|list|custom
    changelogstyle.plugin = [pluginRoottable()];
    changelogstyle.plugin = [pluginRootList()];

    text = changelogstyle.render();
    // log(text);
    text = changelogstyle.writeTpl(text, {
        version,
        libname: name, // libname,
        repo: 'https://github.com/ymc-github/js-idea'
    });
    return text.trim()
}

/* eslint-disable func-names */
// import { rmSync } from 'fs'
const { log } = console;

/**
 * get loginfo function
 * @param {boolean} enable
 * @returns {()=>void} a function to log info
 */
function getLogInfo(enable) {
    return function (...msg) {
        if (enable) {
            log(...msg);
        }
    }
}

async function main(options = {}) {
    const option = {
        cmtedMsgsLoc: 'gitlog-info.shim.tmp.json',
        cmtedPkgsLoc: 'pkgs-cmted.tmp.json',
        changlogLoc: 'CHANGELOG.md',
        outPkgs: true,
        logInfo: false,
        logTask: false,
        ...options
    };

    const loginfo = getLogInfo(option.logInfo);
    const logtask = getLogInfo(option.logTask);

    let loc = option.out;

    logtask('[task] filter msg for pkg');
    logtask('[task] make changelog with tpl');

    loginfo('[info] read cmted msgs');
    let cmtedmsgs;
    loc = option.cmtedMsgsLoc;
    jsonstream.init(loc);
    cmtedmsgs = await jsonstream.read([]);
    cmtedmsgs = cmtedmsgs.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (option.ignoreTypes) {
        let ignoretypes = 'chore,tool,docs,style';
        ignoretypes = option.ignoreTypes;
        ignoretypes = ignoretypes.split(',');
        cmtedmsgs = cmtedmsgs.filter(v => !ignoretypes.some(it => it === v.type));
    }
    if (option.ignoreSubjects) {
        let ignoresubjects = 'put changelog,dbg markdown list';
        ignoresubjects = option.ignoreSubjects;
        ignoresubjects = ignoresubjects.split(',');
        // ignoresubjects.push('dbg markdown list')
        cmtedmsgs = cmtedmsgs.filter(v => !ignoresubjects.some(it => it === v.subject));
    }

    // put changelog
    // dbg markdown list
    loginfo(`[info] src: ${loc}`);
    // log(cmtedmsgs)

    let cmtedpkgs;
    loginfo('[info] read cmted pkgs');
    loc = option.cmtedPkgsLoc;
    jsonstream.init(loc);
    cmtedpkgs = await jsonstream.read([]);
    loginfo(`[info] src: ${loc}`);
    cmtedpkgs = cmtedpkgs.map(v => ({
        loc: v
    }));
    if (option.onlyPkgs) {
        let onlyPkgs = '';
        onlyPkgs = option.onlyPkgs;
        onlyPkgs = onlyPkgs.split(',');
        cmtedpkgs = cmtedpkgs.filter(v => onlyPkgs.some(it => v.loc.indexOf(it) >= 0));
    }

    // log(cmtedpkgs)

    loginfo('[info] write changelog');
    let pkgslogs = [];
    pkgslogs = cmtedpkgs.map(v => {
        // log(v.name, v.loc)
        // res.push(render(data, { wkd: v.loc }))
        const txt = render(cmtedmsgs, { wkd: v.loc });
        pkgslogs.push(txt);
        return { loc: v.loc, data: txt }
    });
    if (option.outPkgs) {
        // loginfo('[info] write packages/xx/changelog.md')
        pkgslogs.forEach(v => {
            let txt = v.data;
            // txt = setTableStyle(txt)
            writeFileSync(`${v.loc}/${option.changlogLoc}`, txt);
            log(`[info] out: ${v.loc}/${option.changlogLoc}`);
            // rmSync(`${v.loc}/CHANGELOD.md`)
        });
    }
    pkgslogs = pkgslogs.filter(v => v);
    // pkgslogs = pkgslogs.join(`\n`)
    // log(pkgslogs)
    pkgslogs = pkgslogs.map(v => v.data).join('\n\n');

    // pkgslogs = setTableStyle(pkgslogs)
    // loginfo('[info] write root changelog')
    loc = option.changlogLoc;
    changelogfile.init(loc);
    log(`[info] out: ${loc}`);
    await changelogfile.write(pkgslogs);
    // rmSync(`CHANGELOD.md`)
}

export { main as default };
