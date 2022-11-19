import { exec } from 'child_process'
import { resolve as resolvePath } from 'path'
import fixMagicVar from './fix-magic-var'

const { log, error } = console

const pExec = cmd =>
    new Promise((resolve, reject) => {
        exec(cmd, err => {
            if (err) reject(err)
            else resolve()
        })
    })

const download = async (url, file) => {
    log('Downloading CEDICT Archive')
    await pExec(`curl -sL ${url} > ${file}.zip`)

    log('Unpacking CEDICT Archive')
    await pExec(`unzip -np ${file}.zip > ${file}`)

    log('Cleaning up')
    await pExec(`rm -rf ${file}.zip`)

    return file
}

export async function fetch() {
    const { __dirname } = fixMagicVar()
    const url = 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip'
    const file = resolvePath(__dirname, '../../data/cedict_ts.u8')
    log('[task] download cedict file .zip')
    log(`[info] out: ${file}`)

    return download(url, file)
        .then(() => log('Done'))
        .catch(error)
}
export default download
