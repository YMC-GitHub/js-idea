/**
  * changlogStyle v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import { writeTpl } from '@ymc/render-tpl';

/* eslint-disable  no-unused-vars */
function pluginList(pluginOpt = {}) {
    return ctx => {
        const { data, option } = ctx;

        const body = data.map((item, index) => ctx.writeTpl('- {commit} {subject}', item)).join('\n');
        let res = '';
        const meniefest = data;
        if (meniefest.length > 0) {
            res = ctx.writeTpl('<a name="{version}"></a>\n# {version}({date})\n### {libname}\n{changes}', {
                date: meniefest[0].date,
                changes: body
            });
            ctx.result = res;
        }
        return res
    }
}

/* eslint-disable  no-unused-vars,no-param-reassign */

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

// [{commit}]({repo}/commit/{hash})|{type}|{subject}({issue})
function pluginMarkdowntable(pluginOpt = {}) {
    return ctx => {
        const { data, option } = ctx;
        let meniefest;
        meniefest = data.map(item => {
            let obj = { ...item };
            let { issue } = obj;
            if (issue && issue.length > 0) {
                issue = issue.filter(v => v);
                obj.issue = issue
                    .map(ic =>
                        ctx.writeTpl('[#{issue}]({repo}/pull/{issue})', {
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
            let obj = { ...item };
            const { issue } = obj;
            if (issue.length > 0) {
                obj.subject = ctx.writeTpl('{subject}({issue})', obj);
            } else {
                obj.subject = ctx.writeTpl('{subject}', obj);
            }
            return obj
        });

        meniefest = meniefest.map((item, index) => {
            let obj = { ...item };
            obj.commit = ctx.writeTpl('[{commit}]({repo}/commit/{hash})', {
                ...obj
                // ...github,
            });
            return obj
        });

        // option.tpl = `{hash}|{type}|{subject}`;
        // let body = ctx.renderLine().join("\n");
        const body = meniefest
            .map(
                line => ctx.writeTpl('{commit}|{type}|{subject}', line) // ...line, ...github }
            )
            .join('\n');

        const head = getHeadByKeys('commit|type|desciption', 'l');
        const table = `${head}\n${body}\n\n`;

        let res = '';
        let whtpl = '<a name="{version}"></a>\n# {version}({date})\n### {libname}\n{changes}';
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

/* eslint-disable class-methods-use-this */
// cls-plugin-mdlist
// cls-plugin-mdtable

// def-plugin
// run-plugin
/** @typedef {{style:string}} option */

/**
 * @sample
 * ```
 * //
 * chaneglog.data=[]
 * changelog.option={}
 * changelog.render()
 * ```
 */
class ChangelogStyle {
  constructor() {
    this.init();
  }

  init() {
    /** @type {option} */
    this.option = {};
    this.data = [];
    this.result = '';
    this.plugin = [];
    return this
  }

  /**
   * bind write tpl to ctx
   * @param {string} tpl
   * @param {{}} data
   * @returns
   */
  writeTpl(tpl, data) {
    return writeTpl(tpl, data)
  }

  /**
   * redner with option.style or ctx.plugin
   * @returns {string}
   */
  render() {
    const ctx = this;

    // render with style and built in plugin
    const { option } = this;
    switch (option.style.toLowerCase()) {
      case 'list':
        return pluginList({})(ctx)
      case 'table':
        return pluginMarkdowntable({})(ctx)
    }

    // render with plugin list
    const { plugin } = this;
    for (let index = 0; index < plugin.length; index += 1) {
      const fn = plugin[index];
      fn(ctx);
    }
    return this.result
  }
}

const changelogstyle = new ChangelogStyle();
changelogstyle.plugin = [pluginMarkdowntable()];

export { ChangelogStyle, changelogstyle, pluginList as pluginMdList, pluginMarkdowntable as pluginMdtable };
