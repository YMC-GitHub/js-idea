/* eslint-disable no-unused-vars,import/extensions */
/* eslint-disable import/prefer-default-export */

import { addDateMethods, formatDate } from './helps.js'

addDateMethods({
    formatDate(format) {
        return formatDate(format, this)
    },
    format(format) {
        return formatDate(format, this)
    }
})
//no-extend-native?
// Date.prototype.formatDate = function (format) {
//     return formatDate(format, this)
// }
