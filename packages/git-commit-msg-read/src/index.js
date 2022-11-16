/* eslint-disable no-unused-vars, prefer-const */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-use-before-define */
/* eslint-disable no-await-in-loop */
import { exec, execOpts } from '@ymc/run-bash' // ok
import { writeTpl } from '@ymc/render-tpl'
import { parse as parsemsg, getIssueInFoot } from '@ymc/git-commit-msg-parse'
import { inidata, bindVals, toArray } from './tools'
import './types'

// idea:
// ggi is short for get-commit-info
// pkg-design:
// ggi-api
// ggi-plugin-changelog

// too
/**
 * run git cmd
 * @param {string,string[]} cmd
 * @param {{}} execOption
 * @returns
 */
async function rungit(cmd, execOption) {
    const { stdout, stderr } = await exec(cmd, execOption)
    return stdout
}

/**
 * @description
 * ```
 * why used?
 * - [x] get git commit-msg data
 * - [x] gen changelog with commit-msg data
 * - [x] gen changelog for monorepo pkg
 * ```
 */
class Store {
    constructor() {
        this.infojson = []
        this.options = {}
        this.status = {}
    }

    /**
     *
     * @param {string} name
     * @param {string[]} list
     * @returns {this}
     */
    set(name, list) {
        const { infojson, status } = this
        // ini data
        if (!status.initeddata) {
            inidata(infojson, name, {})
            status.initeddata = true
        }
        // set
        bindVals(infojson, name, list)
        return this
    }

    getTpl(tpl, options = {}) {
        let res = tpl
        let option = {
            ...options,
            ...this.options
        }
        if (option.n) {
            res = `${tpl} -n ${option.n}`
        }
        return res
    }

    /**
     * get git commit hash
     * @returns {Promise<string>}
     */
    async getHash() {
        let tpl
        let cmd
        let res
        tpl = 'git log --pretty=format:"%H" --abbrev-commit' // %h
        tpl = this.getTpl(tpl)
        // -n 1
        cmd = writeTpl(tpl, {})
        res = await rungit(cmd, execOpts)
        return res
    }

    /**
     * get git commit msg subject
     * @returns {Promise<string>}
     */
    async getSubject() {
        let tpl
        let cmd
        let res
        tpl = 'git log --pretty=format:"%s" --abbrev-commit'
        tpl = this.getTpl(tpl)

        cmd = writeTpl(tpl, {})
        res = await rungit(cmd, execOpts)
        return res
    }

    /**
     * get git commit msg body
     * @returns {Promise<string>}
     */
    async getBody() {
        let tpl
        let cmd
        let res
        tpl = 'git log --pretty=format:"%b"'
        tpl = this.getTpl(tpl)

        cmd = writeTpl(tpl, {})
        res = await rungit(cmd, execOpts)
        return res
    }

    /**
     * get git commit author date
     * @returns {Promise<string>}
     * @description
     * ```
     * author date vs commit date?
     * ```
     */
    async getDate() {
        let tpl
        let cmd
        let res
        /// /git log --format=format:"%ai, %ci %aE %s"
        tpl = 'git log --pretty=format:"%as"' // %cs %ci %as %ai
        tpl = this.getTpl(tpl)

        cmd = writeTpl(tpl, {})
        res = await rungit(cmd, execOpts)
        return res
    }

    /**
     * get git commit files or other info in a commit
     * @param {string[]} list commit hash
     * @returns {Promise<[string[]]>}
     * @sample
     * ```
     * // get file in a commit
     * let hash = await it.getHash()
     * hash=toArray(hash)
     * let tpl = 'git show --pretty="" --name-only {commit}'
     * await it.getFile(hash,tpl)
     * // get msg body in a commit
     * let body = await this.getFile(hash, `git log --pretty=format:"%b" {commit}`);
     * body = body.map(v=>v.join("\n"))
     * ```
     * @description
     * ```
     * work-flow:
     * each-hash -> get-in-commit -> to-array
     * ```
     */
    async getFile(list, tpl) {
        // let { infojson } = this;
        let defalutTpl = 'git show --pretty="" --name-only {commit}'
        defalutTpl = this.getTpl(defalutTpl)

        const res = []
        for (let index = 0; index < list.length; index += 1) {
            const commit = list[index]
            const file = await getFilesInCommit(commit) // no-await-in-loop
            if (file) {
                res.push(toArray(file))
            }
        }
        return res
        async function getFilesInCommit(commit) {
            const cmd = writeTpl(tpl || defalutTpl, { commit })
            // if (tpl) console.log(cmd);
            return rungit(cmd, execOpts)
        }
    }

    /**
     * get commit msg info
     * @returns {Promise<commitInfoItem[]>}
     */
    async getinfo() {
        let hash
        let subject
        let body
        let file
        let date
        hash = await this.getHash()
        hash = toArray(hash)

        subject = await this.getSubject()
        subject = toArray(subject)
        // body = await this.getBody();
        // body = toArray(body);

        let tpl
        tpl = 'git log -n 1 --pretty=format:"%b" {commit}'
        // tpl = this.getTpl(tpl)
        body = await this.getFile(hash, tpl)
        body = body.map(item => item.join('\n'))
        // console.log(body);
        date = await this.getDate()
        date = toArray(date)
        file = await this.getFile(hash)
        // log(body);
        // return [];
        // return {hash,subject,body,date,file}
        let res
        res = hash.map((item, index) => {
            // const menifest = parsemsg(subject[index], body[index])
            let issue = ['']
            // getIssueInFoot(menifest.foot)
            return {
                commit: item.slice(1, 10),
                subject,
                body,
                // ...menifest,
                issue,
                hash: item,
                file: file[index],
                date: date[index] // date[index].split(" ")[0], //2022-08-09 00:00:00 +8000
            }
        })
        this.infojson = res
        return res
    }

    /**
     * get commit msg info -parsed subject and body
     * @returns {Promise<commitInfoItem[]>}
     */
    async parse() {
        let data = await this.getinfo()
        // log(`[task] parse gitlog`)
        data = data.map((item, index) => {
            let { subject, body } = item
            const menifest = parsemsg(subject[index], body[index])
            let issue = getIssueInFoot(menifest.foot)
            return {
                ...item,
                ...menifest,
                issue
            }
        })
        this.infojson = data
        return data
    }

    /**
     * filter info by file
     * @param {regexp} reg file regexp
     * @returns {commitInfoItem[]}
     * @sample
     * ```
     * store.filterInfoByFile(new RegExp(`packages/${libname}/`, "i"))
     * ```
     */
    filterInfoByFile(reg = /.*/i) {
        const { infojson } = this
        return infojson.filter(item => {
            if (item && item.file) {
                return item.file.some(file => reg.test(file))
            }
            return false
        })
    }

    /**
     * filter info since last commit id
     * @param {commitInfoItem[]} data
     * @param {string} lastId
     * @returns
     */
    filterSinceLastChanglog(data, lastId) {
        const cache = []
        for (let index = 0; index < data.length; index += 1) {
            const item = data[index]
            if (item.commit === lastId) {
                break
            }
            cache.push(item)
        }
        return cache
    }
}
const store = new Store()
export { store, Store }
