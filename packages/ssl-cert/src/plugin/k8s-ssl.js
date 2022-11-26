/* eslint-disable  no-unused-vars,prefer-const */
/* eslint-disable  func-names */
/* eslint-disable  max-len */

const HOSTS_LOOP_BUILTIN_DOMAIN = ['localhost']
const HOSTS_LOOP_BUILTIN_IP = ['127.0.0.1']

const HOSTS_K8S_BUILTIN_DOMAIN = [
    'kubernetes',
    'kubernetes.default',
    'kubernetes.default.svc',
    'kubernetes.default.svc.cluster',
    'kubernetes.default.svc.cluster.local'
]
const HOSTS_K8S_BUILTIN_MASTER_DOMAIN = ['*.kubernetes.master']
const HOSTS_K8S_BUILTIN_SERVICE_IP = ['10.192.44.129', '10.192.44.128', '10.192.44.126', '10.192.44.127', '10.254.0.1']

const CONFIG_K8S_CSR = {
    name: 'kubernetes-csr.json',
    data: {
        CN: 'kubernetes',
        hosts: [
            '127.0.0.1',
            '10.192.44.129',
            '10.192.44.128',
            '10.192.44.126',
            '10.192.44.127',
            '10.254.0.1',
            '*.kubernetes.master',
            'localhost',
            'kubernetes',
            'kubernetes.default',
            'kubernetes.default.svc',
            'kubernetes.default.svc.cluster',
            'kubernetes.default.svc.cluster.local'
        ],
        key: {
            algo: 'rsa',
            size: 2048
        },
        names: [
            {
                C: 'CN',
                ST: 'GuangDong',
                L: 'ShenZhen',
                O: 'k8s',
                OU: 'System'
            }
        ]
    }
}
const CONFIG_K8S_CSR_ADMIN = {
    name: 'admin-csr.json',
    data: {
        CN: 'admin',
        hosts: [],
        key: {
            algo: 'rsa',
            size: 2048
        },
        names: [
            {
                C: 'CN',
                ST: 'GuangDong',
                L: 'ShenZhen',
                O: 'system:masters',
                OU: 'System'
            }
        ]
    }
}

const CONFIG_CA_CSR = {
    name: 'ca-csr.json',
    data: {
        CN: 'kubernetes',
        key: {
            algo: 'rsa',
            size: 2048
        },
        names: [
            {
                C: 'CN',
                ST: 'GuangDong',
                L: 'ShenZhen',
                O: 'k8s',
                OU: 'System'
            }
        ],
        ca: {
            expiry: '87600h'
        }
    }
}
const CONFIG_CA_PROFILES = {
    name: 'ca-config.json',
    data: {
        signing: {
            default: {
                expiry: '87600h'
            },
            profiles: {
                kubernetes: {
                    usages: ['signing', 'key encipherment', 'server auth', 'client auth'],
                    expiry: '87600h'
                }
            }
        }
    }
}
function getK8sHosts() {
    return [
        HOSTS_LOOP_BUILTIN_IP,
        HOSTS_K8S_BUILTIN_SERVICE_IP,
        HOSTS_K8S_BUILTIN_MASTER_DOMAIN,
        HOSTS_LOOP_BUILTIN_DOMAIN,
        HOSTS_K8S_BUILTIN_DOMAIN
    ].flat(Infinity)
}

/**
 *
 * @param {string} s
 * @returns {string}
 * @sample
 * ```
 * let name=parseNames('CN/GuangDong/ShenZhen/k8s/System')
 * file.data.names.push(name)
 * ```
 */
function parseNames(s) {
    const list = s.split('/')
    const [C, ST, L, O, OU] = list
    // ST = classify(ST)
    // L = classify(L)
    // OU = classify(OU)
    return {
        C,
        ST,
        L,
        O,
        OU
    }
}

/**
 *
 * @param {string|string[]} domain
 * @returns {string[]}
 */
function nomarlizeHosts(domain) {
    let host
    if (domain) {
        host = Array.isArray(domain) ? domain : [domain]
    } else {
        host = []
    }
    return host
}
/**
 *
 * @param {string[]} domain
 * @param {string[]} ip
 * @param {string[]} excludes
 * @returns {string[]}
 */
function getHosts(domain, ip, excludes) {
    let list = [
        nomarlizeHosts(ip),
        HOSTS_LOOP_BUILTIN_IP,
        HOSTS_K8S_BUILTIN_SERVICE_IP,
        nomarlizeHosts(domain),
        HOSTS_K8S_BUILTIN_MASTER_DOMAIN,
        HOSTS_LOOP_BUILTIN_DOMAIN,
        HOSTS_K8S_BUILTIN_DOMAIN
    ].flat(Infinity)
    list = [...new Set(list)]
    list = list.filter(v => !nomarlizeHosts(excludes).some(ev => ev === v))
    return list
}
export { getK8sHosts, getHosts, parseNames, CONFIG_CA_PROFILES, CONFIG_CA_CSR, CONFIG_K8S_CSR, CONFIG_K8S_CSR_ADMIN }
// https://www.yisu.com/zixun/24391.html
