/* eslint-disable camelcase */
import { toJson, linkMap, parseMap } from './helps'
import { en_zh_map } from './preset'
// import I18n from '@ymc/i18n'

/**
 *
 * @param {()=>{}} I18n class  ymc's I18n
 * @param {string} multiLineText  two language in multi-line-text
 * @param {string} en lang a
 * @param {string} en lang b
 * @returns {{}}  instance of i18n
 */
function main(I18n, multiLineText = en_zh_map, en = 'en', zh = 'zh', sc = '|') {
    const [entypes, zhtypes] = parseMap(multiLineText)

    const i8n = new I18n()
    // set type for language en
    i8n.lang(en)
    entypes.forEach(entype => {
        i8n.set(toJson(entype, sc))
    })
    // set express alias
    // i8n.set("chore", "tool"); //chore as keyword,tool as alias
    // i8n.addAlias('tool', 'chore') // tool as keyword,chore as alias

    // set type for language zh
    i8n.lang(zh)
    // i8n.set(linkMap(entype, zhtype, true));
    entypes.forEach((entype, index) => {
        const zhtype = zhtypes[index]
        if (zhtype) {
            i8n.set(linkMap(entype, zhtype, true, sc))
        }
    })
    return i8n
}
export default main
