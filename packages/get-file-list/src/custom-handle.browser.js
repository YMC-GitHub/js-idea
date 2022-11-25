import { setCustomProp } from '@ymc/get-custom-prop/src/helps'
import handles from './custom-handle'
// import { readdirSync, statSync } from 'fs'
// setCustomProp(handles, 'readdirSync', readdirSync, { override: true })
// setCustomProp(handles, 'statSync', statSync, { override: true })
const { log } = console
/**
 * todo cutrom prop at some env
 * @param {string} prop
 * @param {string} env browser , node or other env
 * @param {boolean} exit
 * @returns
 */
function todo(prop, env = 'browser', exit = true) {
    return () => {
        log(`[info] todo cutrom prop ${prop} at ${env}`)
        if (exit) {
            process.exit(0)
        }
    }
}
setCustomProp(handles, 'readdirSync', todo('readdirSync'), { override: true })
setCustomProp(handles, 'statSync', todo('statSync'), { override: true })
export default handles
