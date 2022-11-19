const bindCedict = json => k => id => json.filter(v => v[k] === id)
export default function load(json) {
    const query = bindCedict(json)
    const findInSimplified = query('simplified')
    const findInTraditional = query('traditional')
    const findInPinyin = query('pinyin')
    const findInEnglish = query('english')
    const find = (text, type) => {
        let res
        let handle
        switch (type) {
            case 'traditional':
                handle = findInTraditional
                break
            case 'pinyin':
                handle = findInPinyin
                break
            case 'english':
                handle = findInEnglish
                break
            case 'simplified':
            default:
                handle = findInSimplified
                break
        }
        if (Array.isArray(text)) {
            res = text.map(handle)
        } else {
            res = handle(text)
        }
        return res.flat(Infinity)
    }
    return {
        bindCedict,
        query,
        findInSimplified,
        findInTraditional,
        findInPinyin,
        findInEnglish,
        find
    }
}
// todo
// class Dic {
//     constructor() {
//         this.data = []
//     }
//     findInSimplified(text) {
//         return bindCedict(this.data)('simplified')(text)
//     }
// }
// //dic.load()
// //dic.find()
