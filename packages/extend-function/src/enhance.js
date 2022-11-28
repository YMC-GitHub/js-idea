/* eslint-disable no-unused-vars,import/extensions */
/* eslint-disable import/prefer-default-export */

import { bind } from './base.js'
import { extendFunctionPrototype } from './helps.js'

extendFunctionPrototype('bind', bind)
extendFunctionPrototype('ymcBind', bind)

// export { bind }
