import { cliOptionHelp } from '@ymc/cli-option'
import { main, param } from './ycs.main'

const ns = 'cmtedlog'
const version = '1.0.0'
// desc: get usage with @ycs/cli-option
main.usage = cliOptionHelp.param(param()).usage().replace('{ns}', ns)
main.notOnlyFlags = true
main.enableZeroOption = true
export { main, ns, version }
