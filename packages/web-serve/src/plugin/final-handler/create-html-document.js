// import escapeHtml from 'escape-html'
import escapeHtml from '../escape-html'

const DOUBLE_SPACE_REGEXP = /\x20{2}/g
const NEWLINE_REGEXP = /\n/g

/**
 * create a minimal HTML document.
 *
 * @param {string} message
 */

function createHtmlDocument(message) {
    const body = escapeHtml(message).replace(NEWLINE_REGEXP, '<br>').replace(DOUBLE_SPACE_REGEXP, ' &nbsp;')

    return (
        '<!DOCTYPE html>\n' +
        '<html lang="en">\n' +
        '<head>\n' +
        '<meta charset="utf-8">\n' +
        '<title>Error</title>\n' +
        '</head>\n' +
        '<body>\n' +
        `<pre>${body}</pre>\n` +
        '</body>\n' +
        '</html>\n'
    )
}
export default createHtmlDocument
