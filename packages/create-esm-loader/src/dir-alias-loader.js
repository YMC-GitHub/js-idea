import path from 'path'
import { pathToFileURL } from 'url'

const components = '/path/to/components'
const directoryLoader = {
    resolve(specifier, ctx) {
        if (specifier.startsWith('@components/')) {
            let name = specifier.replace(/^@components\//, '')
            let file = path.join(components, name)
            let url = pathToFileURL(file).href
            return { url }
        }
    }
}

export default directoryLoader

//https://github.com/brev/esm-loaders/blob/main/packages/esm-loader-import-alias/src/index.ts

//https://github.com/nodejs/loaders-test/blob/main/commonjs-extension-resolution-loader/loader.js
//https://juejin.cn/post/7121530011655340046
//https://github.com/nodejs/loaders/blob/main/doc/resources.md

// export const { resolve, load } = await createLoader(directoryLoader);
// export const { resolve, load, getFormat, getSource, transformSource } = await createLoader(directoryLoader)

// Usage:
// import Component from '@components/component.js';
