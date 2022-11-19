import { dirname } from 'path'
import { fileURLToPath } from 'url'

// fileURLToPath node.js 10.10.2

// fix:__dirname is not defined in ES module scope
/**
 * get magic var __dirname and __filename
 * @sample
 * ```
 * const  {__filename,__dirname }= fixMagicVar()
 * ```
 * @returns
 * @description
 * ```
 * when __dirname is not defined in ES module scope
 * ```
 */
export default function fixMagicVar() {
    const name = fileURLToPath(import.meta.url)
    const dir = dirname(name)
    return { __dirname: dir, __filename: name }
}
