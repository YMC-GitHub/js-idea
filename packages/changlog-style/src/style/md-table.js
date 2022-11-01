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
// render issue
// render body
// render subject
// render commit
// render head
// [{commit}]({repo}/commit/{hash})|{type}|{subject}({issue})
export default function pluginMdtable(pluginOpt = {}) {
  return ctx => {
    const { data, option } = ctx
    // const github = {
    //     repo: option.repo
    // }

    // render issue for github
    // render issue with plugin tpl
    // [issue1,issue] => renderedIssueTxt1,renderedIssueTxt12
    let meniefest
    meniefest = data.map(item => {
      let { issue } = item
      // console.log(item);
      // ?. //fix: cannot read properties of undefined
      // [#{issue}]({repo}/pull/{issue})

      if (issue?.length > 0) {
        issue = issue.filter(v => v)
        item.issue = issue
          .map(ic =>
            ctx.writeTpl('[#{issue}]({repo}/pull/{issue})', {
              issue: ic.trim().replace(/^#/, '')
              // ...github,
            })
          )
          .join(',')
      } else {
        item.issue = ''
      }
      return item
    })
    // ctx.data = data;

    // render subject
    meniefest = meniefest.map((item, index) => {
      const { issue } = item
      if (issue.length > 0) {
        item.subject = ctx.writeTpl('{subject}({issue})', item)
      } else {
        item.subject = ctx.writeTpl('{subject}', item)
      }
      return item
    })

    meniefest = meniefest.map((item, index) => {
      item.commit = ctx.writeTpl('[{commit}]({repo}/commit/{hash})', {
        ...item
        // ...github,
      })
      return item
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
    if (meniefest.length > 0) {
      res = ctx.writeTpl('<a name="{version}"></a>\n# {version}({date})\n### {libname}\n{changes}', {
        date: meniefest[0].date,
        changes: table
      })
      ctx.result = res
    }

    return res
  }
}
