/* eslint-disable  no-param-reassign */
/**
 *
 * @param {object} methods
 * @param {Date} cls
 */
function addDateMethods(methods, cls = Date) {
    Object.entries(methods).forEach(([name, value]) => {
        // console.log(name, value)
        cls.prototype[name] = value
    })
}

/**
 * format date
 * @param {string} fmt
 * @returns {string}
 * @sample
 * ```
 * let now = new Date();
 * formatDate("yyyy-MM-dd HH:mm:ss",now);
 * ```
 * @description
 * ```
 * M+
 * ```
 */
function formatDate(fmt, ctx) {
    let res = fmt
    // let ctx = this;
    const o = {
        'M+': ctx.getMonth() + 1,
        'd+': ctx.getDate(),
        'H+': ctx.getHours(),
        'm+': ctx.getMinutes(),
        's+': ctx.getSeconds(),
        'S+': ctx.getMilliseconds()
    }
    let reg
    reg = /(y+)/
    if (reg.test(res)) {
        res = res.replace(reg, x => `${ctx.getFullYear()}`.substring(4 - x.length))
    }
    /* eslint-disable no-restricted-syntax,guard-for-in */
    for (const k in o) {
        reg = new RegExp(`(${k})`)
        if (reg.test(res)) {
            res = res.replace(reg, x => (x.length === 1 ? o[k] : `00${o[k]}`.substring(String(o[k]).length)))
        }
    }
    return res
}

export { addDateMethods, formatDate }
