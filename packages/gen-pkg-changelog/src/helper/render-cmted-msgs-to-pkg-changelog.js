/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable no-use-before-define */

import { ChangelogStyle } from '@ymc/changlog-style'
import { readJsonSync, getLibNameFromPath, getPackagesLocFromPath, getLogInfo } from '../helps'

import { pluginRoottable, pluginRootList } from './changelog-style-template'
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
    }
    let res = Array.isArray(s) ? s : s.split(option.splitReg)
    if (!option.useEmpty) {
        res = res.filter(v => v)
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
    let text
    const option = {
        logInfo: false,
        // ignoreTypes: 'docs,chore,tool,style,',
        // latestCount: 8,
        ...options
    }
    const { wkd } = option

    const libname = getLibNameFromPath(wkd, { camelize: false })
    const libdir = getPackagesLocFromPath(wkd)

    const loginfo = getLogInfo(option.logInfo)
    loginfo('[info] read pkgs pkgjson ')
    const pkgjson = readJsonSync(`${libdir}/${libname}/package.json`, {})
    const { version, name } = { version: '0.0.1', ...pkgjson }

    loginfo('[info] grep pkgs commits')
    let cache
    const reg = new RegExp(`${libdir}/${libname}/`, 'i')
    cache = data.filter(v => v.file.some(f => reg.test(f)))
    // cache = gitlog.filterInfoByFile(new RegExp(`${libdir}/${libname}/`, 'i'))

    // log('[info] filter since last commit id')
    // cache = gitlog.filterSinceLastChanglog(cache, lastId)
    // filter:ignore docs
    // cache = gitlog.filterIgnoreScope(cache, docsReg);

    if (option.sinceDate) {
        loginfo('[info] only since date')
    }

    if (option.ignoreTypes) {
        loginfo('[info] filter types with ignore type')
        // cache = cache.filter(v => v.type !== 'docs')
        let ignoretypes = clihooks2array(option.ignoreTypes, { useEmpty: true })
        // ignore empty type
        // ignoretypes.push('')
        cache = cache.filter(v => !ignoretypes.some(vn => v.type === vn))
    }

    if (option.latestCount >= 1 && cache.length > 0) {
        loginfo('[info] only the latet count')
        cache = cache.slice(0, option.latestCount)
    }
    // only the latest
    // if (cache.length > 0) cache = cache[0];

    loginfo('[info] render new changlog')

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

export default render
