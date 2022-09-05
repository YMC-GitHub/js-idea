/**
  * jcm v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
/**
  * jcm v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
/**
  * jcm v0.0.1
  * (c) 2018-2022 ymc
  * @license MIT
  */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

// curd diretory sync
function mkdirsSync(dirPath) {
  if (existsSync(dirPath)) {
    return true
  }
  if (mkdirsSync(dirname(dirPath))) {
    mkdirSync(dirPath);
    return true
  }
}

const makeDirs = mkdirsSync;

const { log } = console;
const readJson = (jsonLoc, def = {}) => {
  let data;
  try {
    data = readFileSync(jsonLoc);
    data = JSON.parse(data);
  } catch (error) {
    data = def;
  }
  return data
};
const saveJson = (jsonLoc, data) => {
  writeFileSync(jsonLoc, JSON.stringify(data, null, 2));
};

// idea:
// get des dir
// log msg
// load pkg json
// update pkg json

// idea:genreate config to des dir
// make dir
// mgnt cnf

// idea: read config
// user-path-> project-path -> des-path
// rc is short for reading-config
// rc.use(userLevelJson).use(projLevelConf).use(destLevelConf).load()

const getUserHome = () => process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
// idea: use json conf
// uc is short for using conf
class UC {
  constructor() {
    this.list = [];
    this.index = -1;
    this.freeze = false;
  }

  use(config = {}, order) {
    let { list, index } = this;

    // feat: support index and order
    const useIndex = !order;

    // feat: auto increase index
    if (useIndex || index == order) {
      index++;
    } else if (index < order) {
      index = order;
    }
    // warn: update index in this (when number,string,boolean)
    this.index = index;

    index = useIndex ? index : order;
    if (config) {
      list[index] = config;
    }
    return this
  }

  load() {
    const { list } = this;
    let res = {};
    for (let index = 0; index < list.length; index++) {
      const config = list[index];
      if (config) {
        // res=Object.assign(res,config)
        res = { ...res, ...config };
      }
    }
    const { freeze } = this;
    if (freeze) {
      return Object.freeze(res)
    }
    return res
    // return Object.freeze(Object.assign({}, config, dotenv, node_env, argv))
  }
}

// idea: read conf
// a sam for rc
// rc is short for reading conf
const readConf = (cnfLocList = ['.ymcrc.json']) => {
  // let name='.ymcrc.json'
  // let userLoc=joinPath(getUserHome(),name)
  const rc = new UC();
  // rc.use(readJson(userLoc))
  // rc.use(readJson(name))
  // rc.use(readJson(joinPath(wkd,name)))
  // data = rc.load()
  // let cnfLocList = [joinPath(getUserHome(),name),name,joinPath(wkd,name)]
  for (let index = 0; index < cnfLocList.length; index++) {
    const cnfLoc = cnfLocList[index];
    rc.use(readJson(cnfLoc));
  }
  return rc.load()
};

// idea: get or set conf
// gsc.bind(data).split('.').conf(key,val)
// gsc is short for get-set-conf
class GSC {
  constructor() {
    this.data = {};
    this.option = {
      splitChar: '.'
    };
  }

  bind(data) {
    if (data) {
      this.data = data;
    }
    return this
  }

  split(s = '.') {
    if (s) {
      this.option.splitChar = s;
    }
    return this
  }

  conf(key = '', val) {
    if (!key) return this
    // note: extract com var
    let { data, option } = this;
    let last;

    // note: get name list
    key = key.split(option.splitChar);

    // note: get last name
    last = key[key.length - 1];

    // note: get prev data
    const { length } = key;
    for (let index = 0; index < length - 1; index++) {
      const name = key[index];
      // note: ini data in key when not dedfining
      if (!data[name]) {
        data[name] = {};
      }
      data = data[name];
      // data=data[name]?data[name]:{}
    }
    // log(key,data)

    // feat: get val
    if (val == undefined) {
      return data[last]
    }
    // feat: set val
    data[last] = val;
    log(`set ${last} ${val}`);
    // feat: support chain when setting
    return this
  }
}

// idea:
// read old
// update
// save new

const args = process.argv.slice(2);
if (args.length == 0) args[0] = 'packages/noop';
// log(args)

let wkd;
wkd = args[0];
// addDirs(wkd)
// delDirs(wkd)

let data;
const name = '.ymcrc.json';
const cnfLocList = [join(getUserHome(), name), name, join(wkd, name)];
data = readConf(cnfLocList);

const gsc = new GSC();
gsc.bind(data);
// preset - 1. set spilt char different with key 2. use one level
gsc.split('/');
gsc.conf('npm.user', 'hualei');
gsc.conf('git.user.name', 'ymc-github');
gsc.conf('git.user.email', 'ymc.github@gmail.com');
gsc.conf('git.remote', 'github');
gsc.conf('github.enable', true);
gsc.conf('github.user.name', 'ymc-github');
// gsc.conf('github.user.email','ymc.github@gmail.com')
gsc.conf('github.repo.name', 'sam');
gsc.conf('gitlab.enable', true);

gsc.conf('npm.scope', 'sam');
gsc.conf('npm.pkg', 'sam');
gsc.conf('is.monorepo', true);
gsc.conf('is.monorepo.root', true);
// gsc.conf(key,val)

// log(gsc.data)
data = gsc.data;

makeDirs(wkd);
saveJson(join(wkd, name), data);

// run as node script
// node script/conf-gen.js ./packages/noop
// node script/conf-gen.js packages/noop

// node script/conf-gen.js --des=packages/noop -c -u -w --name=.ymcrc.json
// idea: json conf mgnt
// jcm is short for json conf mgnt

// case - 1. set cnf
// jcm user.name ymc
// case - 1. get cnf
// jcm user.name

// case - 1. get cnf 2. set data file name
// jcm user.name --name=.ymcrc.json

// case - 1. set cnf 2. set data file dir 3. use current dir 4. use des dir 5. use user dir
// jcm user.name ymc --des=packages/noop -c -u -w --name=.ymcrc.json

// node script/jcm-api.js

export { readJson, saveJson };
