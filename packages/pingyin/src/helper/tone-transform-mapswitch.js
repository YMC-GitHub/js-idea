function convertmap(unimap, options = {}) {
    const option = {
        to: 'hex', // 'dec'
        switchkey: false,
        ...options
    }
    const numbers = Object.keys(unimap) // [ '1', '2', '3', '4' ]
    const keys = Object.keys(unimap['1']) // [ 'a', 'e', 'i', 'o', 'u', 'ü' ]
    const nmap = {}
    const { to, switchkey } = option
    numbers.forEach(v => {
        const val = unimap[v]
        keys.forEach(kk => {
            // if (!nmap[kk]) nmap[kk] = {}
            // nmap[kk][v] = unimap[v][kk].charCodeAt(0)

            // uni-map to dec-map
            let res
            res = val[kk].charCodeAt(0)
            if (to === 'dec') {
                res = `&#${res};`
            }
            if (to === 'hex') {
                res = Number(res).toString(16)
                res = `&#x${res};`
            }

            if (switchkey) {
                if (!nmap[kk]) nmap[kk] = {}
                nmap[kk][v] = res
            } else {
                if (!nmap[v]) nmap[v] = {}
                nmap[v][kk] = res
            }
        })
    })
    // log(nmap)
    return nmap
}
export default convertmap
