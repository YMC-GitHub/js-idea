// function getA() {
//     let A = str2uni('ɑɑ̄ɑ́ɑ̌ɑ̀')
//         .replace(/\\u0251/gi, '')
//         .split(/\\u/)
//         .filter(v => v)
//     A.unshift('0251')
//     A = A.map((v, i) => {
//         if (i === 0) {
//             return v.replace(/^/, ' ')
//         }
//         return v.replace(/^/, ' 0251 ')
//     })
//     log(A)
// }
// function getB() {
//     let B = str2uni('aāáǎà')
//         .split(/\\u/)
//         .filter(v => v)
//     log(B)
// }
// getA()
// getB()

/**
 * prefer ɑ or a for ɑɑ̄ɑ́ɑ̌ɑ̀ and aāáǎà
 * @param {string} s
 * @param {boolean} sw switch prefers
 * @returns {string}
 */
export default function preferA(s, sw) {
    let txt = s
    let A = ['\u0251', '\u0251\u0304', '\u0251\u0301', '\u0251\u030c', '\u0251\u0300']
    let B = ['\u0061', '\u0101', '\u00e1', '\u01ce', '\u00e0']
    if (sw) [A, B] = [B, A]
    B.forEach((b, i) => {
        txt = txt.replace(new RegExp(b, 'ig'), A[i])
    })
    // txt = txt.replace(/\u0061/gi, '\u0251')
    // txt = txt.replace(/\u0101/gi, '\u0251\u0304')
    // txt = txt.replace(/\u00e1/gi, '\u0251\u0301')
    // txt = txt.replace(/\u01ce/gi, '\u0251\u030c')
    // txt = txt.replace(/\u00e0/gi, '\u0251\u0300')
    return txt
}

// const toneMarks = ['\u0304', '\u0301', '\u030c', '\u0300']
// function containTone(s) {
//     return toneMarks.some(v => s.indexOf(v) >= 0)
// }
// const removeTone = text => {
//     text = text.normalize('NFD').replace(/\u0304|\u0301|\u030c|\u0300/g, '')
//     return text.normalize('NFC').replace(/(\w|ü)[1-5]/gi, '$1')
// }
// const getToneNumber = text => {
//     // Check for tone number
//     const matches = text.match(/[a-zü](\d)/i)
//     if (matches) return +matches[1]
//     // Check for tone mark
//     for (let i = 0; i < toneMarks.length; i++) {
//         if (text.normalize('NFD').match(toneMarks[i])) return i + 1
//     }
//     // Return 5th tone as default
//     return 5
// }

// //perfera('a1 a2 a3 a4'.split(' '))).toStrictEqual(['ɑ̄', 'ɑ́', 'ɑ̌', 'ɑ̀'])
// const perfera = l => {
//     let hd = s => {
//         const tone = getToneNumber(s)
//         if (tone > 4) return s
//         return removeTone(s)
//             .replace('a', 'ɑ' + toneMarks[tone - 1])
//             .normalize('NFC')
//     }
//     return Array.isArray(l) ? l.map(hd) : hd(l)
// }

// export default perfera
