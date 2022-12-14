/**
 * get yinbiao from  hex-map text list
 * @param {*} hexmap
 * @returns
 */
function getbaseYuanyin(hexmap) {
    let list
    list = hexmap
        .trim()
        .split(/\r?\n/)
        .map(v => v.replace(/\s/gi, ' '))
    // del &#xxxx;
    // many space to one
    // del ends space
    list = list.map(
        v =>
            v
                .replace(/&#.{1,4};/gi, '')
                .replace(/ +/g, ' ')
                .replace(/ +/g, '') // / +$/ or / +/g ?
    )
    return list
}
function noop() {}
export { noop, getbaseYuanyin }
