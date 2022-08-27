import { exec as cp_exec } from 'child_process'

export { execWraper as exec } from './util.js'

export const execOpts = {
  exec: cp_exec
}
