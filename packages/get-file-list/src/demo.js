import { getFilelist } from './helps'

const { log } = console
function getPkgsName() {
    // get pkg files
    const list = getFilelist('packages/get-file-list/src', { onlyName: false, recursive: true })
    log(list)
}
getPkgsName()
// node --no-warnings --loader ./scr/lib/esm-loader.js  packages/get-file-list/src/demo.js
