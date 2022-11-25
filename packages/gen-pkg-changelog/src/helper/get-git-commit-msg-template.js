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
export default getAngularStyleTpl
