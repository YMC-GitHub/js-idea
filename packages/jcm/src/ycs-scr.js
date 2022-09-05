#!/usr/bin/env node

import Ycs from './ycs-api.js'
import entrys from './ycs-ins.js'

const run = () => {
  const ycs = new Ycs()
  const input = process.argv
  // ycs.entry(entrys).run(input)
  ycs.version('2.0.0').autosubns('npm|yarn|pnpm').autosubcmd('add|del|get|put').entry(entrys).run(input)
}

const main = () => {
  run()
  // const pc = new PCli()
  // pc.run()
}
main()

// chmod +x script/ycs-scr.js
// sample:
// node script/ycs-scr.js -a beep -b boop
// node script/ycs-scr.js -h 3 -w 4 -abc --beep=boop foo bar baz -xyz=2 --no-that --why because -- --no more -parse
// with space
// node script/ycs-scr.js -a beep -b "bo op"

// about flags vs _ vs extras
// with flags
// node script/ycs-scr.js -a beep -b boop
// with _
// node script/ycs-scr.js add -a beep -b boop
// with extras
// node script/ycs-scr.js -- -a beep -b boop
// node script/ycs-scr.js -- -a beep -b boop add bar

// get version
// node script/ycs-scr.js --version
// node script/ycs-scr.js -v

// get help
// node script/ycs-scr.js --help
// node script/ycs-scr.js -h
// node script/ycs-scr.js add -h

// log argv
// node script/ycs-scr.js add -a beep -b boop --debugArgs
// node script/ycs-scr.js add -a beep -b boop --debugArgs -- -a beep -b boop add bar
// node script/ycs-scr.js add -a beep -b boop --debugArgs add bar -- -a beep -b boop add bar

// chmod +x script/ycs-scr.js

// about ns,subns,subcmd
// node script/ycs-scr.js -h  //ns
// node script/ycs-scr.js add -h //ns subcmd
// node script/ycs-scr.js npm -h //ns subns
// node script/ycs-scr.js npm add -h //ns subns subcmd
