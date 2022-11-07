/**
  * addPkgDep v1.0.0
  * (c) 2018-2022 ymc
  * @license MIT
  */
import getFilelist from '@ymc/get-file-list';
import getNodeBuitInModule from '@ymc/get-node-builtin-modules';
import ParseHelp from '@ymc/dep-parse';
import { writeTpl } from '@ymc/render-tpl';
import { exec, execOpts } from '@ymc/run-bash';
import { camelize } from '@ymc/extend-string';
import '@ymc/json-stream-io';

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

/* eslint-disable no-shadow */
async function pnpm(cmd, execOpts) {
  const { stdout } = await exec(cmd, execOpts);
  return stdout
}

const { log } = console;

async function main(options = {}) {
  const option = {
    pkgLoc: './pacakges/noop',
    pnpmCmd: 'pnpm add --filter',
    pkgSrcLoc: 'src',
    ...options
  };
  const { pkgLoc, pkgSrcLoc } = option;
  const libdir = getPackagesLocFromPath(pkgLoc);
  const libname = getLibNameFromPath(pkgLoc);

  log('[info] get file list at loc');
  log(`[info] loc:${pkgLoc}/${pkgSrcLoc} `);
  const filelist = getFilelist(`${pkgLoc}/${pkgSrcLoc}`);
  // log(filelist);

  log('[info] get nodejs built in module');
  const nodedeps = getNodeBuitInModule();

  log('[info] get dep list of out-lib at loc');
  const prs = filelist.map(async file => {
    const ph = new ParseHelp();
    ph.option.nodedeps = nodedeps;
    ph.option.ignoreComment = true;
    await ph.parse(file);
    return ph.outlibDeps
    // return ph.inLibDeps
  });
  let deplist = await Promise.all(prs);
  deplist = [...new Set(deplist.flat(1))];
  log(deplist);

  let cmd;
  if (deplist && deplist.length > 0) {
    // log('[info] pnpm add dep of out-pkg at loc')
    // @ymc/add-pkg-dep-preset-pnpm
    // pnpm add -w {libdir}/{libname}
    // pnpm add --filter {libdir}/{libname}
    cmd = writeTpl(`${option.pnpmCmd} {libdir}/{libname} ${deplist.join(' ')}`, {
      libdir,
      libname
    });
    log(`[info] cmd:${cmd}`);
    await pnpm(cmd, execOpts);
  }
}

export { main as default };
