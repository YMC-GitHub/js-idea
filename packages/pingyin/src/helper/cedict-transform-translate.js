// style or compact:
/* eslint-disable  no-unused-vars,prefer-const */
/* eslint-disable  no-continue */

import cedict from './cedict-transform-find'

export default function load(json) {
    const tool = cedict(json)
    const { find } = tool
    const translate = (from, to) => text => {
        let res
        res = find(text, from)
        // log(res)
        // ;[res] = res //use the first one
        // ;[,res] = res //use the last one
        // if (res) {
        //     res = res[to]
        // }
        // return res ? res : ''
        // let list = typeof text === 'string' ? [text] : text //words(text, / ?/)
        let list = Array.isArray(text) ? text : [text]
        list = list.map(word => {
            let translated
            let matched
            let useLasted
            // use the last or the first when many macth in dictionay
            useLasted = true
            for (let index = 0; index < res.length; index += 1) {
                const map = res[index]
                if (map[from] === word) {
                    // return map[to] ? map[to] : ''
                    translated = map[to] ? map[to] : ''
                    matched = true
                    if (useLasted) {
                        continue
                    } else {
                        break
                    }
                }
            }
            return translated || matched ? translated : word
        })
        return list
    }
    // const sim2pinNumber = translate('simplified', 'pinyin')
    // const getPinyinByHanzi = translate('traditional', 'pinyin')
    // const tra2sim = translate('traditional', 'simplified')
    // const sim2tra = translate('simplified', 'traditional')
    const getPinyinByTraditional = translate('traditional', 'pinyin')
    const getPinyinBySimplified = translate('simplified', 'pinyin')
    const getTraditionalBySimplified = translate('simplified', 'traditional')
    const getSimplifiedByTraditional = translate('traditional', 'simplified')

    return {
        ...tool,
        getPinyinByTraditional,
        getPinyinBySimplified,
        getTraditionalBySimplified,
        getSimplifiedByTraditional
    }
}
