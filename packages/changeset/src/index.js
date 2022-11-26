/* eslint-disable prefer-const,no-use-before-define,no-unused-vars */
import { createReadStream, createWriteStream } from 'fs'
import { readStream, writeStream } from '@ymc/stream-io'
import makeChangeset from './make'

import { parseChangeset, getVersionTypeInChangeset } from './parse'

function isString(s) {
    return typeof s === 'string'
}

// idea:pkg-design
// changeset-{make,write,read,parse}
// @ymc/changeset-make
// @ymc/changeset-io
// @ymc/changeset-parse

// @ymc/changeset-make

// idea: read-changeset -> get-version-type
// @ymc/changeset-parse

class Changeset {
    constructor(name) {
        this.init(name)
    }

    /**
     * read file async (stream mode)
     * @param {*} def
     * @returns {Prmosie<string>}
     */
    async read(def = '') {
        const { file } = this
        let reader
        let res
        reader = createReadStream(file.name)
        try {
            res = await readStream(reader)
        } catch (error) {
            res = def
        }
        file.data = res
        return res
    }

    /**
     * write file async (stream mode)
     * @param {string|undefined} text
     * @returns {Prmosie<void>}
     */
    async write(text) {
        const { file, option } = this
        let writer
        writer = createWriteStream(file.name)
        let data = text
        if (isString(data)) {
            file.data = data
        } else {
            data = file.data
        }
        await writeStream({ stream: writer, data })
    }

    init(name = 'CHANGELO.md') {
        this.file = {
            name,
            data: ''
        }
        this.option = {}
    }

    // idea: read-changeset -> get-version-type
    /**
     *
     * @param {string} libname
     * @returns
     * @description
     * ```
     * def-libname-regexp -> match -> slice
     *
     * ```
     * @sample
     * ```
     * it.file.data=`"@ymc/run-bash": patch`
     * let l='run-bash'
     * it.getLibVersionType(l) //patch
     * ```
     */
    getLibVersionType(libname) {
        const { file, option } = this
        return getVersionTypeInChangeset(file.data, libname)
    }

    parse() {
        const { file, option } = this
        return parseChangeset(file.data)
    }

    /**
     *
     * @param {changesetMakeOption} option
     * @returns
     */
    make(option) {
        const { file } = this
        const res = makeChangeset(option)
        file.data = res
        return res
    }
}

const changeset = new Changeset()
export { changeset, makeChangeset, parseChangeset }
