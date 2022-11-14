import readJsonSync from './read-json-sync'
// import { jsonstream } from '@ymc/json-stream-io'

/**
 * load alias from file
 * @param {string} name
 * @returns {{}}
 */
function loadAlias(name = 'module-alias.json') {
    // return jsonstream.init(name).read({})
    // std 1.2 get alias map
    const data = readJsonSync(name, {})
    return data
}

export default loadAlias
