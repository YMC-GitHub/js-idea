import ts from 'typescript'
const tsLoader = {
    resolve(specifier, opts) {
        if (specifier.endsWith('.ts')) {
            let { parentURL } = opts
            let url = new URL(specifier, parentURL).href
            return { url }
        }
    },
    format(url, opts) {
        if (url.endsWith('.ts')) {
            return { format: 'module' }
        }
    },
    transform(source, opts) {
        const { url } = opts
        if (url.endsWith('.ts')) {
            const { outputText } = ts.transpileModule(String(source), {
                compilerOptions: {
                    module: ts.ModuleKind.ES2020
                }
            })
            return { source: outputText }
        }
    }
}
// to be used by other loader-engine
// refs:https://github.com/sebamarynissen/create-esm-loader#standalone-vs-composable-loaders
export default tsLoader

//https://github.com/brev/esm-loaders

// used by 'create-esm-loader':
// 1.x
// import createLoader from './index'
// export const { resolve, load } = await createLoader(tsLoader)

// 2.x
// import file from './file.ts'

// 3.x
//node --experimental-loader=node-esm-loader xx.js
//NODE_OPTIONS="--loader node-esm-loader" node index.js
//NODE_OPTIONS="--loader create-esm-loader" node index.js
