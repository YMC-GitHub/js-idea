import { TextStream } from '@ymc/text-stream-io'

class ChanelogFile extends TextStream {
    constructor(name = 'CHANGELO.md') {
        super()
        this.init(name)
    }

    getLastCommitLabel(fReg = /\[[0-9a-z]{9}\]/gi, rReg = /^\[|\]$/gi) {
        const { file } = this
        const match = file.data.match(fReg)
        let res = ''

        if (match) {
            ;[res] = match
        }

        res = res.replace(rReg, '')
        // log(match,res)
        return res
    }

    init(name = 'CHANGELO.md') {
        this.file = {
            name,
            data: ''
        }
        this.option = {}
    }
}
const changelogfile = new ChanelogFile()
export { ChanelogFile, changelogfile }
