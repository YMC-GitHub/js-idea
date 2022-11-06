import { readdirSync, statSync } from 'fs'
import { setCustomProp } from '@ymc/get-custom-prop/src/helps'
import handles from './custom-handle'

setCustomProp(handles, 'readdirSync', readdirSync, { override: true })
setCustomProp(handles, 'statSync', statSync, { override: true })
export default handles
