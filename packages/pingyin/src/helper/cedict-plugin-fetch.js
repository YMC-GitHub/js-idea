import { exec } from 'child_process'
import fixMagicVar from './fix-magic-var'
import { resolve } from 'path'

const pExec = cmd =>
    new Promise((resolve, reject) => {
        exec(cmd, err => {
            if (err) reject(err)
            else resolve()
        })
    })

const download = async (url, file) => {
    console.log('Downloading CEDICT Archive')
    await pExec(`curl -sL ${url} > ${file}.zip`)

    console.log('Unpacking CEDICT Archive')
    await pExec(`unzip -np ${file}.zip > ${file}`)

    console.log('Cleaning up')
    await pExec(`rm -rf ${file}.zip`)

    return file
}

export async function fetch() {
    const { log } = console

    const { __dirname } = fixMagicVar()
    const url = 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip'
    const file = resolve(__dirname, '../../data/cedict_ts.u8')
    log(`[task] download cedict file .zip`)
    log(`[info] out: ${file}`)

    return download(url, file)
        .then(() => log('Done'))
        .catch(console.error)
}
export default download
