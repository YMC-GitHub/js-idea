import shuffle from './shuffle-array'
/**
 * gen random fn
 * @param {()=>string[]} fn
 * @returns {(length:number)=>string}
 */
export default function randomFnGenerateor(fn) {
    /**
     * get random chars
     * @param {number} length
     * @returns {string}
     */
    return function randomValues(length) {
        let chars = fn()
        let res = []
        for (let i = 0; i < 100000; i += 1) {
            chars = shuffle(chars)
        }
        res = chars.slice(0, length)
        return res.join('')
    }
}

// /**
//  * get random int
//  * @param {number} min
//  * @param {number} max
//  * @returns
//  */
// function randomInt(min, max) {
//     let { random } = Math
//     return parseInt((max - min) * random() + min)
// }
