/* eslint-disable no-useless-constructor,no-empty-function */
/* eslint-disable class-methods-use-this */

/* eslint-disable no-return-await */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */

import { jsonstream } from '@ymc/json-stream-io'
import { join } from 'path'
import fixMagicVar from './fix-magic-var'

async function loadjson(loc) {
    jsonstream.init(loc)
    return await jsonstream.read()
}
const { __dirname } = fixMagicVar()
const dicts = {
    path: join(__dirname, 'dict2'),
    one: join(__dirname, 'dict2', 'word_1.json'),
    two: join(__dirname, 'dict2', 'word_2.json'),
    three: join(__dirname, 'dict2', 'word_2.json'),
    four: join(__dirname, 'dict2', 'word_4.json')
}
class Pinyin {
    constructor() {}

    async convert(str) {
        const { length } = str
        if (length === 4) {
            const res = await this.fourWordMap(str)
            if (res) return res

            let pinyin = ''
            for (const key in str) {
                pinyin += await this.oneWordMap(str[key])
            }
            return pinyin
        }
        if (length === 3) {
            const res = await this.threeWordMap(str)
            if (res) return res
            let pinyin = ''
            for (const key in str) {
                pinyin += await this.oneWordMap(str[key])
            }
            return pinyin
        }
        if (length === 2) {
            const res = await this.twoWordMap(str)
            if (res) return res

            let pinyin = ''
            for (const key in str) {
                pinyin += await this.oneWordMap(str[key])
            }
            return pinyin
        }
        if (length === 1) {
            const res = await this.oneWordMap(str)
            if (res) return res
        }
        let pinyin = ''
        for (const key in str) {
            pinyin += await this.oneWordMap(str[key])
        }
        return pinyin
    }

    async fourWordMap(str) {
        const dictionary = await loadjson(dicts.four)
        const myMap = new Map(dictionary)

        if (myMap.has(str)) {
            return myMap.get(str)
        }
        return false
    }

    async threeWordMap(str) {
        const dictionary = await loadjson(dicts.three)
        const myMap = new Map(dictionary)

        if (myMap.has(str)) {
            return myMap.get(str)
        }
        return false
    }

    async twoWordMap(str) {
        const dictionary = await loadjson(dicts.two)
        const myMap = new Map(dictionary)

        if (myMap.has(str)) {
            return myMap.get(str)
        }
        return false
    }

    async oneWordMap(str) {
        const dictionary = await loadjson(dicts.one)
        const myMap = new Map(dictionary)

        if (myMap.has(str)) {
            return myMap.get(str)
        }
        return str
    }
}
const pinyin = new Pinyin()
export { Pinyin, pinyin }
