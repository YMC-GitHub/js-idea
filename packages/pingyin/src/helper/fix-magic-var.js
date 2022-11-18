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
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)
    return { __dirname, __filename }
}
