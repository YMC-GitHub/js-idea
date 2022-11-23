/*eslint-disable */
import {
    shuffle,
    getEnglishChars,
    getHexChars,
    randomHexChars,
    randomEnglishChars,
    getBase32Chars,
    randomBase32Chars,
    getBase64Chars,
    randomBase64Chars
} from './ascii'
// idea:
// gen-az-by-code,genbase
// [64,97]

// idea:
// get-unit32-array,get-random-values,
// Crypto.getRandomValues()
// const array = new Uint32Array(10)

const { log } = console
// let uni, dec
// log(`[info] get str unicode`)
// dec = '°'
// //['°','\u00b0']
// uni = str2uni(dec)
// log(uni)
// dec = uni2str(uni)
// log(dec)
log('[info] get english 26 chars')
// log(getEnglishChars())
log(getEnglishChars().join(''))
log('[info] get random english chars')
log(randomEnglishChars(16))

log('[info] get hex chars')
// log(getHexChars())
log(getHexChars().join(''))
log('[info] get random hex chars')
log(randomHexChars(16))

log('[info] get base32 chars')
// log(getBase32Chars())
log(getBase32Chars().join(''))

log('[info] get random base32 chars')
log(randomBase32Chars(16))

log('[info] get base64 chars')
// log(getBase64Chars())
log(getBase64Chars().join(''))

log('[info] get random base64 chars')
log(randomBase64Chars(16))

log('[info] ramdom rate table')

function getStatistics(keys, shuffle = shuffle, count = 10000) {
    const statistics = new Array(keys.length).fill(0).map(() => new Array(keys.length).fill(0))
    for (let i = 0; i < count; i++) {
        keys = shuffle(keys)
        keys.forEach((value, index) => {
            statistics[index][value - 1]++
        })
    }
    return statistics
}
function calStatisticsScole(statistics, count = 10000) {
    return statistics.map(item => item.map(value => `${((value / count) * 100).toFixed(2)}%`))
}
function beaStatistics(statistics, vals) {
    const pros = []
    // vals.map(v => {
    //     pros[v] = {}
    //     vals.map(j => {
    //         pros[v][j] = 0
    //     })
    // })
    statistics.map((v, i) => {
        const namei = vals[i]
        pros[namei] = {}
        v.map((jv, ji) => {
            const namej = vals[ji]
            pros[namei][namej] = jv
        })
    })
    return pros
}

let keys
let vals
let shuffleCount

// arr = getHexChars().map((v, i) => i + 1)
// step 1.x set vals
// vals = randomHexChars(16).split('').slice(0, 8)
// vals = getEnglishChars().slice(0, 8)
vals = randomEnglishChars().split('').slice(0, 8)

// vals = rad.split('').slice(0, 8)

// step 2.x get keys by vals
// keys = [1, 2, 3, 4, 5, 6]
keys = vals.map((v, i) => i + 1)
log(vals.join(''))
// step 3.x get statistics by keys
shuffleCount = 10000
let statistics = getStatistics(keys, shuffle, shuffleCount)
statistics = calStatisticsScole(statistics, shuffleCount)
statistics = beaStatistics(statistics, vals)
console.table(statistics)

// log(statistics)
// console.table(statistics)
//  node --no-warnings --loader ./scr/lib/esm-loader.js packages/ed-unicode/src/ascii.demo.js
