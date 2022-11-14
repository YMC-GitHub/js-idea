import { pathToFileURL } from 'url'

// @ymc/load-esm-config - load esm-format config
/**
 * once we have the path of the loader configuration we'll dynamically import it.
 * @param {string} file
 * @returns {Promise<string>}
 */
export default async function loadConfig(file) {
    const url = pathToFileURL(file).href
    const module = await import(url)
    return module.default
}
