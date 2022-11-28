import { addClassMethods } from './helps'
import getErrorMessage from './index'

class DataBase {
    constructor() {
        this.data = {}
    }
}

addClassMethods(
    {
        getErrorMessage,
        getDataBase(ns, sub) {
            const db = this[ns]
            return typeof db === 'function' ? db(sub) : db
        }
    },
    DataBase
)

const { log } = console
const db = new DataBase()
db.statusMessage = { 301: 'Moved Permanently' }
const msg = db.getErrorMessage('', '301', 'production')
log(msg)
log(db.getDataBase('statusMessage'))
export default DataBase
// node --no-warnings --loader ./scr/lib/esm-loader.js packages/get-error-message/src/demo.js
