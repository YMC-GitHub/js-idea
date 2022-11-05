/**
  * pkgsInfo v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import { camelize } from '@ymc/extend-string';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { jsonstream } from '@ymc/json-stream-io';
import chaintask from '@ymc/chain-task';

/**
 * mock node.js path.dirname
 * @param {string} wkd
 * @returns
 */
function dirname(wkd, sep = '/') {
  const list = wkd.split(/\/?\\|\//);
  return list.slice(0, list.length - 1).join(sep)
}
/**
 * mock node.js path.basename
 * @param {string} wkd
 * @returns
 */
function basename(wkd) {
  const list = wkd.split(/\/?\\|\//);
  return list[list.length - 1]
}

/* eslint-disable camelcase,max-len */ // data-requires

const { log } = console;

/**
 * get lib name with working dir
 * @param {string} wkd
 * @param {{trim?:boolean,camelize?:boolean}} option
 * @returns
 */
function getLibNameFromPath(wkd, option = {}) {
  let res = basename(wkd);
  const opt = {
    trim: true,
    ...option
  };
  if (opt.trim) {
    res = res.trim();
  }
  if (opt.camelize) {
    res = camelize(res);
  }
  return res
}

/**
 * get lib dir with working dir
 * @param {string} wkd
 * @returns
 */
function getPackagesLocFromPath(wkd) {
  return dirname(wkd)
}

/**
 * get file modified and created date
 * @param {string} loc
 * @returns {{modifiedAt:string,createdAt}}
 */
function getFileDatedAt(loc) {
  // log(`[info] get created_at, modified_at`)
  const stat = statSync(loc);
  const { birthtime: created, mtime: modifedData_at, ctime: modifiedStat_at } = stat;
  let modified = [modifedData_at, modifiedStat_at];
  // https://futurestud.io/tutorials/node-js-get-a-files-created-date
  modified = modified.sort((a, b) => new Date(b) - new Date(a));

  // .formatDate(`yyyy-MM-dd`)

  // log(
  //     `b:${formatDate('yyyy-MM-dd', new Date(created))} m:${formatDate(
  //         'yyyy-MM-dd',
  //         new Date(modifedData_at)
  //     )} c:${formatDate('yyyy-MM-dd', new Date(modifiedStat_at))} loc:${loc}`
  // )
  return { modifiedAt: modified[0], createdAt: created }
}

/**
 * @param {{wkd:string}} options
 * @returns {pkginfo}
 */
async function getPkgInfo(options = {}) {
  const option = {
    wkd: './private-pkgs/noop',
    ...options
  };
  const libname = getLibNameFromPath(option.wkd);
  const libdir = getPackagesLocFromPath(option.wkd);

  const loc = `${libdir}/${libname}/package.json`;
  jsonstream.init(loc);
  const data = await jsonstream.read({});

  // log(`[info] get name,desciption`)
  const { name, description } = data;
  // log(libname, libdir)
  // log(data)
  let modified_at = [];
  let created_at = [];

  const list = [`${libdir}/${libname}/package.json`, `${libdir}/${libname}/src/index.js`];
  list
    .filter(v => existsSync(v))
    .forEach(v => {
      const { modifiedAt, createdAt } = getFileDatedAt(v);
      modified_at.push(modifiedAt);
      created_at.push(createdAt);
    });
  // .flat(Infinity)

  modified_at = modified_at.sort((a, b) => new Date(b) - new Date(a));
  created_at = created_at.sort((a, b) => new Date(a) - new Date(b))
  ;[modified_at] = modified_at
  ;[created_at] = created_at;

  return {
    name,
    description,
    created_at,
    modified_at,
    loc
  }
}

/**
 *
 * @param {{packagesLoc:string|string[],split:string|regexp}} options
 * @returns {{wkd:stirng,libname:string,packagesLoc:string}[]}
 */
async function getPkgLocListInDir(options = {}) {
  const option = {
    packagesLoc: ['packages'],
    split: ',',
    ...options
  };
  // log(`[info] get pkg loc list`)

  // feat: split string to array when packagesLoc is string
  const dirs = Array.isArray(option.packagesLoc) ? option.packagesLoc : option.packagesLoc.split(option.split);
  let list = dirs
    .map(dir =>
      readdirSync(dir).map(name => ({
        wkd: `${dir}/${name}`,
        libname: name,
        packagesLoc: dir
        // libdir: dir
      }))
    )
    .flat(Infinity);
  // feat: only diretory
  list = list.filter(opt => statSync(opt.wkd).isDirectory());
  return list
}

/* eslint-disable prefer-const */

/**
 * put pkgs-info
 * @param {string} name
 * @param {string} key
 * @param {string} state
 * @param {pkginfo[]} store
 * @returns {pkginfo[]}
 */
function putPkgsInfo(name, key, state, store) {
  let added = store.some(v => v.name === name);
  if (!added) {
    store.push({ name, [`${key}`]: state });
  } else {
    store.forEach(v => {
      if (v.name === name) {
        v[key] = state;
      }
    });
  }
  return store
}

/**
 * merge pkgs-info
 * @param {pkginfo[]} now
 * @param {pkginfo[]} data
 * @returns {pkginfo[]}
 */
function mergPkgsInfo(now, data) {
  const res = {};

  now.forEach(v => {
    const { name } = v;
    res[name] = v;
  });
  data.forEach(v => {
    const { name } = v;
    if (res[name]) {
      res[name] = {
        ...res[name],
        ...v
      };
    } else {
      res[name] = v;
    }
  });
  return Object.values(res)
}

/**
 * pull pkgs-info
 * @param {{packagesLoc:string|string[]storeAt:string}} options
 */
async function pullPkgsInfo(options = {}) {
  let list;
  let tasks;
  let inPackagejson;
  let loc;
  list = await getPkgLocListInDir(options);
  tasks = list.map(opt => async () => await getPkgInfo(opt));

  let inPkgsInfo;
  inPackagejson = await chaintask(tasks);
  // log(data)

  loc = options.storeAt ? options.storeAt : 'pkgs-info.json';
  jsonstream.init(loc);
  inPkgsInfo = await jsonstream.read([]);

  const res = mergPkgsInfo(inPkgsInfo, inPackagejson);
  await jsonstream.write(res);
  log(`[info] out: ${loc}`);
}

/**
 * code pkgs-info
 * @param {{packagesLoc:string|string[],storeAt:string}} options
 */
async function codePkgsInfo(options = {}) {
  let list;
  let tasks;
  let inPackagejson;
  let loc;
  // codePkgsInfo({ packagesLoc: 'packages,private-pkgs' })
  list = await getPkgLocListInDir(options);
  tasks = list.map(opt => async () => await getPkgInfo(opt));

  let inPkgsInfo;
  inPackagejson = await chaintask(tasks);
  // log(inPackagejson)

  loc = options.storeAt ? options.storeAt : 'pkgs-info.json';
  jsonstream.init(loc);
  inPkgsInfo = await jsonstream.read([]);
  // log(inPkgsInfo)
  const res = mergPkgsInfo(inPackagejson, inPkgsInfo);
  await jsonstream.write(res);
  log(`[info] out: ${loc}`);
}

/**
 * push pkgs-info - update pkg.description
 * @param {{storeAt:string}} options
 */
async function pushPkgsInfo(options = {}) {
  let tasks;
  let data;
  let loc;
  loc = options.storeAt ? options.storeAt : 'pkgs-info.json';
  jsonstream.init(loc);
  data = await jsonstream.read([]);
  tasks = data.map(pkg => async () => {
    jsonstream.init(pkg.loc);
    let cache = await jsonstream.read({});
    cache.description = pkg.description;
    await jsonstream.write(cache);
    cache = null;
    // return cache
  });
  log(`[info] out: ${loc}`);
  await chaintask(tasks);
}

export { codePkgsInfo, pullPkgsInfo, pushPkgsInfo, putPkgsInfo };
