import { exec, execOpts } from '@ymc/run-bash'
import { camelize } from '@ymc/extend-string'
import { jsonstream } from '@ymc/json-stream-io'
// import chaintask from '@ymc/chain-task'
import { dirname, basename } from './mock'

const { log } = console
/**
 * get lib name with working dir
 * @param {string} wkd
 * @param {{trim?:boolean,camelize?:boolean}} option
 * @returns
 */
function getLibNameFromPath(wkd, option = {}) {
    let res = basename(wkd)
    const opt = {
        trim: true,
        ...option
    }
    if (opt.trim) {
        res = res.trim()
    }
    if (opt.camelize) {
        res = camelize(res)
    }
    return res
}

/**
 * get lib dir with working dir
 * @param {string} wkd
 * @returns
 */
function getPackagesLocFromPath(wkd) {
    return dirname(wkd)
}

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
 * info cmd of lin , run cmd , log err and output,  get fail or done
 * @param {string} cmd
 * @param {{}} execOpts
 * @returns {string}
 */
async function runeslint(cmd, execOpts) {
    log(`[info] run cmd: ${cmd}`)
    const { stderr, stdout } = await exec(cmd, execOpts)
    if (stderr) {
        log(stderr)
    }
    log(stdout)

    //   let labels = 'todo,passing,fail'.split(',')
    let label
    if (stderr === '') {
        label = 'passing'
    } else {
        label = 'fail'
    }
    log(`[info] lint files ${label}`)
    return getFailOrDone(true, label)
    //   return getFailOrDone(stderr === '', 'passing', 'fail')
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
 * get pkg name , set lin state - use pkg name as primate key to match
 * @param {{pkgLoc:string,storeAt:string,key:string,state:string}} options
 */
async function setLinState(options = {}) {
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

export {
    getLibNameFromPath,
    getPackagesLocFromPath,
    exec,
    execOpts,
    jsonstream,
    getFailOrDone,
    putPkgsInfo,
    runeslint,
    setLinState
}
