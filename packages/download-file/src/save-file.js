/* eslint-disable no-unused-vars */

import './types'
import { createWriteStream, mkdirSync, rmSync, existsSync } from 'fs'
import { log, getDirLoc } from './helps'

function makeTargetFileDir(targetFile) {
    const loc = getDirLoc(targetFile)
    if (loc && loc !== '.' && loc !== '..') {
        mkdirSync(loc, { recursive: true })
    }
}
/**
 * save downloaded file
 * @param {saveFileThroughStreamOption} option
 */
function saveFileThroughStream(option) {
    const { response, data, stream, targetFile, resolve } = option
    let fileWriter
    if (!stream) {
        // feat: make targetFile loc
        makeTargetFileDir(targetFile)
        // feat: create writestream when passed file loctation and not stream
        fileWriter = createWriteStream(targetFile)
    } else {
        fileWriter = stream
    }

    fileWriter.on('finish', () => {
        // resolve({})
        // desc: reslove data when reponse finish saving to file
        resolve(data)
    })
    response.pipe(fileWriter)
}

export default saveFileThroughStream
