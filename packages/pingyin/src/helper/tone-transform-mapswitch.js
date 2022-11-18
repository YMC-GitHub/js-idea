function convertmap(unimap, options = {}) {
    let option = {
        to: 'hex', //'dec'
        switchkey: false,
        ...options
    }
    let numbers = Object.keys(unimap) //[ '1', '2', '3', '4' ]
    let keys = Object.keys(unimap['1']) //[ 'a', 'e', 'i', 'o', 'u', 'ü' ]
    let nmap = {}
    let { to, switchkey } = option
    numbers.map(v => {
        let val = unimap[v]
        keys.forEach(kk => {
            // if (!nmap[kk]) nmap[kk] = {}
            // nmap[kk][v] = unimap[v][kk].charCodeAt(0)

            //uni-map to dec-map
            let res
            res = unimap[v][kk].charCodeAt(0)
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
