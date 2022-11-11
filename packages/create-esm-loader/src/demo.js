// const config = {
//     resolve(specifier, opts) {
//         return { url }
//     },
//     format(url, opts) {
//         return { format }
//     },
//     fetch(url, opts) {
//         return { source }
//     },
//     transform(source, opts) {
//         return { source }
//     }
// }
// export default config;

// import createLoader from './index'

// <16.12
// export const { resolve, getFormat, getSource, transformSource, load } = await createLoader(config)

// >16.12
// export const { resolve,load } = await createLoader(config)

// export const { resolve, load } = await createLoader({
//     resolve(specifier, opts) {
//         let url = new URL(specifier, opts.parentURL)
//         if (url.pathname.endsWith('.vue')) {
//             return {
//                 format: 'module',
//                 url: url.href
//             }
//         }
//     }
// })

// Standalone vs composable loaders
// export default config;
