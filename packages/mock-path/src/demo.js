import { parse } from 'path'
const { log } = console
function main() {
    let res
    log(parse('./package/noop')) //{ root: '', dir: './package', base: 'noop', ext: '', name: 'noop' }
    log(parse('/package/noop')) //{ root: '/', dir: '/package', base: 'noop', ext: '', name: 'noop' }
    log(parse('/h/package/noop/index.js'))
    // res = {
    //     root: '/',
    //     dir: '/h/package/noop',
    //     base: 'index.js',
    //     ext: '.js',
    //     name: 'index'
    // }
    log(parse('H:\\package\\noop\\index.js'))
    // res = {
    //     root: 'H:\\',
    //     dir: 'H:\\package\\noop',
    //     base: 'index.js',
    //     ext: '.js',
    //     name: 'index'
    // }
    log(parse('h:\\package\\noop\\index.js'))
    // res = {
    //     root: 'h:\\',
    //     dir: 'h:\\package\\noop',
    //     base: 'index.js',
    //     ext: '.js',
    //     name: 'index'
    // }
    log(parse('.')) //{ root: '', dir: '', base: '.', ext: '', name: '.' }
    log(parse('/')) //{ root: '/', dir: '/', base: '', ext: '', name: '' }
    log(parse('C://')) //{ root: 'C:/', dir: 'C:/', base: '', ext: '', name: '' }
    log(parse('C:\\')) //{ root: 'C:\\', dir: 'C:\\', base: '', ext: '', name: '' }
}
main()
//main
// node packages/mock-path/src/demo.js
