/* eslint-disable no-console */
import { matchExts } from './helps'

const NAME = 'esm-loader-text-file'
const EXTS = ['.md', '.css', '.html', '.htm', '.svg']

const textFileLoader = {
  resolve(specifier, opts) {
    if (!matchExts(specifier, EXTS)) return undefined
    const { debug, parentURL } = opts
    if (debug) console.log(`[${NAME}] resolve: ${specifier}`)
    const url = new URL(specifier, parentURL).href
    return { url }
  },
  format(url, opts) {
    const { debug } = opts
    // if (semver.gte(process.versions.node, '16.12.0')) return undefined
    // node<16.12
    if (!matchExts(url, EXTS)) return undefined
    if (debug) console.log(`[${NAME}] format: ${url}`)
    return { format: 'module' }
  },
  transform(source, opts) {
    const { debug, url } = opts
    if (!matchExts(url, EXTS)) return undefined
    if (debug) console.log(`[${NAME}] transform: ${url}`)
    const result = `export default ${String(source)}`
    return { source: result }
  }
}
export default textFileLoader
