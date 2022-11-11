/* eslint-disable  import/extensions,no-unused-vars,import/prefer-default-export */
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';

// const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../files')
// const config = {
//     resolve(specifier, opts) {
//         let url = new URL(specifier, opts.parentURL)
//         if (!url.pathname.endsWith('.txt')) return
//         return {
//             url: String(url),
//             format: 'module'
//         }
//     },
//     transform(source, opts) {
//         let url = new URL(opts.url)
//         if (!url.pathname.endsWith('.txt')) return
//         return `export default ${JSON.stringify(String(source))}`
//     },
//     load(url, opts, next) {}
// }
// export const { resolve, load } = await create(config)
// import load from '../../src/index.js'
import { load } from '../../dist/index.js';

export { load };
