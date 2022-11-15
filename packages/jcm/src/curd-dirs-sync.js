/* eslint-disable consistent-return */
import {
    existsSync as _existsSync,
    mkdirSync as _mkdirSync,
    readdirSync as _readdirSync,
    rmdirSync as _rmdirSync
} from 'fs'

import { dirname } from 'path'

// curd diretory sync
/**
 * make dirs sync
 * @param {string} dirPath
 * @returns {true}
 * @sample
 * ```
 * mkdirsSync('./src')
 * ```
 * @description
 * ```
 * ## why use ?
 * - [x] make dirs recursive
 * ## base
 * - [x] exist dir sync
 * - [x] get dir name
 * - [x] make a dir
 * ```
 */
function mkdirsSync(dirPath) {
    if (_existsSync(dirPath)) {
        return true
    }
    if (mkdirsSync(dirname(dirPath))) {
        _mkdirSync(dirPath)
        return true
    }
}

export const makeDirs = mkdirsSync
export const rmDirs = _rmdirSync
export const readDirs = _readdirSync
