// #!/usr/bin/env node

import entrys from './jcm-clify.js'
import Ycs from './ycs-api.js'
import { installEntrys } from './ycs-too.js'
// ycs is short for YmcStyleCli(YSC)

// idea: use with cli
// ycs.version('1.0.0').entry(entrys).run()
const ycs = new Ycs()
installEntrys(entrys)(ycs)
ycs.run(process.argv)
// function main(ycs)(){}

// usage:
// 1. add execable
// chmod +x script/jcm-cli.js
// 2. scr it
// node script/jcm-cli.js add -k jcm --value bin/index.js
// 3. cli fy
// script/npm-bin.js add -k jcm -value bin/index.js
// script/jcm-cli.js -v
// 4. fly it
// npm-bin add -k jcm -v bin/index.js
// npm link
// jcm -v
