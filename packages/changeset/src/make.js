import './types'
/**
 * make changeset - def default .changeset/xx.md
 * @param {changesetMakeOption} option
 * @returns {string}
 */
export default function makeChangeset(option = {}) {
    const def = {
        // scope:'ymc',
        lib: 'noop',
        version: 'patch',
        msg: 'change all thing'
    }
    const { scope, lib, version, msg } = { ...def, ...option }
    const libname = scope ? `@${scope}/${lib}` : lib
    let res = `
---
"${libname}": ${version}
---

${msg}
`
    res = res.trim()
    return res
}
