/*eslint-disable */

const toEscapeRegExp = /["'&<>]/

export default escapeHtml

/**
 * Escape special characters in the given string of text.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 */

function escapeHtml(string) {
    // feat: no assign param
    const str = `${string}`

    // feat: return origin value when no match
    const match = toEscapeRegExp.exec(str)
    if (!match) {
        return str
    }

    let escape
    let html = ''
    let index = 0
    let lastIndex = 0

    // feat: get escape char with char code map
    for (index = match.index; index < str.length; index += 1) {
        switch (str.charCodeAt(index)) {
            case 34: // "
                escape = '&quot;'
                break
            case 38: // &
                escape = '&amp;'
                break
            case 39: // '
                escape = '&#39;'
                break
            case 60: // <
                escape = '&lt;'
                break
            case 62: // >
                escape = '&gt;'
                break
            default:
                continue
        }

        if (lastIndex !== index) {
            html += str.substring(lastIndex, index)
        }

        lastIndex = index + 1
        html += escape
    }

    return lastIndex !== index ? html + str.substring(lastIndex, index) : html
}
