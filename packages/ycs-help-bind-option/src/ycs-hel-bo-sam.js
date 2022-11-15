import BO from './ycs-hel-bo-api'

const { log } = console

const main = () => {
    const bo = new BO()
    // feat: add option
    bo.addOpt('-l,--loc the des file location')
    bo.addOpt('-h,--help get help')
    bo.addOpt('-v,--version get version')

    // feat:bind option to another subns,subcmd
    bo.getOpt('loc').bindOpt('eslint', 'add')
    // bo.logOpt('loc')

    // logMap()
    // log(getMap(bo.optionMap))

    // feat:option to usage
    log(bo.usage())
    // log(bo.usage('eslint','add'))
}
main()

// opv:
// 1. check this file js syantx
// node script/ycs-hel-bo-sam.js
