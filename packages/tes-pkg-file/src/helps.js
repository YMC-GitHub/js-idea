import { exec, execOpts } from '@ymc/run-bash'
import { jsonstream } from '@ymc/json-stream-io'

const { log } = console
/**
 * get done or fail with condition
 * @param {*} cond
 * @param {string} done
 * @param {string} fail
 * @returns {string}
 */
function getFailOrDone(cond, done = 'done', fail = 'fail') {
  // get fail or done
  let state = fail
  if (cond) {
    state = done
  }
  return state
}

/* eslint-disable no-shadow */

/**
 * info cmd of tes , run cmd , log err and output,  get fail or done
 * @param {string} cmd
 * @param {{}} execOpts
 * @returns {string}
 */
async function runcmdWithState(cmd, execOpts) {
  log(`[info] run cmd: ${cmd}`)
  const { stderr, stdout } = await exec(cmd, execOpts)
  if (stderr) {
    log(stderr)
  }
  // log([stdout])
  log(stdout)
  const labels = 'todo,passing,fail'.split(',')
  let [, label] = labels
  // log([stderr])
  // log([stdout])

  if (stderr && /FAIL/g.test(stderr)) {
    ;[, , label] = labels
  } else if (stdout.indexOf('No tests found, exiting with code 0') >= 0) {
    ;[label] = labels
  }
  log(`[info] ${label} unit test`)
  return getFailOrDone(true, label, 'fail')
}
/* eslint-enable no-shadow */

/**
 * put pkgs-info
 * @param {string} name
 * @param {string} key
 * @param {string} state
 * @param {pkginfo[]} store
 * @returns {pkginfo[]}
 */
function putPkgsInfo(name, key, state, store) {
  const added = store.some(v => v.name === name)
  if (!added) {
    store.push({ name, [`${key}`]: state })
  } else {
    /* eslint-disable no-param-reassign */
    store.forEach(v => {
      if (v.name === name) {
        v[key] = state
      }
    })
    /* eslint-enable no-param-reassign */
  }
  return store
}

/**
 * get pkg name , set task state - use pkg name as primate key to match
 * @param {{pkgLoc:string,storeAt:string,key:string,state:string}} options
 */
async function setTaskState(options = {}) {
  // loc, key = 'lin_state', state = 'todo'
  const option = {
    key: 'lin_state',
    state: 'todo',
    storeAt: 'pkgs-info.json',
    ...options
  }
  let loc = option.pkgLoc

  log('[info] set lint state in store')
  jsonstream.init(`${option.pkgLoc}/package.json`)
  const pkgjson = await jsonstream.read({})

  loc = option.storeAt
  jsonstream.init(`${loc}`)
  const data = await jsonstream.read([])
  putPkgsInfo(pkgjson.name, option.key, option.state, data)
  await jsonstream.write(data)
  log(`[info] out: ${loc}`)
}

export { log, exec, execOpts, jsonstream, getFailOrDone, runcmdWithState, setTaskState }
