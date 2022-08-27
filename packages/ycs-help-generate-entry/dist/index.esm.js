/**
  * ycsHelpGenerateEntry v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
// idea:easier,faster to write ycs-cli entrys when you clify your lib to ycs-cli
// input entry
// define a handle fun
// bind a handle fun to ns,cmd

// ge.entrys(entrys).bind(cmd,defFun,'call')
// ge.entrys(entrys).bind(ns,defFun,'call')
// ge.entrys(entrys.ns).bind(subcmd,defFun,'call')
// ge is short for generate-entrys

class GE{
  constructor(){}

  entrys(entry){
    // set
    if(entry){
      this.context =entry;
      return this
    }
    // get
    return this.context
  }

  bind(subcmd='',defFun=()=>{},bindType=''){
    const entrys = this.entrys();

    subcmd.split('|').forEach(cmd => {
      let entry;
      switch (bindType.toLowerCase()) {
        case 'call':
          // feat: support call then bind entry
          entry = defFun(cmd);
          break;
      }
      // feat: support bind entry
      entrys[cmd] = entry;
    });
  }
}

export { GE as GenerateEntrys };
