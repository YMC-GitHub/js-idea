/* eslint-disable camelcase */
// fix Identifier 'cp_exec' is not in camel case              camelcase
// fix Unexpected use of file extension "js" for "./util.js"  import/extensions
import { exec as cp_exec } from 'child_process'

export { execWraper as exec, defFixUnreadbleCode, setExecOptsForIconv } from './util'
export const execOpts = {
    exec: cp_exec
}
