/*eslint-disable */

function encodeUtf8(string) {
    let utftext = ''
    string = string.replace(/\r\n/g, '\n')
    // idea:
    // put-eol
    for (let n = 0; n < string.length; n++) {
        const c = string.charCodeAt(n)

        if (c < 128) {
            utftext += String.fromCharCode(c)
        } else if (c > 127 && c < 2048) {
            utftext += String.fromCharCode((c >> 6) | 192)
            utftext += String.fromCharCode((c & 63) | 128)
        } else {
            utftext += String.fromCharCode((c >> 12) | 224)
            utftext += String.fromCharCode(((c >> 6) & 63) | 128)
            utftext += String.fromCharCode((c & 63) | 128)
        }
    }

    return utftext
}

function decodeUtf8(utftext) {
    let string = ''
    let i = 0
    let c
    let c1
    let c2
    let c3
    c = c1 = c2 = 0

    while (i < utftext.length) {
        c = utftext.charCodeAt(i)

        if (c < 128) {
            string += String.fromCharCode(c)
            i++
        } else if (c > 191 && c < 224) {
            c2 = utftext.charCodeAt(i + 1)
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
            i += 2
        } else {
            c2 = utftext.charCodeAt(i + 1)
            c3 = utftext.charCodeAt(i + 2)
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
            i += 3
        }
    }

    return string
}

export { encodeUtf8, decodeUtf8, encodeUtf8 as encode, decodeUtf8 as decode }
