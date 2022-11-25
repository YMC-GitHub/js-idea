import compare from './index'

const { log } = console

function infoPrefer(nodeversion, ver = '16.12.0') {
    let res
    // res = compare(nodeversion, ver)
    log(`[info] mock node version ${nodeversion}`)
    res = satisfies(nodeversion, ver)
    log(`[info] satisfies node ${ver} ${res}`)
}

function satisfies(ve1, ve2) {
    // let cps = `=,>,<,`
    const cpsReg = /=|>|</
    const matched = ve2.match(cpsReg)
    let cp
    let v2
    if (matched) {
        cp = matched[0]
        v2 = ve2.split(cpsReg)[1]
    } else {
        // return compare(ve1, ve2) >= 0
    }
    if (cp === '<') {
        return compare(ve1, ve2) === -1
    }
    if (cp === '=') {
        return compare(ve1, ve2) === 0
    }
    if (cp === '>') {
        return compare(ve1, ve2) === 1
    }
    return compare(ve1, ve2) >= 0
}

const nodeversion = process.version
log(`[info] node version ${nodeversion}`)
infoPrefer(nodeversion, '16.12.0')
infoPrefer(nodeversion, '<16.12.0')
infoPrefer(nodeversion, '>16.12.0')
// node --no-warnings --loader ./scr/lib/esm-loader.js  packages/compare-version/src/demo.js
