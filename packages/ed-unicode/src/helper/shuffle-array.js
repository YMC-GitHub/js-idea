// relative shuffle array - extend array
/**
 * shuffle array - vs array.sort+Math.random
 * @param {[]} array
 * @returns {[]}
 */
export default function shuffle(array) {
    const cache = [...array]
    // https://zhuanlan.zhihu.com/p/359994957
    // Fisher–Yates
    let j
    let x
    let i
    const len = cache.length
    const { floor, random } = Math
    for (i = len; i; i -= 1) {
        j = floor(random() * i)
        x = cache[i - 1]
        cache[i - 1] = cache[j]
        cache[j] = x
    }
    return cache
}
// /**
//  * shuffle array - array.sort+Math.random
//  * @param {[]} array
//  * @returns {[]}
//  */
// function shuffle(array) {
//     return array.sort(function () {
//         return Math.random() - 0.5
//     })
// }
