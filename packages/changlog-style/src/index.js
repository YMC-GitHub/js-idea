/* eslint-disable class-methods-use-this */
import { writeTpl } from '@ymc/render-tpl'
import pluginMdList from './style/md-list'
import pluginMdtable from './style/md-table'
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
        this.init()
    }

    init() {
        /** @type {option} */
        this.option = {}
        this.data = []
        this.result = ''
        this.plugin = []
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
        const ctx = this

        // render with style and built in plugin
        const { option } = this
        switch (option.style.toLowerCase()) {
            case 'list':
                return pluginMdList({})(ctx)
            case 'table':
                return pluginMdtable({})(ctx)
            default:
                break
        }

        // render with plugin list
        const { plugin } = this
        for (let index = 0; index < plugin.length; index += 1) {
            const fn = plugin[index]
            fn(ctx)
        }
        return this.result
    }
}

const changelogstyle = new ChangelogStyle()
changelogstyle.plugin = [pluginMdtable()]
export { ChangelogStyle, changelogstyle, pluginMdList, pluginMdtable }
